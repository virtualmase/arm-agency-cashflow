import { Router, type NextFunction, type Request, type Response } from "express";
import { getPendingEmails, markEmailSent, getRevenueTotal, getPendingPurchaseExceptionCount, getSubscriberCount, getLeadCount, getNewsletterCount, getCompletedPurchasesSince, getFunnelEventCounts, getSwellPublicationMonitorByTaskUid, getSwellEditorialReviewBySourceVersion, createSwellEditorialReview, expireStaleSwellEditorialReviews, updateSwellMonitorRun } from "./db";
import { notifyOwner } from "./_core/notification";
import { isEmailDeliveryEnabled, sendTransactionalEmail } from "./emailDelivery";
import { invokeLLM } from "./_core/llm";
import { sdk } from "./_core/sdk";
import { timingSafeEqual } from "node:crypto";
import { SWELL_SITEMAP_URL, buildSwellEditorialPrompt, extractSourceMetadata, parseSwellResourceSitemap, validatePrivateEditorialDraft, type PrivateEditorialDraft, type SwellResourceCandidate } from "./swellEditorial";

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
  if (!isEmailDeliveryEnabled()) {
    return res.status(503).json({
      error: "email_delivery_not_configured",
      message: "Email delivery is disabled or SMTP is incomplete; no sequence records were changed.",
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
        
        const delivery = await sendTransactionalEmail({
          to: email.email,
          subject: stepNames[email.step] || "ARM Agency follow-up",
          text: stepContent,
        });
        if (!delivery.accepted) throw new Error(`Email provider did not accept ${email.email}`);
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

async function generatePrivateEditorialDraft(candidate: SwellResourceCandidate, html: string): Promise<{ title: string; description: string | null; draft: PrivateEditorialDraft }> {
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
  return { title: metadata.title, description: metadata.description, draft: validatePrivateEditorialDraft(candidate, JSON.parse(content) as PrivateEditorialDraft) };
}

type SwellFetchResponse = {
  ok: boolean;
  status: number;
  text: () => Promise<string>;
};

export type SwellMonitorDependencies = {
  getMonitorByTaskUid: typeof getSwellPublicationMonitorByTaskUid;
  getReviewBySourceVersion: typeof getSwellEditorialReviewBySourceVersion;
  createReview: typeof createSwellEditorialReview;
  expireStaleReviews: typeof expireStaleSwellEditorialReviews;
  updateMonitorRun: typeof updateSwellMonitorRun;
  notifyOwner: typeof notifyOwner;
  fetcher: (url: string, init: RequestInit) => Promise<SwellFetchResponse>;
  generateDraft: typeof generatePrivateEditorialDraft;
};

const defaultSwellMonitorDependencies: SwellMonitorDependencies = {
  getMonitorByTaskUid: getSwellPublicationMonitorByTaskUid,
  getReviewBySourceVersion: getSwellEditorialReviewBySourceVersion,
  createReview: createSwellEditorialReview,
  expireStaleReviews: expireStaleSwellEditorialReviews,
  updateMonitorRun: updateSwellMonitorRun,
  notifyOwner,
  fetcher: (url, init) => fetch(url, init),
  generateDraft: generatePrivateEditorialDraft,
};

export async function runSwellEditorialMonitor(taskUid: string, dependencies: SwellMonitorDependencies = defaultSwellMonitorDependencies) {
  const monitor = await dependencies.getMonitorByTaskUid(taskUid);
  if (!monitor || !monitor.enabled) return { ok: true, skipped: "monitor_disabled_or_orphaned" as const };
  if (monitor.sourceSitemapUrl !== SWELL_SITEMAP_URL) throw new Error("unexpected_source_configuration");

  const sitemapResponse = await dependencies.fetcher(SWELL_SITEMAP_URL, { headers: { accept: "application/xml,text/xml" }, signal: AbortSignal.timeout(15_000) });
  if (!sitemapResponse.ok) throw new Error(`Swell sitemap fetch failed: ${sitemapResponse.status}`);
  const candidates = parseSwellResourceSitemap(await sitemapResponse.text());
  if (!monitor.lastCheckedAt) {
    const expiresAt = new Date(Date.now() + monitor.retentionDays * 24 * 60 * 60 * 1000);
    let baselineRecorded = 0;
    for (const candidate of candidates) {
      if (await dependencies.getReviewBySourceVersion(candidate.url, candidate.lastmod)) continue;
      await dependencies.createReview({
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
    await dependencies.updateMonitorRun(taskUid, summary);
    return { ok: true, initialized: true, scanned: candidates.length, baselineRecorded };
  }

  const created: Array<{ id: number; title: string; url: string }> = [];
  for (const candidate of candidates) {
    if (await dependencies.getReviewBySourceVersion(candidate.url, candidate.lastmod)) continue;
    const sourceResponse = await dependencies.fetcher(candidate.url, { headers: { accept: "text/html" }, signal: AbortSignal.timeout(15_000) });
    if (!sourceResponse.ok) continue;
    const { title, description, draft } = await dependencies.generateDraft(candidate, await sourceResponse.text());
    const expiresAt = new Date(Date.now() + monitor.retentionDays * 24 * 60 * 60 * 1000);
    const id = await dependencies.createReview({
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

  const expired = await dependencies.expireStaleReviews();
  const summary = `Scanned ${candidates.length} Swell resource version(s); created ${created.length} private review record(s); expired ${expired} stale pending record(s).`;
  await dependencies.updateMonitorRun(taskUid, summary);
  if (created.length) {
    await dependencies.notifyOwner({
      title: `Swell editorial review queue: ${created.length} new item${created.length === 1 ? "" : "s"}`,
      content: `${summary}\n\nPrivate, unapproved briefs:\n${created.map((item) => `#${item.id} — ${item.title}\n${item.url}`).join("\n")}`,
    });
  }
  return { ok: true, scanned: candidates.length, created: created.length, expired };
}

scheduledRouter.post("/api/scheduled/swell-editorial-monitor", async (req, res) => {
  let taskUid: string | undefined;
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron_only" });
    taskUid = user.taskUid;
    return res.json(await runSwellEditorialMonitor(taskUid));
  } catch (error) {
    console.error("[Scheduled] Swell editorial monitor failed", error);
    const status = String(error).includes("unexpected_source_configuration") ? 400 : 500;
    return res.status(status).json({ error: "swell_editorial_monitor_failed", taskUid, message: String(error), timestamp: new Date().toISOString() });
  }
});

async function generateEmailContent(email: string, step: number, subject: string): Promise<string> {
  const prompts: Record<number, string> = {
    0: `Write a brief, professional welcome email for a new lead at ARM Agency (Autonomous Resource Management). The recipient is ${email}. Subject: "${subject}". Keep it under 150 words. Mention accountable AI workflows, scoped agent infrastructure, and evidence-aware public information. Do not promise outcomes or refer to unverified platform capabilities. End with a soft CTA to explore the documentation.`,
    1: `Write a brief follow-up email that helps a prospective buyer prepare for a scoped AI infrastructure conversation. The recipient is ${email}. Subject: "${subject}". Keep it under 150 words. Invite them to identify the business decision, current workflow, stakeholders, constraints, and a useful next milestone. Do not state customer totals, deployment counts, uptime, performance benchmarks, or unverified outcomes. End with a soft CTA to schedule a technical deep-dive.`,
    2: `Write a brief email inviting the recipient to discuss a scoped AI workflow or public-surface decision with ARM Agency. The recipient is ${email}. Subject: "${subject}". Keep it under 150 words. State that scope, timing, participants, and terms are confirmed during qualification. Include a clear but non-pressured next step.`,
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
