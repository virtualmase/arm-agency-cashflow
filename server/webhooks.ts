import { Router, raw } from "express";
import { stripe } from "./stripe";
import { updatePurchaseStatus } from "./db";
import { notifyOwner } from "./_core/notification";
import Stripe from "stripe";

const webhookRouter = Router();

webhookRouter.post("/api/stripe/webhook", raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!webhookSecret) {
      console.warn("[Webhook] No webhook secret configured");
      return res.status(400).json({ error: "Webhook secret not configured" });
    }
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "payment") {
          await updatePurchaseStatus(session.id, "completed", session.payment_intent as string);
          await notifyOwner({
            title: `Payment Received: ${session.metadata?.package_name || "Quick Start Package"}`,
            content: `Amount: $${(session.amount_total || 0) / 100}\nCustomer: ${session.customer_email || "Unknown"}\nPackage: ${session.metadata?.package_name || "N/A"}`,
          });
        } else if (session.mode === "subscription") {
          await notifyOwner({
            title: "New ARM Pro Subscriber",
            content: `Customer: ${session.customer_email || "Unknown"}\nSubscription started.`,
          });
        }
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Webhook] Invoice paid: ${invoice.id}`);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[Webhook] Subscription cancelled: ${subscription.id}`);
        break;
      }
      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("[Webhook] Error processing event:", err);
  }

  res.json({ received: true });
});

export { webhookRouter };
