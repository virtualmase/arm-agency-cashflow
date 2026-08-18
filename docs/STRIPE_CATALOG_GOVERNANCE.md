# Stripe Catalog Governance

## Purpose

The Stripe catalog is a collection and reconciliation surface, not the source of
truth for an offer. An offer is ready only when its public description, written
scope, delivery boundary, acceptance criteria, collection path, webhook record,
and post-payment handoff agree.

The canonical offer definitions live in `server/stripe.ts`. Stripe Products,
Prices, and Payment Links must carry the same `product_key`, `stream`, and
`journey` metadata so a payment can be reconciled without inferring scope or
revenue.

## Approved journeys

| Journey | Eligible offers | Collection rule |
| --- | --- | --- |
| `direct_bounded_purchase` | Self-paced education and a genuinely fixed-scope implementation | Checkout may begin after the buyer can review the complete scope, exclusions, acceptance criteria, and terms. |
| `scoped_private_collection` | Variable implementations such as a custom MCP tool or enterprise setup | Send a private collection link only after written scope acceptance. |
| `qualified_private_collection` | Swell, ARM Mandate, and managed-infrastructure engagements | Qualification and written scope precede private collection. Never publish the Payment Link as a self-service CTA. |
| `eligibility_private_collection` | Arctura participation tiers | Eligibility and current written participation terms precede private collection. |

Payment does not authorize an agent to invent scope, claim an outcome, mark an
opportunity closed won without the required agreement evidence, or begin
fulfillment outside the documented handoff.

## Metadata contract

Every retained Product, Price, Payment Link, Checkout Session, Subscription, and
PaymentIntent should carry, where supported:

- `product_key`: stable key from `ALL_PRODUCTS`
- `stream`: `swell`, `arm`, `arctura`, `academy`, or `coreweaver`
- `journey`: one of the approved journey values above
- `scope_version`: accepted proposal or fixed-offer version when collection is private
- `opportunity_id`: CRM identifier when a qualified engagement is collected

Do not put secrets, payment details, private proposal text, or personal data in
metadata.

## Catalog lifecycle

1. Reuse the active canonical Product for a `product_key`.
2. Reuse an active Price when amount, currency, tax behavior, and recurrence are
   unchanged. Stripe Prices are immutable commercial records, not deployment
   artifacts.
3. Create a new Price only for a deliberate commercial change. Set it as the
   Product default, update the retained Payment Link, then archive the replaced
   Price after checking active subscriptions.
4. Keep at most one active general-purpose Payment Link per approved direct
   purchase. Qualified and scoped links are private collection instruments and
   must say so in their submit text.
5. Archive duplicates rather than deleting historical objects. Never archive a
   Price used by an active subscription.
6. Do not modify unrelated catalogs that lack an Aureus `product_key`; resolve
   ownership first.

## Copy standard

Product descriptions state the buyer decision, delivery boundary, governance,
and acceptance model. They do not promise rankings, citations, traffic,
autonomous behavior, unlimited work, unverified monitoring, undefined rights,
or outcomes controlled by third parties.

Payment Link submit text must identify whether the purchase is direct or follows
an accepted written scope. Completion text confirms receipt and the controlled
next step; it must not claim fulfillment, access, revenue, or onboarding before
the corresponding verified system event.

## Launch gates

Before activating or distributing a Payment Link:

- Product, Price, and link metadata agree.
- The offer journey agrees with the public CTA and written scope.
- Tax behavior reflects actual registrations; `automatic_tax` is not enabled
  merely as a placeholder.
- Webhook signatures are verified.
- Checkout fulfillment handles `checkout.session.completed` and
  `checkout.session.async_payment_succeeded`, gated on paid status.
- Recurring offers also reconcile `invoice.paid`, `invoice.payment_failed`, and
  `customer.subscription.*` lifecycle events.
- Receipt, support, cancellation, and handoff paths have named owners.

## Review cadence

Review the live catalog quarterly and after any offer, price, scope, tax,
webhook, domain, or fulfillment change. Record active canonical objects,
duplicates archived, customer dependencies checked, and exceptions requiring
an owner decision.
