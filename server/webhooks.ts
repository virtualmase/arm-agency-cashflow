import { Router, raw } from "express";
import { stripe } from "./stripe";
import { updatePurchaseStatus, updateUserStripeCustomerId, updateUserSubscription, createFunnelEvent } from "./db";
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
        const userId = session.metadata?.user_id ? parseInt(session.metadata.user_id) : null;
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;

        // Persist Stripe customer ID to user record
        if (userId && customerId) {
          await updateUserStripeCustomerId(userId, customerId);
          console.log(`[Webhook] Linked Stripe customer ${customerId} to user ${userId}`);
        }

        if (session.mode === "payment") {
          await updatePurchaseStatus(session.id, "completed", session.payment_intent as string);
          await notifyOwner({
            title: `Payment Received: ${session.metadata?.product_name || "Package"}`,
            content: `Amount: $${(session.amount_total || 0) / 100}\nCustomer: ${session.customer_email || "Unknown"}\nProduct: ${session.metadata?.product_name || "N/A"}\nStream: ${session.metadata?.stream || "N/A"}`,
          });
        } else if (session.mode === "subscription") {
          // Persist subscription ID to user record
          const subscriptionId = typeof session.subscription === "string" ? session.subscription : (session.subscription as any)?.id;
          if (userId && subscriptionId) {
            await updateUserSubscription(userId, subscriptionId, "pro");
            console.log(`[Webhook] Linked subscription ${subscriptionId} to user ${userId}`);
          }
          await notifyOwner({
            title: `New Subscriber: ${session.metadata?.product_name || "Subscription"}`,
            content: `Customer: ${session.customer_email || "Unknown"}\nProduct: ${session.metadata?.product_name || "N/A"}\nStream: ${session.metadata?.stream || "N/A"}\nSubscription: ${subscriptionId || "N/A"}`,
          });
        }
        await createFunnelEvent({
          eventName: "checkout_completed",
          path: "/thank-you",
          productKey: session.metadata?.product_key || null,
          stream: session.metadata?.stream || null,
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[Webhook] Subscription updated: ${subscription.id} → ${subscription.status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[Webhook] Subscription cancelled: ${subscription.id}`);
        // Note: We don't clear the user's subscription here because the user record
        // should reflect the last known state. The portal fetches live status from Stripe.
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Webhook] Invoice paid: ${invoice.id} — $${(invoice.amount_paid || 0) / 100}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Webhook] Invoice payment failed: ${invoice.id}`);
        await notifyOwner({
          title: "Payment Failed",
          content: `Invoice: ${invoice.id}\nCustomer: ${invoice.customer_email || "Unknown"}\nAmount: $${(invoice.amount_due || 0) / 100}`,
        });
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
