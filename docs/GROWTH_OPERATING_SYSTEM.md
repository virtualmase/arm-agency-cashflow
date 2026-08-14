# ARM Agency Growth Operating System

## Objective

ARM Agency will operate as a **qualified-pipeline and retained-revenue system**, not a catalogue of disconnected products. The primary operating metric is qualified pipeline created and converted by offer, with cash collected, recurring revenue retained, sales-cycle velocity, and customer health as supporting measures. A target is not reported as a performance result; the product will display only live, attributable data or an explicit “no data yet” state.

## Revenue Architecture

| Buyer stage | Buyer need | Recommended offer | Primary conversion event | Next best action |
| --- | --- | --- | --- | --- |
| Discover | Understand agentic visibility or AI-operating risk | Research, FAQ, diagnostic content | Newsletter subscription or diagnostic request | Qualify role, company, use case, and urgency |
| Diagnose | Establish the cost of inaction and the scoped opportunity | AI Infrastructure Audit | Paid audit checkout or qualification call | Present a written finding and recommended implementation path |
| Design | Align decision-makers on governance, scope, and success criteria | Mandate Chain Design Workshop | Workshop purchase or sales conversation | Convert to an ARM pilot or implementation mandate |
| Build | Launch a validated workflow or signal program | ARM Core / Pro or Swell GEO | Contracted subscription | Onboard, define success metrics, and show the first operating dashboard |
| Expand | Add capacity, governance, or distribution | ARM Sovereign, Coreweaver, Arctura | Expansion request | Review outcomes and propose a bounded expansion |
| Learn | Build internal capability without a consulting commitment | Academy products | One-time checkout | Invite learners to a qualifying discovery call when readiness signals are present |

## ICP-to-Offer Routing

| Primary audience | High-intent language | Route | Proof required before purchase |
| --- | --- | --- | --- |
| Marketing and growth leader | AI visibility, entity authority, LLM citation, content operations | GEO Retainers | Sample audit criteria, deliverable list, operating cadence, and applicable evidence |
| Operations or technology leader | agent governance, production agents, observability, human accountability | AI Infrastructure Audit → Mandate Workshop → ARM engagement | Scope boundary, pilot criteria, decision rights, security approach, and implementation milestone plan |
| Agency owner or independent operator | productized GEO service, implementation capability, operator training | Academy / Arctura | Curriculum, availability, cohort terms, and what is included or excluded |
| Enterprise sponsor | agent governance, auditability, controlled deployment | Qualification request → scoped sales path | Security and procurement information, service scope, SLAs only where contractually available |

## Funnel Event Model

Every channel and page should be attributable to a visitor intent and a subsequent business outcome. The event names below are intentionally stable, so reporting can be compared month over month.

| Layer | Events | Operating use |
| --- | --- | --- |
| Acquisition | `page_view`, `source`, `campaign`, `content_topic` | Identify the sources and topics that produce qualified demand rather than raw traffic |
| Consideration | `capability_view`, `offer_view`, `faq_view`, `pricing_view` | Find content gaps and offer-message mismatch |
| Intent | `cta_click`, `diagnostic_started`, `lead_submitted`, `newsletter_subscribed` | Measure conversion-path friction and lead quality |
| Revenue | `checkout_started`, `checkout_completed`, `purchase_recorded`, `subscription_started` | Reconcile attributed revenue against Stripe records |
| Retention | `portal_viewed`, `invoice_downloaded`, `cancellation_requested`, `cancellation_reversed`, `feedback_submitted` | Surface adoption and churn risk before renewal |

## Decision Rules

The site must never claim customer counts, agent counts, uptime, revenue, case-study outcomes, or guarantee terms unless each claim is supportable by a current source or contract. High-touch engagements should use a qualification-first path rather than an unqualified self-service checkout. Low-touch education and explicitly bounded one-time deliverables can retain a direct purchase path.

The public site must serve useful, complete HTML to crawlers. Structured data should describe only the organization, public services, and factual content actually present on the page. Google’s guidance emphasizes that structured data must follow its general policies and match visible page content; its crawler documentation also describes JavaScript processing as a separate rendering phase. [1] [2]

> The immediate launch blocker is the unavailable `arm-agency.xyz` custom domain. Paid acquisition, canonicalization, and indexation should not be scaled until the intended primary domain serves the actual product experience.

## Measurement Cadence

| Cadence | Owner question | Required action |
| --- | --- | --- |
| Daily | Did we receive a new high-intent lead, payment, or cancellation signal? | Respond to qualified leads, validate payment-webhook completion, and triage churn risk |
| Weekly | Which source, offer, and message created qualified pipeline? | Reallocate distribution effort, repair funnel drop-offs, and review content requests |
| Monthly | Did delivered value support retention and expansion? | Run customer health review, update offer proof, and remove unsupported marketing claims |

## References

[1]: https://developers.google.com/search/docs/appearance/structured-data/sd-policies "Google Search Central: General Structured Data Guidelines"
[2]: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics "Google Search Central: Understand JavaScript SEO Basics"
