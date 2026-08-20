import { eq, desc, sql, and, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leads, newsletters, purchases, emailSequences, feedback, funnelEvents, operatingDecisions, swellPublicationMonitor, swellEditorialReviews, agenticMailWebhookEvents } from "../drizzle/schema";
import type { InsertLead, InsertNewsletter, InsertPurchase, InsertEmailSequence, InsertFeedback, InsertFunnelEvent, InsertOperatingDecision, InsertSwellPublicationMonitor, InsertSwellEditorialReview, InsertAgenticMailWebhookEvent } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ── Leads ──
export async function createLead(lead: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(leads).values(lead);
  return result[0].insertId;
}

export async function getLeads(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(limit).offset(offset);
}

export async function updateLeadStatus(id: number, status: "new" | "contacted" | "qualified" | "converted" | "lost") {
  const db = await getDb();
  if (!db) return;
  await db.update(leads).set({ status }).where(eq(leads.id, id));
}

export async function getLeadCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(leads);
  return result[0]?.count ?? 0;
}

// ── Newsletter ──
export async function subscribeNewsletter(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(newsletters).values({ email }).onDuplicateKeyUpdate({ set: { active: true } });
}

export async function getNewsletterCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(newsletters).where(eq(newsletters.active, true));
  return result[0]?.count ?? 0;
}

// ── Purchases ──
export async function createPurchase(purchase: InsertPurchase) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(purchases).values(purchase);
  return result[0].insertId;
}

export async function updatePurchaseStatus(sessionId: string, status: "completed" | "refunded", paymentIntentId?: string) {
  const db = await getDb();
  if (!db) return;
  const updateData: Record<string, unknown> = { status };
  if (paymentIntentId) updateData.stripePaymentIntentId = paymentIntentId;
  await db.update(purchases).set(updateData).where(eq(purchases.stripeSessionId, sessionId));
}

export async function getPurchases(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(purchases).orderBy(desc(purchases.createdAt)).limit(limit);
}

export async function getRevenueTotal() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ total: sql<number>`COALESCE(SUM(amount), 0)` }).from(purchases).where(eq(purchases.status, "completed"));
  return result[0]?.total ?? 0;
}

export async function getPendingPurchaseExceptionCount(minAgeHours = 24) {
  const db = await getDb();
  if (!db) return 0;
  const cutoff = new Date(Date.now() - minAgeHours * 60 * 60 * 1000);
  const result = await db.select({ count: sql<number>`count(*)` }).from(purchases)
    .where(and(eq(purchases.status, "pending"), sql`${purchases.createdAt} <= ${cutoff}`));
  return result[0]?.count ?? 0;
}

export async function getCompletedPurchasesSince(since?: Date) {
  const db = await getDb();
  if (!db) return [];
  const whereClause = since
    ? and(eq(purchases.status, "completed"), sql`${purchases.createdAt} >= ${since}`)
    : eq(purchases.status, "completed");
  return db.select({
    amount: purchases.amount,
    packageName: purchases.packageName,
    productKey: purchases.productKey,
    stream: purchases.stream,
    createdAt: purchases.createdAt,
  }).from(purchases).where(whereClause).orderBy(desc(purchases.createdAt));
}

// ── First-party funnel instrumentation ──
export async function createFunnelEvent(event: InsertFunnelEvent) {
  const db = await getDb();
  if (!db) return;
  await db.insert(funnelEvents).values(event);
}

export async function getFunnelEventCounts(since: Date) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    eventName: funnelEvents.eventName,
    count: sql<number>`count(*)`,
  }).from(funnelEvents)
    .where(sql`${funnelEvents.createdAt} >= ${since}`)
    .groupBy(funnelEvents.eventName);
}

// ── Owner operating decision log ──
export async function createOperatingDecision(entry: InsertOperatingDecision) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(operatingDecisions).values(entry);
  return result[0].insertId;
}

export async function getOperatingDecisions(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(operatingDecisions).orderBy(desc(operatingDecisions.createdAt)).limit(limit);
}

export async function updateOperatingDecisionStatus(id: number, status: "open" | "completed" | "deferred") {
  const db = await getDb();
  if (!db) return;
  await db.update(operatingDecisions).set({ status }).where(eq(operatingDecisions.id, id));
}

// ── Swell publication monitor and owner-only editorial review queue ──
export async function getSwellPublicationMonitor() {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(swellPublicationMonitor).limit(1);
  return rows[0];
}

export async function getSwellPublicationMonitorByTaskUid(taskUid: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(swellPublicationMonitor)
    .where(eq(swellPublicationMonitor.scheduleCronTaskUid, taskUid)).limit(1);
  return rows[0];
}

export async function upsertSwellPublicationMonitor(monitor: InsertSwellPublicationMonitor) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(swellPublicationMonitor).values(monitor).onDuplicateKeyUpdate({
    set: {
      sourceSitemapUrl: monitor.sourceSitemapUrl,
      scheduleCronTaskUid: monitor.scheduleCronTaskUid,
      enabled: monitor.enabled,
      retentionDays: monitor.retentionDays,
      lastCheckedAt: monitor.lastCheckedAt,
      lastCheckSummary: monitor.lastCheckSummary,
    },
  });
}

export async function updateSwellMonitorRun(taskUid: string, summary: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(swellPublicationMonitor).set({ lastCheckedAt: new Date(), lastCheckSummary: summary })
    .where(eq(swellPublicationMonitor.scheduleCronTaskUid, taskUid));
}

export async function getSwellEditorialReviews(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(swellEditorialReviews).orderBy(desc(swellEditorialReviews.detectedAt)).limit(limit);
}

export async function getSwellEditorialReviewBySourceVersion(sourceUrl: string, sourceLastmod: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(swellEditorialReviews)
    .where(and(eq(swellEditorialReviews.sourceUrl, sourceUrl), eq(swellEditorialReviews.sourceLastmod, sourceLastmod))).limit(1);
  return rows[0];
}

export async function createSwellEditorialReview(review: InsertSwellEditorialReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(swellEditorialReviews).values(review);
  return result[0].insertId;
}

export async function updateSwellEditorialReviewStatus(
  id: number,
  status: "approved" | "declined" | "published",
  reviewNotes?: string | null
) {
  const db = await getDb();
  if (!db) return;
  await db.update(swellEditorialReviews).set({ status, reviewNotes: reviewNotes ?? null, reviewedAt: new Date() })
    .where(eq(swellEditorialReviews.id, id));
}

export async function expireStaleSwellEditorialReviews(now = new Date()) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.update(swellEditorialReviews).set({ status: "expired" })
    .where(and(eq(swellEditorialReviews.status, "pending_review"), lt(swellEditorialReviews.expiresAt, now)));
  return Number(result[0].affectedRows ?? 0);
}

// ── AgentMail webhook event deduplication ──
export async function reserveAgenticMailWebhookEvent(event: InsertAgenticMailWebhookEvent): Promise<"accepted" | "duplicate"> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(agenticMailWebhookEvents).values(event).onDuplicateKeyUpdate({
    set: { eventId: sql`${agenticMailWebhookEvents.eventId}` },
  });
  return Number(result[0].affectedRows ?? 0) === 1 ? "accepted" : "duplicate";
}

// ── Email Sequences ──
export async function createEmailSequence(seq: InsertEmailSequence) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(emailSequences).values(seq);
}

export async function getPendingEmails() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(emailSequences)
    .where(and(eq(emailSequences.status, "pending"), sql`${emailSequences.scheduledFor} <= NOW()`))
    .limit(50);
}

export async function markEmailSent(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(emailSequences).set({ status: "sent", sentAt: new Date() }).where(eq(emailSequences.id, id));
}

// ── Feedback ──
export async function createFeedback(fb: InsertFeedback) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(feedback).values(fb);
}

export async function getFeedbackList(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(feedback).orderBy(desc(feedback.createdAt)).limit(limit);
}

export async function getAverageSatisfaction() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ avg: sql<number>`COALESCE(AVG(satisfaction), 0)` }).from(feedback);
  return result[0]?.avg ?? 0;
}

// ── Admin Stats ──
export async function getSubscriberCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.plan, "pro"));
  return result[0]?.count ?? 0;
}

export async function getUserCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(users);
  return result[0]?.count ?? 0;
}

// ── Portal: User Purchases ──
export async function getUserPurchases(email: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(purchases).where(eq(purchases.email, email)).orderBy(desc(purchases.createdAt));
}

// ── Portal: Update user Stripe customer ID ──
export async function updateUserStripeCustomerId(userId: number, stripeCustomerId: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ stripeCustomerId }).where(eq(users.id, userId));
}

// ── Portal: Update user subscription ──
export async function updateUserSubscription(userId: number, subscriptionId: string | null, plan: "starter" | "pro" | "enterprise") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ stripeSubscriptionId: subscriptionId, plan }).where(eq(users.id, userId));
}
