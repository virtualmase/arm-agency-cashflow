import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import { stripe, ALL_PRODUCTS, assertStripeConfigured, getProductByKey } from "./stripe";
import { getCanonicalOrigin } from "./_core/canonicalOrigin";
import {
  createLead, getLeads, updateLeadStatus, getLeadCount,
  subscribeNewsletter, getNewsletterCount,
  createPurchase, getPurchases, getRevenueTotal, getPendingPurchaseExceptionCount, getCompletedPurchasesSince,
  createFeedback, getFeedbackList, getAverageSatisfaction,
  getSubscriberCount, getUserCount,
  createEmailSequence,
  getUserPurchases, updateUserStripeCustomerId, createFunnelEvent, getFunnelEventCounts,
  createOperatingDecision, getOperatingDecisions, updateOperatingDecisionStatus,
} from "./db";
import type Stripe from "stripe";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  leads: router({
    submit: publicProcedure.input(z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      company: z.string().optional(),
      useCase: z.string().optional(),
      message: z.string().optional(),
      source: z.string().optional(),
    })).mutation(async ({ input }) => {
      const leadId = await createLead({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        company: input.company || null,
        useCase: input.useCase || null,
        message: input.message || null,
        source: input.source || "contact_form",
      });
      const now = new Date();
      await createEmailSequence({ leadId, email: input.email, step: 0, scheduledFor: now, status: "pending" });
      await createEmailSequence({ leadId, email: input.email, step: 1, scheduledFor: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), status: "pending" });
      await createEmailSequence({ leadId, email: input.email, step: 2, scheduledFor: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), status: "pending" });
      await createFunnelEvent({
        eventName: "lead_submitted",
        path: "/",
        stream: input.useCase?.includes("geo") ? "swell" : input.useCase?.includes("coreweaver") ? "coreweaver" : input.useCase?.includes("academy") ? "academy" : input.useCase?.includes("arctura") ? "arctura" : "arm",
      });
      await notifyOwner({
        title: `New Lead: ${input.firstName} ${input.lastName}`,
        content: `Email: ${input.email}\nCompany: ${input.company || 'N/A'}\nUse Case: ${input.useCase || 'N/A'}\nMessage: ${input.message || 'N/A'}`,
      });
      return { success: true, leadId };
    }),
    list: adminProcedure.input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional()).query(async ({ input }) => {
      return getLeads(input?.limit ?? 100, input?.offset ?? 0);
    }),
    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["new", "contacted", "qualified", "converted", "lost"]),
    })).mutation(async ({ input }) => {
      await updateLeadStatus(input.id, input.status);
      return { success: true };
    }),
  }),

  newsletter: router({
    subscribe: publicProcedure.input(z.object({ email: z.string().email() })).mutation(async ({ input }) => {
      await subscribeNewsletter(input.email);
      await notifyOwner({ title: "New Newsletter Subscriber", content: `Email: ${input.email}` });
      return { success: true };
    }),
  }),

  analytics: router({
    track: publicProcedure.input(z.object({
      eventName: z.enum(["page_view", "cta_click", "lead_submitted", "checkout_started", "checkout_completed", "portal_viewed"]),
      path: z.string().max(256).optional(),
      productKey: z.string().max(128).optional(),
      stream: z.enum(["swell", "arm", "arctura", "academy", "coreweaver"]).optional(),
    })).mutation(async ({ input }) => {
      await createFunnelEvent(input);
      return { success: true };
    }),
  }),

  stripe: router({
    // Universal checkout for any product by key
    createCheckout: protectedProcedure.input(z.object({
      productKey: z.string(),
      email: z.string().email().optional(),
    })).mutation(async ({ input, ctx }) => {
      assertStripeConfigured();
      const origin = getCanonicalOrigin();
      const product = getProductByKey(input.productKey);
      if (!product) throw new Error(`Product not found: ${input.productKey}`);

      const isSubscription = product.interval !== null;

      const lineItem: any = {
        price_data: {
          currency: "usd",
          product_data: { name: product.name, description: product.description },
          unit_amount: product.priceCents,
          ...(isSubscription ? { recurring: { interval: product.interval! } } : {}),
        },
        quantity: 1,
      };

      const session = await stripe.checkout.sessions.create({
        mode: isSubscription ? "subscription" : "payment",
        line_items: [lineItem],
        customer_email: ctx.user.email || input.email || undefined,
        client_reference_id: ctx.user.id.toString(),
        metadata: {
          product_key: product.key,
          product_name: product.name,
          stream: product.stream,
          user_id: ctx.user.id.toString(),
        },
        success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/#pricing`,
        allow_promotion_codes: true,
      });

      // Track one-time purchases
      if (!isSubscription) {
        await createPurchase({
          email: ctx.user.email || input.email || "unknown",
          name: ctx.user.name || null,
          packageName: product.name,
          productKey: product.key,
          stream: product.stream,
          amount: product.priceCents,
          stripeSessionId: session.id,
          status: "pending",
        });
      }
      await createFunnelEvent({ eventName: "checkout_started", path: "/", productKey: product.key, stream: product.stream });

      return { url: session.url };
    }),

    // Get checkout session details for thank you page
    getCheckoutSession: protectedProcedure.input(z.object({
      sessionId: z.string(),
    })).query(async ({ input, ctx }) => {
      const session = await stripe.checkout.sessions.retrieve(input.sessionId, {
        expand: ['line_items', 'payment_intent', 'customer_details'],
      });

      if (!session) throw new Error('Session not found');

      const sessionEmail = session.customer_details?.email || session.customer_email;
      const belongsToUser = session.client_reference_id === ctx.user.id.toString()
        || session.metadata?.user_id === ctx.user.id.toString()
        || (!!ctx.user.email && sessionEmail === ctx.user.email);
      if (!belongsToUser) {
        throw new Error("This checkout session does not belong to your account.");
      }

      const amount = session.amount_total || 0;
      const currency = session.currency || 'usd';
      const productName = session.metadata?.product_name || 'Product';
      const status = session.payment_status;

      return {
        sessionId: session.id,
        amount,
        currency,
        productName,
        status,
        createdAt: new Date(session.created * 1000),
      };
    }),

    // Get all products for frontend display
    products: publicProcedure.query(() => {
      return ALL_PRODUCTS.map(p => ({
        key: p.key,
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        interval: p.interval,
        stream: p.stream,
        tier: p.tier,
        featured: p.featured,
      }));
    }),
  }),

  feedback: router({
    submit: protectedProcedure.input(z.object({
      satisfaction: z.number().min(1).max(5),
      workload: z.number().min(1).max(5).optional(),
      comments: z.string().optional(),
    })).mutation(async ({ input, ctx }) => {
      await createFeedback({
        userId: ctx.user.id,
        name: ctx.user.name || null,
        satisfaction: input.satisfaction,
        workload: input.workload || null,
        comments: input.comments || null,
      });
      return { success: true };
    }),
    list: adminProcedure.query(async () => getFeedbackList()),
    averageSatisfaction: adminProcedure.query(async () => getAverageSatisfaction()),
  }),

  // ── Client Portal ──
  portal: router({
    // Get user's purchases from local DB
    myPurchases: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user.email) return [];
      const purchases = await getUserPurchases(ctx.user.email);
      // Defense in depth: a data-layer regression must not expose another user's purchases.
      return purchases.filter(purchase => purchase.email === ctx.user.email);
    }),

    // Get user's active subscriptions from Stripe
    mySubscriptions: protectedProcedure.query(async ({ ctx }) => {
      const customerId = ctx.user.stripeCustomerId;
      if (!customerId) return [];
      try {
        const subs = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 20, expand: ["data.items.data.price.product"] });
        return subs.data.map(sub => ({
          id: sub.id,
          status: sub.status,
          currentPeriodStart: (sub as any).current_period_start ? new Date((sub as any).current_period_start * 1000).toISOString() : null,
          currentPeriodEnd: (sub as any).current_period_end ? new Date((sub as any).current_period_end * 1000).toISOString() : null,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          items: sub.items.data.map(item => {
            const product = item.price.product as Stripe.Product;
            return {
              productName: typeof product === "object" ? product.name : "Unknown",
              productDescription: typeof product === "object" ? product.description : null,
              amount: item.price.unit_amount || 0,
              currency: item.price.currency,
              interval: item.price.recurring?.interval || null,
            };
          }),
        }));
      } catch (err) {
        console.error("[Portal] Failed to fetch subscriptions:", err);
        return [];
      }
    }),

    // Get user's invoices from Stripe with PDF download links
    myInvoices: protectedProcedure.query(async ({ ctx }) => {
      const customerId = ctx.user.stripeCustomerId;
      if (!customerId) return [];
      try {
        const invoices = await stripe.invoices.list({ customer: customerId, limit: 50 });
        return invoices.data.map(inv => ({
          id: inv.id,
          number: inv.number,
          status: inv.status,
          amountDue: inv.amount_due,
          amountPaid: inv.amount_paid,
          currency: inv.currency,
          created: new Date(inv.created * 1000).toISOString(),
          periodStart: inv.period_start ? new Date(inv.period_start * 1000).toISOString() : null,
          periodEnd: inv.period_end ? new Date(inv.period_end * 1000).toISOString() : null,
          invoicePdf: inv.invoice_pdf,
          hostedInvoiceUrl: inv.hosted_invoice_url,
          description: inv.description || (inv.lines.data[0]?.description ?? null),
        }));
      } catch (err) {
        console.error("[Portal] Failed to fetch invoices:", err);
        return [];
      }
    }),

    // Get portal summary (plan, customer status)
    summary: protectedProcedure.query(async ({ ctx }) => {
      return {
        plan: ctx.user.plan,
        stripeCustomerId: ctx.user.stripeCustomerId,
        hasSubscription: !!ctx.user.stripeSubscriptionId,
        email: ctx.user.email,
        name: ctx.user.name,
      };
    }),

    // Cancel a subscription (sets cancel_at_period_end so the customer keeps access until the billing period ends)
    cancelSubscription: protectedProcedure.input(z.object({
      subscriptionId: z.string().min(1),
    })).mutation(async ({ input, ctx }) => {
      const customerId = ctx.user.stripeCustomerId;
      if (!customerId) throw new Error("No Stripe customer linked to your account.");

      // Verify the subscription belongs to this customer
      const sub = await stripe.subscriptions.retrieve(input.subscriptionId);
      const subCustomer = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
      if (subCustomer !== customerId) {
        throw new Error("This subscription does not belong to your account.");
      }
      if (sub.status !== "active" && sub.status !== "trialing") {
        throw new Error("Only active or trialing subscriptions can be cancelled from the portal.");
      }

      // Cancel at period end so the customer retains access until the current billing cycle finishes
      const updated = await stripe.subscriptions.update(input.subscriptionId, {
        cancel_at_period_end: true,
      });

      return {
        success: true,
        cancelAtPeriodEnd: updated.cancel_at_period_end,
        currentPeriodEnd: (updated as any).current_period_end
          ? new Date((updated as any).current_period_end * 1000).toISOString()
          : null,
      };
    }),
  }),

  admin: router({
    stats: adminProcedure.query(async () => {
      const [revenue, pendingPurchaseExceptions, subscribers, leadCount, newsletterCount, userCount, avgSatisfaction] = await Promise.all([
        getRevenueTotal(), getPendingPurchaseExceptionCount(), getSubscriberCount(), getLeadCount(), getNewsletterCount(), getUserCount(), getAverageSatisfaction(),
      ]);
      return { revenue, pendingPurchaseExceptions, subscribers, leadCount, newsletterCount, userCount, avgSatisfaction };
    }),
    purchases: adminProcedure.query(async () => getPurchases()),
    operatingDecisions: adminProcedure.query(async () => getOperatingDecisions()),
    createOperatingDecision: adminProcedure.input(z.object({
      signal: z.string().min(3).max(256),
      evidence: z.string().max(5000).optional(),
      decision: z.string().min(3).max(5000),
      owner: z.string().min(2).max(128),
      dueDate: z.string().datetime().optional(),
    })).mutation(async ({ input }) => {
      const id = await createOperatingDecision({
        signal: input.signal,
        evidence: input.evidence || null,
        decision: input.decision,
        owner: input.owner,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        status: "open",
      });
      return { success: true, id };
    }),
    updateOperatingDecisionStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["open", "completed", "deferred"]),
    })).mutation(async ({ input }) => {
      await updateOperatingDecisionStatus(input.id, input.status);
      return { success: true };
    }),
    growthOverview: adminProcedure.query(async () => {
      const now = new Date();
      const eightWeeksAgo = new Date(now.getTime() - 56 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const [purchases, eventRows] = await Promise.all([
        getCompletedPurchasesSince(eightWeeksAgo),
        getFunnelEventCounts(thirtyDaysAgo),
      ]);
      const weekStarts = Array.from({ length: 8 }, (_, index) => {
        const date = new Date(now);
        date.setUTCDate(date.getUTCDate() - (7 - index) * 7);
        date.setUTCHours(0, 0, 0, 0);
        date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
        return date;
      });
      const weeklyRevenue = weekStarts.map((weekStart) => ({
        name: weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
        revenue: 0,
      }));
      const revenueByStream = new Map<string, number>();
      for (const purchase of purchases) {
        const purchaseDate = new Date(purchase.createdAt);
        purchaseDate.setUTCHours(0, 0, 0, 0);
        purchaseDate.setUTCDate(purchaseDate.getUTCDate() - ((purchaseDate.getUTCDay() + 6) % 7));
        const bucketIndex = weekStarts.findIndex((week) => week.getTime() === purchaseDate.getTime());
        if (bucketIndex >= 0) weeklyRevenue[bucketIndex].revenue += purchase.amount;
        const stream = purchase.stream || "unattributed";
        revenueByStream.set(stream, (revenueByStream.get(stream) || 0) + purchase.amount);
      }
      const eventCounts = Object.fromEntries(eventRows.map((row) => [row.eventName, Number(row.count)]));
      return {
        weeklyRevenue,
        revenueByStream: Array.from(revenueByStream, ([stream, revenue]) => ({ stream, revenue })).sort((a, b) => b.revenue - a.revenue),
        funnel: {
          pageViews: eventCounts.page_view || 0,
          ctaClicks: eventCounts.cta_click || 0,
          leads: eventCounts.lead_submitted || 0,
          checkoutsStarted: eventCounts.checkout_started || 0,
          checkoutsCompleted: eventCounts.checkout_completed || 0,
          portalViews: eventCounts.portal_viewed || 0,
        },
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
