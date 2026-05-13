import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
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
  updatePurchaseStatus: vi.fn().mockResolvedValue(undefined),
  createFeedback: vi.fn().mockResolvedValue(undefined),
  getFeedbackList: vi.fn().mockResolvedValue([]),
  getAverageSatisfaction: vi.fn().mockResolvedValue(4.2),
  getSubscriberCount: vi.fn().mockResolvedValue(3),
  getUserCount: vi.fn().mockResolvedValue(15),
  createEmailSequence: vi.fn().mockResolvedValue(undefined),
  getUserPurchases: vi.fn().mockResolvedValue([
    { id: 1, email: "test@example.com", name: "Test User", packageName: "GEO Mastery Course", amount: 29700, stripePaymentIntentId: "pi_test", stripeSessionId: "cs_test", status: "completed", createdAt: new Date() },
  ]),
  updateUserStripeCustomerId: vi.fn().mockResolvedValue(undefined),
}));

// Mock stripe
vi.mock("./stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({ url: "https://checkout.stripe.com/test", id: "cs_test_123" }),
      },
    },
    subscriptions: {
      list: vi.fn().mockResolvedValue({ data: [] }),
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
  it("creates a checkout session for a subscription product", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.stripe.createCheckout({ productKey: "swell-geo-starter" });
    expect(result.url).toBeTruthy();
  });

  it("creates a checkout session for a one-time product", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.stripe.createCheckout({ productKey: "academy-geo-mastery" });
    expect(result.url).toBeTruthy();
  });

  it("throws for unknown product key", async () => {
    const ctx = createPublicContext();
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
});
