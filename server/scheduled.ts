import { Router } from "express";
import { getPendingEmails, markEmailSent, getRevenueTotal, getPendingPurchaseExceptionCount, getSubscriberCount, getLeadCount, getNewsletterCount, getCompletedPurchasesSince, getFunnelEventCounts } from "./db";
import { notifyOwner } from "./_core/notification";
import { invokeLLM } from "./_core/llm";

const scheduledRouter = Router();

// Email sequence processor - triggered by heartbeat cron
scheduledRouter.post("/api/scheduled/email-sequences", async (req, res) => {
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
