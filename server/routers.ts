import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import { stripe, ALL_PRODUCTS, getProductByKey } from "./stripe";
import {
  createLead, getLeads, updateLeadStatus, getLeadCount,
  subscribeNewsletter, getNewsletterCount,
  createPurchase, getPurchases, getRevenueTotal,
  createFeedback, getFeedbackList, getAverageSatisfaction,
  getSubscriberCount, getUserCount,
  createEmailSequence,
  getUserPurchases, updateUserStripeCustomerId,
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

  stripe: router({
    // Universal checkout for any product by key
    createCheckout: publicProcedure.input(z.object({
      productKey: z.string(),
      email: z.string().email().optional(),
    })).mutation(async ({ input, ctx }) => {
      const origin = ctx.req.headers.origin || ctx.req.headers.referer?.replace(/\/$/, '') || "http://localhost:3000";
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
        customer_email: input.email || ctx.user?.email || undefined,
        metadata: {
          product_key: product.key,
          product_name: product.name,
          stream: product.stream,
          user_id: ctx.user?.id?.toString() || "",
        },
        success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/#pricing`,
        allow_promotion_codes: true,
      });

      // Track one-time purchases
      if (!isSubscription) {
        await createPurchase({
          email: input.email || ctx.user?.email || "unknown",
          name: ctx.user?.name || null,
          packageName: product.name,
          amount: product.priceCents,
          stripeSessionId: session.id,
          status: "pending",
        });
      }

      return { url: session.url };
    }),

    // Get checkout session details for thank you page
    getCheckoutSession: publicProcedure.input(z.object({
      sessionId: z.string(),
    })).query(async ({ input }) => {
      const session = await stripe.checkout.sessions.retrieve(input.sessionId, {
        expand: ['line_items', 'payment_intent'],
      });

      if (!session) throw new Error('Session not found');

      const amount = session.amount_total || 0;
      const currency = session.currency || 'usd';
      const email = session.customer_email || 'unknown';
      const productName = session.metadata?.product_name || 'Product';
      const status = session.payment_status;

      return {
        sessionId: session.id,
        amount,
        currency,
        email,
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
      return getUserPurchases(ctx.user.email);
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
      const [revenue, subscribers, leadCount, newsletterCount, userCount, avgSatisfaction] = await Promise.all([
        getRevenueTotal(), getSubscriberCount(), getLeadCount(), getNewsletterCount(), getUserCount(), getAverageSatisfaction(),
      ]);
      return { revenue, subscribers, leadCount, newsletterCount, userCount, avgSatisfaction };
    }),
    purchases: adminProcedure.query(async () => getPurchases()),
  }),
});

export type AppRouter = typeof appRouter;
