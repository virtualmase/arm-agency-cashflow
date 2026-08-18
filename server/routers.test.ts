import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import { stripe } from "./stripe";
import { createFunnelEvent, createOperatingDecision, getCompletedPurchasesSince, getFunnelEventCounts, getOperatingDecisions, getPendingPurchaseExceptionCount, getUserPurchases, updateOperatingDecisionStatus } from "./db";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

// Mock notification to prevent actual API calls
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock db functions
vi.mock("./db", () => ({
  createLead: vi.fn().mockResolvedValue(1),
  getLeads: vi.fn().mockResolvedValue([]),
  updateLeadStatus: vi.fn().mockResolvedValue(undefined),
  getLeadCount: vi.fn().mockResolvedValue(5),
  subscribeNewsletter: vi.fn().mockResolvedValue(undefined),
  getNewsletterCount: vi.fn().mockResolvedValue(10),
  createPurchase: vi.fn().mockResolvedValue(1),
  getPurchases: vi.fn().mockResolvedValue([]),
  getRevenueTotal: vi.fn().mockResolvedValue(250000),
  getPendingPurchaseExceptionCount: vi.fn().mockResolvedValue(0),
  updatePurchaseStatus: vi.fn().mockResolvedValue(undefined),
  createFeedback: vi.fn().mockResolvedValue(undefined),
  getFeedbackList: vi.fn().mockResolvedValue([]),
  getAverageSatisfaction: vi.fn().mockResolvedValue(4.2),
  getSubscriberCount: vi.fn().mockResolvedValue(3),
  getUserCount: vi.fn().mockResolvedValue(15),
  createEmailSequence: vi.fn().mockResolvedValue(undefined),
  createFunnelEvent: vi.fn().mockResolvedValue(undefined),
  getCompletedPurchasesSince: vi.fn().mockResolvedValue([]),
  getFunnelEventCounts: vi.fn().mockResolvedValue([]),
  createOperatingDecision: vi.fn().mockResolvedValue(1),
  getOperatingDecisions: vi.fn().mockResolvedValue([]),
  updateOperatingDecisionStatus: vi.fn().mockResolvedValue(undefined),
  getUserPurchases: vi.fn().mockResolvedValue([
    { id: 1, email: "test@example.com", name: "Test User", packageName: "GEO Mastery Course", amount: 29700, stripePaymentIntentId: "pi_test", stripeSessionId: "cs_test", status: "completed", createdAt: new Date() },
  ]),
  updateUserStripeCustomerId: vi.fn().mockResolvedValue(undefined),
}));

// Mock stripe
vi.mock("./stripe", () => ({
  assertStripeConfigured: vi.fn(),
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({ url: "https://checkout.stripe.com/test", id: "cs_test_123" }),
        retrieve: vi.fn().mockResolvedValue({
          id: "cs_test_123",
          client_reference_id: "1",
          metadata: { user_id: "1", product_name: "GEO Mastery Course" },
          customer_email: "test@example.com",
          customer_details: { email: "test@example.com" },
          amount_total: 29700,
          currency: "usd",
          payment_status: "paid",
          created: 1700000000,
        }),
      },
    },
    subscriptions: {
      list: vi.fn().mockResolvedValue({ data: [] }),
      retrieve: vi.fn().mockResolvedValue({ id: "sub_test_123", customer: "cus_test_456", status: "active" }),
      update: vi.fn().mockResolvedValue({ id: "sub_test_123", cancel_at_period_end: true, current_period_end: Math.floor(Date.now() / 1000) + 30 * 86400 }),
    },
    invoices: {
      list: vi.fn().mockResolvedValue({ data: [] }),
    },
  },
  ALL_PRODUCTS: [
    { key: "swell-geo-starter", name: "GEO Starter", description: "Test", priceCents: 150000, interval: "month", stream: "swell", tier: "Starter" },
    { key: "academy-geo-mastery", name: "GEO Mastery Course", description: "Test", priceCents: 29700, interval: null, stream: "academy" },
  ],
  getProductByKey: vi.fn((key: string) => {
    const products: Record<string, any> = {
      "swell-geo-starter": { key: "swell-geo-starter", name: "GEO Starter", description: "Test", priceCents: 150000, interval: "month", stream: "swell" },
      "academy-geo-mastery": { key: "academy-geo-mastery", name: "GEO Mastery Course", description: "Test", priceCents: 29700, interval: null, stream: "academy" },
    };
    return products[key] || null;
  }),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: { origin: "https://test.example.com" } } as any,
    res: { clearCookie: vi.fn() } as any,
  };
}

function createAuthContext(role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    plan: "starter",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: { origin: "https://test.example.com" } } as any,
    res: { clearCookie: vi.fn() } as any,
  };
}

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(ctx.res.clearCookie).toHaveBeenCalledWith(COOKIE_NAME, expect.objectContaining({ maxAge: -1 }));
  });
});

describe("leads.submit", () => {
  it("creates a lead and returns success", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.leads.submit({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@company.com",
      company: "Babbage Inc",
      useCase: "arm-mandate",
    });
    expect(result.success).toBe(true);
    expect(result.leadId).toBe(1);
  });
});

describe("newsletter.subscribe", () => {
  it("subscribes an email and returns success", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.newsletter.subscribe({ email: "test@example.com" });
    expect(result.success).toBe(true);
  });
});

describe("stripe.createCheckout", () => {
  it("requires an authenticated purchasing account", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.stripe.createCheckout({ productKey: "academy-geo-mastery" })).rejects.toThrow();
  });

  it("creates a checkout session for a subscription product", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.stripe.createCheckout({ productKey: "swell-geo-starter" });
    expect(result.url).toBeTruthy();
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(expect.objectContaining({
      client_reference_id: "1",
      customer_email: "test@example.com",
      success_url: "https://arm-agency.xyz/thank-you?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://arm-agency.xyz/#pricing",
    }));
  });

  it("creates a checkout session for a one-time product", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.stripe.createCheckout({ productKey: "academy-geo-mastery" });
    expect(result.url).toBeTruthy();
  });

  it("throws for unknown product key", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.stripe.createCheckout({ productKey: "nonexistent" })).rejects.toThrow();
  });
});

describe("stripe.products", () => {
  it("returns the product catalog", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const products = await caller.stripe.products();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty("key");
    expect(products[0]).toHaveProperty("name");
    expect(products[0]).toHaveProperty("priceCents");
  });
});

describe("feedback.submit", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.feedback.submit({ satisfaction: 4 })).rejects.toThrow();
  });

  it("submits feedback for authenticated user", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);
    const result = await caller.feedback.submit({ satisfaction: 4, workload: 3, comments: "Great team!" });
    expect(result.success).toBe(true);
  });
});

describe("admin.stats", () => {
  it("requires admin role", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("returns stats for admin", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);
    const stats = await caller.admin.stats();
    expect(stats).toHaveProperty("revenue");
    expect(stats).toHaveProperty("pendingPurchaseExceptions");
    expect(stats).toHaveProperty("subscribers");
    expect(stats).toHaveProperty("leadCount");
    expect(stats).toHaveProperty("newsletterCount");
    expect(stats).toHaveProperty("userCount");
    expect(stats).toHaveProperty("avgSatisfaction");
  });
});

describe("leads.list", () => {
  it("requires admin role", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);
    await expect(caller.leads.list({})).rejects.toThrow();
  });

  it("returns leads for admin", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);
    const leads = await caller.leads.list({});
    expect(Array.isArray(leads)).toBe(true);
  });
});

describe("portal.summary", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.portal.summary()).rejects.toThrow();
  });

  it("returns user summary for authenticated user", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);
    const summary = await caller.portal.summary();
    expect(summary).toHaveProperty("plan");
    expect(summary).toHaveProperty("email");
    expect(summary).toHaveProperty("name");
    expect(summary).toHaveProperty("stripeCustomerId");
    expect(summary).toHaveProperty("hasSubscription");
    expect(summary.plan).toBe("starter");
    expect(summary.email).toBe("test@example.com");
  });
});

describe("portal.myPurchases", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.portal.myPurchases()).rejects.toThrow();
  });

  it("returns purchases for authenticated user", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);
    const purchases = await caller.portal.myPurchases();
    expect(Array.isArray(purchases)).toBe(true);
    expect(purchases.length).toBe(1);
    expect(purchases[0].packageName).toBe("GEO Mastery Course");
  });
});

describe("portal.mySubscriptions", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.portal.mySubscriptions()).rejects.toThrow();
  });

  it("returns empty array when no Stripe customer ID", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);
    const subs = await caller.portal.mySubscriptions();
    expect(Array.isArray(subs)).toBe(true);
    expect(subs.length).toBe(0);
  });

  it("requests subscriptions only for the authenticated customer's Stripe ID", async () => {
    const ctx = createAuthContext("user");
    ctx.user!.stripeCustomerId = "cus_test_456";
    const caller = appRouter.createCaller(ctx);
    await caller.portal.mySubscriptions();
    expect(stripe.subscriptions.list).toHaveBeenCalledWith(expect.objectContaining({ customer: "cus_test_456" }));
  });
});

describe("portal.myInvoices", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.portal.myInvoices()).rejects.toThrow();
  });

  it("returns empty array when no Stripe customer ID", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);
    const invoices = await caller.portal.myInvoices();
    expect(Array.isArray(invoices)).toBe(true);
    expect(invoices.length).toBe(0);
  });

  it("requests invoices only for the authenticated customer's Stripe ID", async () => {
    const ctx = createAuthContext("user");
    ctx.user!.stripeCustomerId = "cus_test_456";
    const caller = appRouter.createCaller(ctx);
    await caller.portal.myInvoices();
    expect(stripe.invoices.list).toHaveBeenCalledWith(expect.objectContaining({ customer: "cus_test_456" }));
  });
});

describe("portal.cancelSubscription", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.portal.cancelSubscription({ subscriptionId: "sub_test_123" })).rejects.toThrow();
  });

  it("rejects when user has no Stripe customer ID", async () => {
    const ctx = createAuthContext("user"); // stripeCustomerId is null
    const caller = appRouter.createCaller(ctx);
    await expect(caller.portal.cancelSubscription({ subscriptionId: "sub_test_123" })).rejects.toThrow("No Stripe customer linked");
  });

  it("cancels subscription for user with matching Stripe customer", async () => {
    const ctx = createAuthContext("user");
    // Patch the user to have a Stripe customer ID matching the mock
    ctx.user!.stripeCustomerId = "cus_test_456";
    const caller = appRouter.createCaller(ctx);
    const result = await caller.portal.cancelSubscription({ subscriptionId: "sub_test_123" });
    expect(result.success).toBe(true);
    expect(result.cancelAtPeriodEnd).toBe(true);
    expect(result.currentPeriodEnd).toBeTruthy();
  });
});

describe("security: billing and cross-user isolation", () => {
  it("requires authentication before revealing checkout-session details", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.stripe.getCheckoutSession({ sessionId: "cs_test_123" })).rejects.toThrow();
  });

  it("returns checkout details only when the authenticated customer owns the session", async () => {
    const caller = appRouter.createCaller(createAuthContext("user"));
    const result = await caller.stripe.getCheckoutSession({ sessionId: "cs_test_123" });
    expect(result.productName).toBe("GEO Mastery Course");
    expect(result).not.toHaveProperty("email");
  });

  it("rejects checkout-session access from a different user", async () => {
    const ctx = createAuthContext("user");
    ctx.user!.id = 2;
    ctx.user!.email = "other@example.com";
    const caller = appRouter.createCaller(ctx);
    await expect(caller.stripe.getCheckoutSession({ sessionId: "cs_test_123" })).rejects.toThrow("does not belong to your account");
  });

  it("filters any mismatched purchase record as a second ownership boundary", async () => {
    vi.mocked(getUserPurchases).mockResolvedValueOnce([
      { id: 2, email: "other@example.com", name: "Other", packageName: "Private purchase", amount: 5000, stripePaymentIntentId: null, stripeSessionId: "cs_other", status: "completed", createdAt: new Date() },
    ] as any);
    const caller = appRouter.createCaller(createAuthContext("user"));
    await expect(caller.portal.myPurchases()).resolves.toEqual([]);
  });

  it("rejects subscription cancellation when the Stripe customer does not match", async () => {
    vi.mocked(stripe.subscriptions.retrieve).mockResolvedValueOnce({ id: "sub_other", customer: "cus_other", status: "active" } as any);
    const ctx = createAuthContext("user");
    ctx.user!.stripeCustomerId = "cus_test_456";
    const caller = appRouter.createCaller(ctx);
    await expect(caller.portal.cancelSubscription({ subscriptionId: "sub_other" })).rejects.toThrow("does not belong to your account");
  });
});

describe("growth instrumentation", () => {
  it("records a minimal validated first-party event without customer PII", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.analytics.track({ eventName: "cta_click", path: "/", productKey: "audit", stream: "arm" })).resolves.toEqual({ success: true });
    expect(createFunnelEvent).toHaveBeenCalledWith({ eventName: "cta_click", path: "/", productKey: "audit", stream: "arm" });
  });

  it("keeps growth summaries restricted to the owner role", async () => {
    const caller = appRouter.createCaller(createAuthContext("user"));
    await expect(caller.admin.growthOverview()).rejects.toThrow();
  });

  it("returns completed-purchase cohorts and first-party funnel counts for an admin", async () => {
    vi.mocked(getCompletedPurchasesSince).mockResolvedValueOnce([
      { amount: 250000, packageName: "AI Infrastructure Audit", productKey: "audit", stream: "arm", createdAt: new Date() },
    ] as any);
    vi.mocked(getFunnelEventCounts).mockResolvedValueOnce([
      { eventName: "page_view", count: 12 },
      { eventName: "lead_submitted", count: 2 },
      { eventName: "checkout_completed", count: 1 },
    ] as any);
    const caller = appRouter.createCaller(createAuthContext("admin"));
    const overview = await caller.admin.growthOverview();
    expect(overview.weeklyRevenue).toHaveLength(8);
    expect(overview.revenueByStream).toEqual([{ stream: "arm", revenue: 250000 }]);
    expect(overview.funnel).toMatchObject({ pageViews: 12, leads: 2, checkoutsCompleted: 1 });
  });
});

describe("owner operating decisions", () => {
  const entry = {
    signal: "Checkout abandonment increased",
    evidence: "Owner dashboard shows more checkout_started than checkout_completed.",
    decision: "Review payment flow and CTA-message fit before increasing traffic.",
    owner: "Growth owner",
    dueDate: "2026-08-20T12:00:00.000Z",
  };

  it("keeps decision-log access restricted to admins", async () => {
    const caller = appRouter.createCaller(createAuthContext("user"));
    await expect(caller.admin.operatingDecisions()).rejects.toThrow();
    await expect(caller.admin.createOperatingDecision(entry)).rejects.toThrow();
  });

  it("allows an admin to create a decision and update its review status", async () => {
    const caller = appRouter.createCaller(createAuthContext("admin"));
    await expect(caller.admin.createOperatingDecision(entry)).resolves.toEqual({ success: true, id: 1 });
    expect(createOperatingDecision).toHaveBeenCalledWith(expect.objectContaining({ signal: entry.signal, status: "open" }));
    await expect(caller.admin.updateOperatingDecisionStatus({ id: 1, status: "completed" })).resolves.toEqual({ success: true });
    expect(updateOperatingDecisionStatus).toHaveBeenCalledWith(1, "completed");
  });

  it("returns decision records to the admin owner", async () => {
    vi.mocked(getOperatingDecisions).mockResolvedValueOnce([
      { id: 1, signal: entry.signal, evidence: entry.evidence, decision: entry.decision, owner: entry.owner, dueDate: new Date(entry.dueDate), status: "open", createdAt: new Date(), updatedAt: new Date() },
    ] as any);
    const caller = appRouter.createCaller(createAuthContext("admin"));
    const decisions = await caller.admin.operatingDecisions();
    expect(decisions).toHaveLength(1);
    expect(decisions[0].status).toBe("open");
  });
});
