# ARM Agency Baseline GTM, SEO/GEO, Analytics, and Security Audit

**Prepared for:** ARM Agency  
**Assessment scope:** Current production codebase and configured operating flows  
**Purpose:** Establish a decision-ready baseline for revenue operations without inventing traffic, customer, performance, or outcome data.

## Executive Assessment

ARM Agency now has a coherent revenue foundation: five offer streams, direct purchase paths for bounded and low-touch products, a qualification-first path for high-touch services, Stripe checkout, an authenticated customer portal, and owner-only operational visibility. The public marketing surface is materially more crawlable and machine-readable than a client-rendered single-page application because the site now renders public routes on the server and exposes explicit crawler, sitemap, structured-data, FAQ, and AI-agent discovery resources.

The limiting factor is **not feature completeness**. It is operational proof and distribution readiness. The intended primary custom domain is unavailable, and there is no established baseline yet for qualified organic demand, source quality, conversion, retention, or subscription revenue. The dashboard intentionally reports only recorded one-time completed-purchase data and minimal first-party funnel counts; it does not present unsupported MRR, client, traffic, or outcome claims.

> **Launch gate:** Do not scale paid acquisition, canonical SEO work, or external authority building until `arm-agency.xyz` serves the live public experience and is selected as the canonical primary domain.

## Evidence Reviewed

| Area | Evidence location | Baseline conclusion |
| --- | --- | --- |
| Offer catalog and checkout | `server/stripe.ts`, `client/src/pages/Home.tsx` | Five-stream catalog exists; bounded and education products use checkout while high-touch offers qualify first. |
| Lead and lifecycle flow | `server/routers.ts`, `server/scheduled.ts` | Leads persist before notifications and initiate a three-step follow-up sequence. |
| Technical SEO and GEO | `client/src/entry-server.tsx`, `client/src/ssr/prefetch.ts`, `client/public/robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `faq.html` | Public pages have SSR, crawler access controls, discoverability files, and visible structured information. |
| Purchase and portal controls | `server/routers.ts`, `server/webhooks.ts`, `client/src/pages/ClientPortal.tsx` | Billing and portal queries are authenticated and bound to the customer; completion is verified by Stripe webhook. |
| Owner reporting | `client/src/pages/AdminDashboard.tsx`, `server/db.ts`, `server/scheduled.ts` | Dashboard has live completed-purchase cohorts, stream attribution, and first-party funnel counts. |
| Test coverage | `server/routers.test.ts` | Existing suite covers auth, checkout, owner access, portal access, cancellation ownership, and first-party growth reporting. |

## Funnel and Conversion Baseline

The primary public journey is now **Diagnose → Design → Operate**. The AI Infrastructure Audit, Mandate Chain Design Workshop, and Custom MCP Tool provide bounded entry points with visible pricing. This is appropriate for buyers who can make an immediate purchase decision. The Swell, ARM Mandate, and Arctura service offers route buyers into a qualification conversation before an ongoing engagement begins. That distinction protects delivery quality, avoids unscoped subscription commitments, and gives the sales process an explicit handoff.

| Funnel stage | Current implementation | Decision use | Current limitation |
| --- | --- | --- | --- |
| Acquisition | Server-rendered landing page, sitemap, FAQ, AI-readable discovery files | Establish a crawlable, comprehensible public surface | No source, campaign, or content-topic attribution yet; no baseline traffic data is claimed. |
| Consideration | Capabilities, engagement path, offer groups, FAQ | Explain who the product is for and which path to start with | Public proof library, scope samples, and independently verifiable case material remain thin. |
| Intent | Diagnostic CTA, qualification form, direct purchase buttons | Measure buyer intent and reduce friction | Lead scoring and CRM tasks are still manual after capture. |
| Revenue | Stripe Checkout, verified completion webhook, thank-you route, receipt, portal | Confirm payment and provide a customer access route | Dashboard’s purchase revenue excludes recurring invoice/MRR reporting by design. |
| Retention | Portal, invoices, cancellation at period end, employee feedback | Detect customer access and churn signals | Customer health uses portal-view proxies; contract-specific delivery health is not yet modeled. |

## Product and Commercial Architecture

The product catalog is structurally sound but should be operated as a portfolio rather than marketed as five unrelated product lists. Each stream needs a clear buyer, proof requirement, qualification trigger, and success definition. The existing catalog supports this routing.

| Stream | Buyer problem | Current route | Next proof asset needed |
| --- | --- | --- | --- |
| Swell GEO | AI-search visibility and entity clarity | Qualification-first operating engagement | Sample entity audit, publishing cadence, and clear deliverable boundaries. |
| ARM Mandate | Governed production agent deployment | Audit → workshop → qualified engagement | Security, decision-rights, and pilot milestone template. |
| Arctura Network | Network participation and operator collaboration | Qualification-first membership conversation | Membership terms, eligibility, and operating expectations. |
| Academy | Skills and operator education | Direct purchase | Curriculum, cohort calendar, prerequisites, and refund/support terms. |
| Coreweaver | Bounded infrastructure setup | Direct purchase or scoped delivery | Implementation checklist, handoff model, and support boundary. |

## Technical SEO and GEO Baseline

The public surface is optimized for understanding rather than for unsupported ranking claims. Server rendering makes the initial public HTML available without relying solely on post-load client execution. The crawler policy, XML sitemap, canonical metadata map, JSON-LD for the organization and services, FAQPage markup, and the `llms.txt` family give search engines and AI agents several explicit routes to discover the public service narrative.

| Control | Status | Operational standard |
| --- | --- | --- |
| Server-rendered public HTML | Implemented | Revalidate with a production HTML fetch whenever routes or metadata change. |
| Canonical metadata and noindex private routes | Implemented | Point public canonicals only to the active primary domain after domain restoration. |
| XML sitemap and robots policy | Implemented | Keep only indexable, valuable public URLs in the sitemap. |
| Organization, Service, and FAQ structured data | Implemented | Keep schema aligned with visible copy; remove claims lacking source or contract support. |
| AI-agent discovery files | Implemented | Update `llms.txt`, `llms-full.txt`, and `AGENTS.md` whenever offers or public facts change. |
| Citation-ready FAQ | Implemented | Add answers only when scope, eligibility, deliverables, or policies can be stated accurately. |

The primary technical SEO risk is the unavailable custom domain. Until the preferred domain is restored, the site has a fragmented canonical identity across generated and custom-hostname variants. This should be treated as a deployment dependency rather than a marketing detail.

## Analytics and Operating Controls

The current instrumentation captures a deliberately small first-party event vocabulary: `page_view`, `cta_click`, `lead_submitted`, `checkout_started`, `checkout_completed`, and `portal_viewed`. The event table stores only the event name, optional route, optional product key, optional stream, and timestamp. It does not persist event-level names, emails, customer IDs, or third-party tracking identifiers.

| Owner view | Data source | Meaning | Boundary |
| --- | --- | --- | --- |
| Eight-week revenue cohort | Completed `purchases` records | Recorded one-time purchase revenue by week | Does not estimate MRR or include a recurring invoice ledger. |
| Revenue by stream | Completed `purchases` with stream attribution | Which one-time offer stream generated recorded revenue | Historic records without stream metadata appear as unattributed. |
| Funnel signal counts | First-party `funnelEvents` records, trailing 30 days | Directional path health from view to confirmed payment | Counts are not unique visitors and should not be interpreted as audited web analytics. |
| Weekly owner report | Scheduled report, trailing seven days | Daily/weekly triage signal for revenue, lead, checkout, and portal activity | Requires owner review and source-quality context. |

## Security and Customer-Data Baseline

Authorization is anchored on server-side procedures rather than on visual hiding in the client. Owner reporting uses an admin-only server guard. Portal purchases are filtered by the authenticated customer email at the data layer and again before return. Stripe subscriptions, invoices, and cancellation actions use the customer ID stored on the authenticated user; cancellation verifies that the subscription belongs to that Stripe customer and is in an active or trialing state.

Checkout-session details are now protected. The user must be authenticated and match the Stripe session through a client reference, user metadata, or verified customer email. The session response omits the purchaser email. This prevents a bearer-like session identifier in a thank-you URL from being used to retrieve another buyer’s payment details through the application.

| Control | Current status | Residual action |
| --- | --- | --- |
| Admin access | Server-side `adminProcedure` plus client access-denied state | Periodically confirm owner role assignment after identity changes. |
| Portal purchases | Authenticated and email-scoped with defense-in-depth filter | Keep email identity normalization consistent across authentication and billing. |
| Portal subscriptions/invoices | Stripe customer-scoped | Maintain explicit test coverage for mismatched customer contexts. |
| Cancellation | Subscription-to-customer verification and permitted-status check | Consider a cancellation-reason survey only if it has a defined retention workflow. |
| Checkout details | Authenticated ownership check; no email returned | Continue to treat checkout session IDs as sensitive references. |
| Payment completion | Verified Stripe webhook | Monitor webhook delivery failures in Stripe before reconciling revenue. |

## Prioritized Recommendations

| Priority | Action | Why it matters | Owner signal of completion |
| --- | --- | --- | --- |
| P0 | Renew or reconnect `arm-agency.xyz`, set it as canonical, and verify the public homepage, sitemap, robots, FAQ, and checkout return route on that domain. | Prevents fragmented canonicalization and makes paid-acquisition landing paths dependable. | Domain resolves, canonical tags use it, and checkout returns successfully. |
| P0 | Claim the Stripe sandbox, verify a production-domain checkout with the approved test mechanism, and reconcile webhook completion to portal access. | Ensures the cash-collection path works before promotion. | Stripe session, webhook, thank-you state, receipt, and portal record all agree. |
| P1 | Publish one evidence-backed proof asset for each high-touch stream: deliverables, exclusions, scope example, and eligibility. | Replaces generic capability copy with decision-grade buyer evidence. | Each offer links to a scoped, sourceable proof page. |
| P1 | Run the weekly operating review using source, CTA, lead, checkout, payment, and cancellation signals. | Converts instrumentation into decisions rather than passive reporting. | One recorded weekly decision: continue, repair, or stop a distribution activity. |
| P1 | Backfill stream attribution for any historical completed purchases where accurate source data exists. | Prevents the “unattributed” category from obscuring portfolio performance. | Revenue-by-stream card reflects labeled historical purchases. |
| P2 | Add source, campaign, and content-topic attribution using a privacy-reviewed, first-party approach. | Allows distribution decisions to be tied to qualified demand rather than raw volume. | Lead and checkout records can be segmented without storing unnecessary personal data. |
| P2 | Model contract delivery health separately from product usage. | Portal views are not a substitute for delivery health or renewal risk. | A simple per-engagement health review has owner, cadence, risk, and next action. |

## Weekly Operating Cadence

The owner should review new high-intent leads, completed payments, checkout starts without completion, and cancellation activity each business day. Every week, compare the last seven days of first-party funnel signals with the prior period, identify the stream and CTA producing the best qualified intent, and choose one distribution or message experiment to continue, repair, or stop. Each month, review delivered value and renewal risk, then update only those public claims that can be supported by a current deliverable, policy, contract, or source.

## Release Readiness Decision

The platform is **implementation-ready for controlled launch**, subject to final automated validation and primary-domain restoration. The current code has the necessary controls to accept and qualify demand, collect Stripe payment for appropriate offers, provide customers with billing access, and give the owner a truthful operational view. A broad traffic or paid-media launch should remain deferred until the custom domain and Stripe end-to-end verification are complete.
