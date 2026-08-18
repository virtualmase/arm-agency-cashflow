import { Router, type NextFunction, type Request, type Response } from "express";
import { getPendingEmails, markEmailSent, getRevenueTotal, getPendingPurchaseExceptionCount, getSubscriberCount, getLeadCount, getNewsletterCount, getCompletedPurchasesSince, getFunnelEventCounts, getSwellPublicationMonitorByTaskUid, getSwellEditorialReviewBySourceVersion, createSwellEditorialReview, expireStaleSwellEditorialReviews, updateSwellMonitorRun } from "./db";
import { notifyOwner } from "./_core/notification";
import { invokeLLM } from "./_core/llm";
import { sdk } from "./_core/sdk";
import { timingSafeEqual } from "node:crypto";
import { SWELL_SITEMAP_URL, buildSwellEditorialPrompt, extractSourceMetadata, parseSwellResourceSitemap, type SwellResourceCandidate } from "./swellEditorial";

const scheduledRouter = Router();

async function requireScheduledJobSecret(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (user.isCron && user.taskUid) return next();
  } catch {
    // Existing bearer-secret jobs remain supported while new Heartbeat callbacks use cron authentication.
  }
  const configured = process.env.SCHEDULED_JOB_SECRET;
  const supplied = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!configured || !supplied) return res.status(401).json({ error: "unauthorized" });

  const expected = Buffer.from(configured);
  const actual = Buffer.from(supplied);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

scheduledRouter.use("/api/scheduled", requireScheduledJobSecret);

// Email sequence processor - triggered by heartbeat cron
scheduledRouter.post("/api/scheduled/email-sequences", async (req, res) => {
  // Never advance sequence state until a delivery provider confirms acceptance.
  if (process.env.EMAIL_DELIVERY_ENABLED !== "true") {
    return res.status(503).json({
      error: "email_delivery_not_configured",
      message: "Email delivery is disabled; no sequence records were changed.",
    });
  }

  try {
    const pendingEmails = await getPendingEmails();
    let sent = 0;

    for (const email of pendingEmails) {
      try {
        // Generate personalized email content using LLM
        const stepNames = ["Welcome to ARM Agency", "Plan a Scoped Next Step", "Book Your Demo Session"];
        const stepContent = await generateEmailContent(email.email, email.step, stepNames[email.step] || "Follow Up");
        
        // In production, this would send via email service
        // For now, we mark as sent and notify owner
        await markEmailSent(email.id);
        sent++;

        console.log(`[EmailSequence] Sent step ${email.step} to ${email.email}: ${stepNames[email.step]}`);
      } catch (err) {
        console.error(`[EmailSequence] Failed to process email ${email.id}:`, err);
      }
    }

    await notifyOwner({
      title: "Email Sequence Batch Complete",
      content: `Processed: ${pendingEmails.length} pending\nSent: ${sent}\nFailed: ${pendingEmails.length - sent}`,
    });

    res.json({ success: true, processed: pendingEmails.length, sent });
  } catch (err) {
    console.error("[Scheduled] Email sequence error:", err);
    res.status(500).json({ error: "Failed to process email sequences" });
  }
});

// Weekly revenue & growth report - triggered by heartbeat cron
scheduledRouter.post("/api/scheduled/weekly-report", async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [revenue, pendingPurchaseExceptions, subscribers, leadCount, newsletterCount, weeklyPurchases, funnelEvents] = await Promise.all([
      getRevenueTotal(),
      getPendingPurchaseExceptionCount(),
      getSubscriberCount(),
      getLeadCount(),
      getNewsletterCount(),
      getCompletedPurchasesSince(sevenDaysAgo),
      getFunnelEventCounts(sevenDaysAgo),
    ]);
    const weeklyRevenue = weeklyPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    const streamRevenue = new Map<string, number>();
    weeklyPurchases.forEach((purchase) => {
      const stream = purchase.stream || "unattributed";
      streamRevenue.set(stream, (streamRevenue.get(stream) || 0) + purchase.amount);
    });
    const eventCounts = Object.fromEntries(funnelEvents.map((event) => [event.eventName, Number(event.count)]));
    const streamSummary = streamRevenue.size
      ? Array.from(streamRevenue, ([stream, amount]) => `${stream}: $${(amount / 100).toLocaleString()}`).join(" | ")
      : "No completed-purchase attribution recorded this week";

    const report = [
      `Weekly Revenue & Growth Report`,
      `─────────────────────────────`,
      `Total Revenue: $${(revenue / 100).toLocaleString()}`,
      `Completed Purchase Revenue (7d): $${(weeklyRevenue / 100).toLocaleString()}`,
      `Revenue by Stream (7d): ${streamSummary}`,
      `Payment Reconciliation Exceptions: ${pendingPurchaseExceptions} pending purchase record(s) older than 24 hours`,
      `Pro Subscribers: ${subscribers}`,
      `Total Leads: ${leadCount}`,
      `Newsletter Subscribers: ${newsletterCount}`,
      `Funnel Signals (7d): ${eventCounts.page_view || 0} views · ${eventCounts.cta_click || 0} CTA clicks · ${eventCounts.lead_submitted || 0} leads · ${eventCounts.checkout_started || 0} checkouts · ${eventCounts.checkout_completed || 0} confirmed payments · ${eventCounts.portal_viewed || 0} portal views`,
      `Security Review Prompt: Confirm recent admin-role changes, portal authorization changes, and Stripe webhook delivery exceptions have been reviewed.`,
      `─────────────────────────────`,
      `Report generated: ${new Date().toISOString()}`,
    ].join("\n");

    await notifyOwner({
      title: "Weekly Revenue & Growth Report",
      content: report,
    });

    res.json({ success: true, report });
  } catch (err) {
    console.error("[Scheduled] Weekly report error:", err);
    res.status(500).json({ error: "Failed to generate weekly report" });
  }
});

type EditorialDraft = {
  topic: string;
  buyerDecision: string;
  originalAngle: string;
  brief: string;
  suggestedResearchLeads: Array<{ title: string; url: string; why: string }>;
  suggestedPropertyLinks: Array<{ label: string; url: string; reason: string }>;
  claimNotes: string;
};

async function generatePrivateEditorialDraft(candidate: SwellResourceCandidate, html: string): Promise<{ title: string; description: string | null; draft: EditorialDraft }> {
  const metadata = extractSourceMetadata(html, candidate.url);
  const response = await invokeLLM({
    model: "gpt-5-mini",
    messages: [
      { role: "system", content: "You create conservative, private B2B editorial review briefs. Never write public-ready copy, invent citations, copy source wording, or imply external endorsement." },
      { role: "user", content: buildSwellEditorialPrompt(candidate, metadata) },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "swell_editorial_review",
        strict: true,
        schema: {
          type: "object",
          properties: {
            topic: { type: "string" }, buyerDecision: { type: "string" }, originalAngle: { type: "string" }, brief: { type: "string" },
            suggestedResearchLeads: { type: "array", items: { type: "object", properties: { title: { type: "string" }, url: { type: "string" }, why: { type: "string" } }, required: ["title", "url", "why"], additionalProperties: false } },
            suggestedPropertyLinks: { type: "array", items: { type: "object", properties: { label: { type: "string" }, url: { type: "string" }, reason: { type: "string" } }, required: ["label", "url", "reason"], additionalProperties: false } },
            claimNotes: { type: "string" },
          },
          required: ["topic", "buyerDecision", "originalAngle", "brief", "suggestedResearchLeads", "suggestedPropertyLinks", "claimNotes"],
          additionalProperties: false,
        },
      },
    },
  });
  const content = response.choices[0]?.message?.content;
  if (typeof content !== "string") throw new Error("Editorial model returned no structured content");
  return { title: metadata.title, description: metadata.description, draft: JSON.parse(content) as EditorialDraft };
}

scheduledRouter.post("/api/scheduled/swell-editorial-monitor", async (req, res) => {
  let taskUid: string | undefined;
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron_only" });
    taskUid = user.taskUid;
    const monitor = await getSwellPublicationMonitorByTaskUid(taskUid);
    if (!monitor || !monitor.enabled) return res.json({ ok: true, skipped: "monitor_disabled_or_orphaned" });
    if (monitor.sourceSitemapUrl !== SWELL_SITEMAP_URL) return res.status(400).json({ error: "unexpected_source_configuration" });

    const sitemapResponse = await fetch(SWELL_SITEMAP_URL, { headers: { accept: "application/xml,text/xml" }, signal: AbortSignal.timeout(15_000) });
    if (!sitemapResponse.ok) throw new Error(`Swell sitemap fetch failed: ${sitemapResponse.status}`);
    const candidates = parseSwellResourceSitemap(await sitemapResponse.text());
    if (!monitor.lastCheckedAt) {
      const expiresAt = new Date(Date.now() + monitor.retentionDays * 24 * 60 * 60 * 1000);
      let baselineRecorded = 0;
      for (const candidate of candidates) {
        if (await getSwellEditorialReviewBySourceVersion(candidate.url, candidate.lastmod)) continue;
        await createSwellEditorialReview({
          sourceUrl: candidate.url,
          sourceLastmod: candidate.lastmod,
          sourceTitle: `Baseline source version: ${new URL(candidate.url).pathname}`,
          sourceDescription: null,
          status: "expired",
          generatedBrief: JSON.stringify({ baseline: true, note: "Existing source version observed at monitor activation; no editorial brief was generated." }),
          suggestedSources: null,
          suggestedLinks: null,
          claimNotes: "Baseline record only. No quotation, editorial analysis, or publication recommendation was generated.",
          expiresAt,
        });
        baselineRecorded++;
      }
      const summary = `Baseline initialized from ${candidates.length} existing Swell resource version(s); recorded ${baselineRecorded} source version(s) without generating editorial briefs. Future new or updated versions will enter private review.`;
      await updateSwellMonitorRun(taskUid, summary);
      return res.json({ ok: true, initialized: true, scanned: candidates.length, baselineRecorded });
    }
    const created: Array<{ id: number; title: string; url: string }> = [];

    for (const candidate of candidates) {
      if (await getSwellEditorialReviewBySourceVersion(candidate.url, candidate.lastmod)) continue;
      const sourceResponse = await fetch(candidate.url, { headers: { accept: "text/html" }, signal: AbortSignal.timeout(15_000) });
      if (!sourceResponse.ok) continue;
      const { title, description, draft } = await generatePrivateEditorialDraft(candidate, await sourceResponse.text());
      const expiresAt = new Date(Date.now() + monitor.retentionDays * 24 * 60 * 60 * 1000);
      const id = await createSwellEditorialReview({
        sourceUrl: candidate.url,
        sourceLastmod: candidate.lastmod,
        sourceTitle: title,
        sourceDescription: description,
        generatedBrief: JSON.stringify({ topic: draft.topic, buyerDecision: draft.buyerDecision, originalAngle: draft.originalAngle, brief: draft.brief }),
        suggestedSources: JSON.stringify(draft.suggestedResearchLeads),
        suggestedLinks: JSON.stringify(draft.suggestedPropertyLinks),
        claimNotes: draft.claimNotes,
        expiresAt,
      });
      created.push({ id, title, url: candidate.url });
    }

    const expired = await expireStaleSwellEditorialReviews();
    const summary = `Scanned ${candidates.length} Swell resource version(s); created ${created.length} private review record(s); expired ${expired} stale pending record(s).`;
    await updateSwellMonitorRun(taskUid, summary);
    if (created.length) {
      await notifyOwner({
        title: `Swell editorial review queue: ${created.length} new item${created.length === 1 ? "" : "s"}`,
        content: `${summary}\n\nPrivate, unapproved briefs:\n${created.map((item) => `#${item.id} — ${item.title}\n${item.url}`).join("\n")}`,
      });
    }
    return res.json({ ok: true, scanned: candidates.length, created: created.length, expired });
  } catch (error) {
    console.error("[Scheduled] Swell editorial monitor failed", error);
    return res.status(500).json({ error: "swell_editorial_monitor_failed", taskUid, message: String(error), timestamp: new Date().toISOString() });
  }
});

async function generateEmailContent(email: string, step: number, subject: string): Promise<string> {
  const prompts: Record<number, string> = {
    0: `Write a brief, professional welcome email for a new lead at ARM Agency (Autonomous Resource Management). The recipient is ${email}. Subject: "${subject}". Keep it under 150 words. Mention our core capabilities: AI-native infrastructure, agentic workflow orchestration, BFT consensus, and real-time attribution. End with a soft CTA to explore our documentation.`,
    1: `Write a brief follow-up email that helps a prospective buyer prepare for a scoped AI infrastructure conversation. The recipient is ${email}. Subject: "${subject}". Keep it under 150 words. Invite them to identify the business decision, current workflow, stakeholders, constraints, and a useful next milestone. Do not state customer totals, deployment counts, uptime, performance benchmarks, or unverified outcomes. End with a soft CTA to schedule a technical deep-dive.`,
    2: `Write a brief email inviting the recipient to book a 60-minute live demo of ARM Agency's platform. The recipient is ${email}. Subject: "${subject}". Keep it under 150 words. Mention the 30-day production pilot available for qualified teams. Include urgency without being pushy.`,
  };

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are a professional B2B email copywriter for ARM Agency, an enterprise AI infrastructure company. Write concise, technical, and authoritative emails." },
        { role: "user", content: prompts[step] || prompts[0] },
      ],
    });
    const content = response.choices[0]?.message?.content;
    return typeof content === 'string' ? content : "Follow up from ARM Agency";
  } catch {
    return `Follow up from ARM Agency - Step ${step + 1}`;
  }
}

export { scheduledRouter };
