import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, index, uniqueIndex } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 128 }),
  plan: mysqlEnum("plan", ["starter", "pro", "enterprise"]).default("starter").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 128 }).notNull(),
  lastName: varchar("lastName", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 256 }),
  useCase: varchar("useCase", { length: 256 }),
  message: text("message"),
  status: mysqlEnum("status", ["new", "contacted", "qualified", "converted", "lost"]).default("new").notNull(),
  source: varchar("source", { length: 64 }).default("contact_form"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

export const newsletters = mysqlTable("newsletters", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  active: boolean("active").default(true).notNull(),
});

export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = typeof newsletters.$inferInsert;

export const purchases = mysqlTable("purchases", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 256 }),
  packageName: varchar("packageName", { length: 128 }).notNull(),
  productKey: varchar("productKey", { length: 128 }),
  stream: varchar("stream", { length: 64 }),
  amount: int("amount").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 128 }),
  stripeSessionId: varchar("stripeSessionId", { length: 256 }),
  status: mysqlEnum("status", ["pending", "completed", "refunded"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = typeof purchases.$inferInsert;

export const funnelEvents = mysqlTable("funnelEvents", {
  id: int("id").autoincrement().primaryKey(),
  eventName: mysqlEnum("eventName", ["page_view", "cta_click", "lead_submitted", "checkout_started", "checkout_completed", "portal_viewed"]).notNull(),
  path: varchar("path", { length: 256 }),
  productKey: varchar("productKey", { length: 128 }),
  stream: varchar("stream", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FunnelEvent = typeof funnelEvents.$inferSelect;
export type InsertFunnelEvent = typeof funnelEvents.$inferInsert;

export const operatingDecisions = mysqlTable("operatingDecisions", {
  id: int("id").autoincrement().primaryKey(),
  signal: varchar("signal", { length: 256 }).notNull(),
  evidence: text("evidence"),
  decision: text("decision").notNull(),
  owner: varchar("owner", { length: 128 }).notNull(),
  dueDate: timestamp("dueDate"),
  status: mysqlEnum("status", ["open", "completed", "deferred"]).default("open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OperatingDecision = typeof operatingDecisions.$inferSelect;
export type InsertOperatingDecision = typeof operatingDecisions.$inferInsert;

export const swellPublicationMonitor = mysqlTable("swellPublicationMonitor", {
  id: varchar("id", { length: 64 }).primaryKey(),
  sourceSitemapUrl: varchar("sourceSitemapUrl", { length: 1024 }).notNull(),
  scheduleCronTaskUid: varchar("scheduleCronTaskUid", { length: 65 }),
  enabled: boolean("enabled").default(false).notNull(),
  retentionDays: int("retentionDays").default(90).notNull(),
  lastCheckedAt: timestamp("lastCheckedAt"),
  lastCheckSummary: text("lastCheckSummary"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("swell_monitor_task_uid_unique").on(table.scheduleCronTaskUid),
]);

export type SwellPublicationMonitor = typeof swellPublicationMonitor.$inferSelect;
export type InsertSwellPublicationMonitor = typeof swellPublicationMonitor.$inferInsert;

export const swellEditorialReviews = mysqlTable("swellEditorialReviews", {
  id: int("id").autoincrement().primaryKey(),
  sourceUrl: varchar("sourceUrl", { length: 1024 }).notNull(),
  sourceLastmod: varchar("sourceLastmod", { length: 64 }).notNull(),
  sourceTitle: varchar("sourceTitle", { length: 512 }).notNull(),
  sourceDescription: text("sourceDescription"),
  detectedAt: timestamp("detectedAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["pending_review", "approved", "declined", "published", "expired"]).default("pending_review").notNull(),
  generatedBrief: text("generatedBrief").notNull(),
  suggestedSources: text("suggestedSources"),
  suggestedLinks: text("suggestedLinks"),
  claimNotes: text("claimNotes"),
  reviewNotes: text("reviewNotes"),
  reviewedAt: timestamp("reviewedAt"),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("swell_editorial_source_version_unique").on(table.sourceUrl, table.sourceLastmod),
  index("swell_editorial_status_detected_idx").on(table.status, table.detectedAt),
  index("swell_editorial_expires_idx").on(table.expiresAt),
]);

export type SwellEditorialReview = typeof swellEditorialReviews.$inferSelect;
export type InsertSwellEditorialReview = typeof swellEditorialReviews.$inferInsert;

export const agenticMailWebhookEvents = mysqlTable("agenticMailWebhookEvents", {
  id: int("id").autoincrement().primaryKey(),
  eventId: varchar("eventId", { length: 128 }).notNull().unique(),
  eventType: varchar("eventType", { length: 64 }).notNull(),
  inboxId: varchar("inboxId", { length: 128 }).notNull(),
  messageId: varchar("messageId", { length: 512 }).notNull(),
  sender: varchar("sender", { length: 320 }),
  subject: varchar("subject", { length: 512 }),
  receivedAt: timestamp("receivedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("agentic_mail_inbox_received_idx").on(table.inboxId, table.receivedAt),
]);

export type AgenticMailWebhookEvent = typeof agenticMailWebhookEvents.$inferSelect;
export type InsertAgenticMailWebhookEvent = typeof agenticMailWebhookEvents.$inferInsert;

export const emailSequences = mysqlTable("emailSequences", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  step: int("step").default(0).notNull(),
  sentAt: timestamp("sentAt"),
  scheduledFor: timestamp("scheduledFor").notNull(),
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailSequence = typeof emailSequences.$inferSelect;
export type InsertEmailSequence = typeof emailSequences.$inferInsert;

export const feedback = mysqlTable("feedback", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  name: varchar("name", { length: 256 }),
  satisfaction: int("satisfaction").notNull(),
  workload: int("workload"),
  comments: text("comments"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = typeof feedback.$inferInsert;
