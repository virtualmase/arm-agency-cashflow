# ARM Agency Controlled Launch Activation Runbook

**Use when:** The account freeze has lifted and `arm-agency.xyz` is expected to serve the live ARM Agency experience.  
**Launch rule:** Do not begin paid acquisition or primary-domain SEO promotion until every P0 item below is confirmed.

## 1. Roles and Stop Authority

| Role | Responsibility | Stop authority |
| --- | --- | --- |
| Agency owner | Confirms commercial readiness, capacity, and launch decision | May pause launch for any material business or delivery risk. |
| Technical owner | Verifies domain, deployment, payment, authorization, and rollback controls | May block launch for correctness, security, privacy, or payment integrity risk. |
| Growth owner | Verifies canonicals, sitemap, content, source tracking, and distribution plan | May delay promotion for domain or measurement inconsistency. |
| Client-success owner | Confirms inbox, response ownership, onboarding path, and support coverage | May delay promotion if new buyers cannot receive a reliable first response. |

## 2. P0 Domain and Deployment Gate

| Check | Pass condition | Evidence |
| --- | --- | --- |
| Custom domain availability | `https://arm-agency.xyz/` loads the current public site—not a membership, parking, or expired page | Direct browser and HTTP check. |
| HTTPS and redirect behavior | HTTPS works; `www` behavior is intentional and consistent | Browser/HTTP result and domain configuration. |
| Canonical primary identity | Public pages declare `arm-agency.xyz` as the canonical host after domain restoration | Rendered page source/metadata check. |
| Public routes | Home, FAQ, five insight guides, robots, sitemap, `llms.txt`, and `llms-full.txt` return expected content | Direct route checks. |
| Private routes | `/portal`, `/admin`, `/satisfaction`, and thank-you details remain unavailable to crawlers or unauthenticated users as intended | Browser and metadata check. |
| Release version | The validated release checkpoint is the active deployment base | Version record and deployment status. |

> **Stop condition:** If the primary domain still presents a membership-expired page, do not change canonicals, launch paid traffic, or treat the domain as live. Keep controlled demonstrations on the working deployment only.

## 3. Checkout and Revenue-Integrity Gate

Payment validation must be performed on the restored production domain. Do not test a live purchase or submit a payment without the owner’s approval.

| Check | Pass condition | Evidence |
| --- | --- | --- |
| Offer routing | High-touch offers route to qualification; bounded/education offers route to their appropriate payment path | CTA walkthrough. |
| Checkout return | Success and cancel paths return to the primary domain as configured | Stripe Checkout test session. |
| Payment verification | Stripe webhook receives and verifies the relevant event | Stripe webhook delivery result and app log. |
| Receipt | Buyer receives Stripe receipt according to Stripe configuration | Approved test buyer confirmation. |
| Portal linkage | The authenticated purchasing account sees only its appropriate purchases/subscriptions/invoices | Approved authenticated test. |
| Thank-you privacy | Session details appear only to the owning authenticated account; no buyer email is exposed by the app response | Approved authenticated/unauthenticated test. |
| Reconciliation | Completed payment, local purchase record, portal, and delivery handoff agree | Owner reconciliation checklist. |

## 4. Content, SEO, and GEO Gate

| Check | Pass condition |
| --- | --- |
| Sitemap | Includes home, FAQ, and five public insight guides on the active primary host. |
| Robots and AI discovery | Public crawler policy and AI discovery files are reachable and describe only actual public content. |
| Structured data | Organization, Service, and FAQ structured data match visible page copy and the active domain. |
| Stream guides | Each guide has a matching offer path and an evidence-safe CTA. |
| Claims review | No customer counts, ratings, testimonials, uptime, rankings, revenue outcomes, or guarantees appear without support. |
| Distribution readiness | Each scheduled post/email/partner outreach has a specific audience, content asset, CTA, and response owner. |

## 5. Operational and Client-Success Gate

| Check | Pass condition |
| --- | --- |
| Lead response | New lead has a named owner and first-response standard within one business day. |
| Sales process | Qualification scorecard, discovery guide, proposal/SOW outline, and delivery handoff brief are ready. |
| Bounded delivery | Audit, workshop, and Custom MCP Tool playbooks are available to the delivery owner. |
| Onboarding | Welcome message, kickoff agenda, status update, health review, and escalation path are assigned. |
| Team capacity | Delivery owner confirms work can be accepted without exceeding sustainable capacity. |
| Owner review | Decision log, reconciliation exceptions, funnel review, and weekly report have a review owner. |
| Support path | Buyers can find a legitimate support/contact route and the support owner can respond. |

## 6. Activation Sequence

| Step | Owner | Action | Proceed only when |
| --- | --- | --- | --- |
| 1 | Technical owner | Verify custom domain availability and HTTPS | P0 domain gate passes. |
| 2 | Technical and growth owners | Update/redeploy canonical host references and sitemap host if necessary | Rendered metadata matches primary host. |
| 3 | Technical owner | Validate protected routes and public insight/FAQ routes | Authorization and noindex boundaries hold. |
| 4 | Owner-approved tester | Run checkout and webhook verification on the primary domain | Payment, receipt, portal, and reconciliation gate pass. |
| 5 | Client-success owner | Rehearse welcome, handoff, and first-response path | A test buyer can receive a reliable next step. |
| 6 | Growth owner | Send one controlled distribution activity to a defined audience | Response owner and measurement are ready. |
| 7 | Agency owner | Review first 24-hour signals and decide continue, repair, or pause | No unresolved P0 exception remains. |

## 7. First 24 Hours of Controlled Launch

| Timing | Review |
| --- | --- |
| Immediately after activation | Domain, public routes, canonicals, analytics event collection, and checkout entry path. |
| After first controlled visitors | CTA behavior, lead capture, form notifications, and dashboard funnel signals. |
| After any approved test payment | Stripe webhook, receipt, thank-you route, portal access, and handoff. |
| End of day | New leads, completed payments, reconciliation exceptions, support requests, delivery capacity, and decision log. |
| Next business day | Continue, repair, or pause distribution based on qualified intent and operational readiness—not traffic volume alone. |

## 8. Rollback and Pause Rules

Pause promotion immediately if the custom domain is unavailable, checkout returns to the wrong host, a payment/webhook reconciliation exception is unresolved, private customer data boundaries fail, a service is being sold without delivery capacity, or the team reports material sustainability risk. Use the latest validated checkpoint for application rollback when needed. Document the trigger, impact, containment, owner, and revalidation requirement in the operating decision log.

## 9. Activation Record

| Date/time | Gate or check | Result | Evidence link/location | Owner | Follow-up |
| --- | --- | --- | --- | --- | --- |
| | | | | | |
