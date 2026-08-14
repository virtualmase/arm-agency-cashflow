# ARM Agency Backend, Security, and Operating Decision Runbook

**Purpose:** Turn the existing dashboard, Stripe integration, portal controls, and event instrumentation into a repeatable operating discipline.  
**Principle:** Operational data is useful only when it has an owner, a review cadence, and a defined response.

## 1. System Boundaries

| System area | Current responsibility | Owner question |
| --- | --- | --- |
| Public site | Explain offers, route qualified intent, publish evidence-safe resources | Does the public surface match actual scope and the active primary domain? |
| Lead system | Persist inquiries, start nurture sequence, expose owner CRM | Does every lead have a status, owner action, and next-contact date? |
| Stripe Checkout | Collect payment for suitable direct-purchase offers | Does the checkout session match the intended product, buyer, and return route? |
| Stripe webhook | Verify payment events and link the right customer/purchase data | Was payment completion processed once and reconciled with the local record? |
| Client portal | Scope purchases, subscriptions, invoices, and cancellation to the authenticated customer | Can a customer see only their own billing data and act only on their own subscriptions? |
| Admin dashboard | Show owner-only revenue, funnel, lead, and health signals | Does the dashboard lead to a concrete decision or assigned task? |
| Employee-satisfaction module | Surface workload/satisfaction signals | Is delivery capacity sustainable before more work is accepted? |

## 2. Daily Operating Checklist

| Check | Source | Required action |
| --- | --- | --- |
| New high-intent leads | Leads CRM and owner notifications | Assign status, sales owner, and next action within one business day. |
| Completed checkout events | Stripe Dashboard, webhook logs, purchases table, portal | Confirm payment, local completion record, receipt, portal access, and delivery handoff agree. |
| Checkout starts without completion | First-party funnel counts and Stripe sessions | Review only patterns with enough context; repair a clear message, product, or payment issue. |
| Subscription and cancellation activity | Client portal and Stripe | Confirm end-of-term date, support response, and customer-success follow-up. |
| Delivery blockers | Client health and weekly status records | Assign a named owner or escalate; do not leave blockers as general notes. |
| Security or data exception | Logs, support report, or customer concern | Contain access, record the facts, and initiate the appropriate incident path. |

## 3. Weekly Owner Review

The weekly review should last long enough to create decisions, not so long that it becomes passive reporting.

| Area | Review question | Evidence | Decision output |
| --- | --- | --- | --- |
| Acquisition | Which topics, CTAs, or sources created relevant conversations? | Funnel counts, lead notes, content/distribution activity | Continue, repair, or stop one activity. |
| Commercial | Are discovery and proposal paths producing defensible scopes? | Qualification scores, proposals, lost reasons, scope changes | Improve one stage of the commercial process. |
| Revenue integrity | Are payments, refunds, portal records, and delivery handoffs reconciled? | Stripe, purchases table, webhooks, delivery brief | Resolve every exception with an owner and date. |
| Delivery health | Which clients are amber/red and why? | Status updates, risks, decision records, health reviews | Recovery action, scope change, capacity action, or escalation. |
| Team health | Is workload sustainable? | Satisfaction, workload signals, interruptions, escalation volume | Reduce/resequence work or change ownership before quality declines. |
| Content | Which asset helped a real buyer decision? | Sales references, relevant replies, CTA activity | Deepen/reuse one asset; retire or revise weak material. |

## 4. Payment Reconciliation Procedure

1. Confirm the Stripe event was signature-verified and processed by the webhook.
2. Confirm the event maps to the intended checkout session and product metadata.
3. Confirm the local purchase status is completed when a one-time payment completes.
4. Confirm the authenticated customer record has the appropriate Stripe customer or subscription identifier when applicable.
5. Confirm the buyer received the expected receipt and can reach the appropriate portal path.
6. Create or confirm the delivery handoff before beginning fulfillment.
7. If records disagree, pause fulfillment of the affected transaction until the mismatch is documented and resolved.

| Exception | First response | Escalation threshold |
| --- | --- | --- |
| Stripe payment succeeded but local purchase remains pending | Inspect webhook delivery and session ID; replay only through approved Stripe procedure if appropriate | Any repeated event-processing or signature issue. |
| Buyer cannot see expected portal data | Confirm authenticated identity and Stripe customer linkage; never expose another customer’s record | Evidence of cross-customer leakage or identifier mismatch. |
| Receipt or invoice question | Confirm Stripe record and provide the customer-supported invoice route | Request involves private billing data that cannot be verified to the authenticated buyer. |
| Cancellation request | Use the authenticated self-service flow or verified support workflow | Subscription/customer mismatch or disputed charge. |

## 5. Security Review Cadence

| Review | Cadence | Required checks |
| --- | --- | --- |
| Admin access review | Quarterly and after ownership changes | Confirm only necessary accounts hold admin role. |
| Portal authorization test | Before each significant portal/payment release | Verify purchases, subscriptions, invoices, checkout details, and cancellation reject cross-customer access. |
| Stripe webhook review | Monthly | Verify endpoint status, signature failures, delivery exceptions, and event coverage. |
| Dependency and build review | Monthly or before material release | Run type checks, test suite, production build, and assess security-relevant dependency alerts. |
| Secrets and configuration review | Quarterly and after personnel change | Confirm secrets remain in managed configuration and no tokens are in code, docs, or client output. |
| Incident retrospective | After material event | Document timeline, impact, containment, corrective action, and test/runbook update. |

## 6. Security Incident Path

| Phase | Required action |
| --- | --- |
| Contain | Stop unsafe access or automation path, preserve minimal facts, and avoid expanding exposure during investigation. |
| Verify | Determine the affected system, data category, account boundary, event sequence, and current risk. |
| Escalate | Involve the agency owner and the appropriate security, legal, provider, or customer contact based on the actual incident. |
| Correct | Patch the authorization, configuration, workflow, or documentation gap; avoid only cosmetic fixes. |
| Test | Add or update a regression test where technically appropriate and re-run release validation. |
| Learn | Update the runbook, owner checklist, and capacity/process assumptions. |

## 7. Data-Minimization Rules

First-party funnel instrumentation should retain only the event name, optional route, product key, stream, and timestamp. It should not duplicate customer PII into a general analytics log. Payment details remain in Stripe; local records retain only identifiers and business-specific data needed for fulfillment, reporting, and customer access. Customer or employee feedback must be viewed only by roles with a clear operational need.

## 8. Decision-Log Template

| Date | Signal or issue | Evidence | Decision | Owner | Due date | Review outcome |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

The owner maintains this log during daily and weekly review. It is the bridge between observability and action. If a metric does not result in a decision, task, or confirmed no-action rationale, the team should reconsider collecting it.

## 9. Release Checklist

Before any production release or post-freeze launch action, confirm that type checks, automated tests, and production build pass; private routes are not indexable; public routes have accurate metadata; new links and CTAs work; Stripe checkout and webhooks are correctly configured for the target domain; dashboard data labels state their true scope; and the rollback/checkpoint path is known.
