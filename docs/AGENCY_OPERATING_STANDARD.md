# ARM Agency Operating Standard

**Purpose:** Define what “production-grade” means for ARM Agency before demand is scaled. This standard is an operating contract for the team, not a marketing claim.

## Production-Grade Definition

For ARM Agency, production-grade means that a qualified buyer can move from first contact to a clear commercial decision, receive a defined service with named ownership and acceptance criteria, access billing and support safely, and receive an orderly next-step or renewal path. The agency must be able to observe every important handoff, correct failures quickly, and protect sustainable employee workload while doing so.

> **Standard:** No offer is considered ready merely because it has a price card or checkout button. It is ready when the client-facing promise, internal delivery process, operational controls, and post-delivery next step agree.

## End-to-End Lifecycle Standard

| Lifecycle stage | Required capability | Evidence of readiness | Accountable role |
| --- | --- | --- | --- |
| Discover | A buyer can understand the relevant problem, service boundary, and appropriate starting point. | Public page, FAQ, evidence asset, and CTA match the actual service. | Growth owner |
| Qualify | The team can decide whether to proceed without guessing at fit, authority, urgency, scope, or delivery risk. | Qualification rubric, discovery record, explicit advance/no-go decision. | Sales owner |
| Scope | The buyer receives a specific commercial proposal rather than a vague promise. | Scope, assumptions, exclusions, milestones, acceptance criteria, price, and change control. | Delivery owner |
| Collect | Payment and purchase details are processed safely and reconciled. | Stripe record, receipt, webhook completion, appropriate portal access, and owner confirmation. | Operations owner |
| Onboard | The client knows the first milestone, decision owners, needed access, and communication cadence. | Welcome message, kickoff agenda, owner register, access checklist, and delivery plan. | Client-success owner |
| Deliver | Work progresses against the agreed boundary with visible decisions and risks. | Workplan, status update, decision log, acceptance record, and escalation path. | Delivery owner |
| Retain | The team understands delivery health before renewal or cancellation. | Account-health review, next-value plan, cancellation response, and renewal decision. | Client-success owner |
| Learn | The business changes its process based on evidence rather than anecdotes. | Funnel review, delivery retrospective, employee-health review, and documented decision log. | Agency owner |

## Minimum Controls by Workstream

| Workstream | Minimum control | Current baseline | Build target |
| --- | --- | --- | --- |
| Offers | Written service boundary and delivery proof | Product catalog and clear high-touch qualification path exist | Productized kits for the three bounded offers; scope cards for each recurring stream |
| Sales | Consistent qualification and proposal process | Lead capture and CRM status updates exist | Scorecard, discovery guide, proposal/SOW modules, handoff checklist |
| Marketing | Evidence-safe authority and conversion assets | SSR, FAQ, structured data, and basic offer copy exist | One proof asset and one conversion asset per stream; controlled distribution cadence |
| Payments | Secure collection and reconciliation | Stripe Checkout, verified webhook, receipt, thank-you route, and portal exist | Daily reconciliation routine and incident checklist |
| Client success | Onboarding and delivery governance | Portal and cancellation flow exist | Kickoff, weekly status, customer-health, renewal, and referral playbooks |
| Security | Server-side authorization and customer-data boundaries | Admin gate, protected billing lookup, portal ownership checks, and tests exist | Quarterly access review and payment/webhook incident procedure |
| Team health | Sustainable workload and delivery feedback loop | Employee-satisfaction module exists | Capacity policy, review cadence, escalation route, and workload decision rule |
| Operations | A clear owner response to operational signals | Dashboard and weekly report exist | Daily triage, weekly growth review, monthly health review, decision log |

## Quality Gates

An offer, process, or launch activity must pass all applicable gates before it is called ready.

| Gate | Passing condition | Failing condition |
| --- | --- | --- |
| Truth gate | Copy and sales materials state only deliverables, policies, or outcomes that can be supported. | Unsupported customer counts, performance figures, guarantees, reviews, or case-study outcomes. |
| Scope gate | The client can see what is included, excluded, assumed, and accepted. | Work begins with ambiguous “custom” expectations or unclear decision rights. |
| Security gate | Server-side permission checks protect private customer, billing, and owner data. | A client-only hiding rule is the sole barrier to access. |
| Delivery gate | A named owner, milestone plan, and escalation route exist before kickoff. | Payment is accepted with no ready delivery path. |
| Capacity gate | The planned work fits agreed staff capacity and workload thresholds. | Urgency is used to override workload, quality, or rest needs. |
| Measurement gate | The team can tell whether the next action is working. | Metrics are collected without an owner decision or a defined response. |

## Operating Scorecard

The following scorecard is reviewed by the owner, but it is designed to create action rather than performative reporting.

| Area | Weekly question | Signal | Required action when off track |
| --- | --- | --- | --- |
| Qualified pipeline | Are new inquiries becoming clear next steps? | New, qualified, converted, and lost lead statuses | Tighten qualification or repair the CTA/message mismatch. |
| Revenue integrity | Do recorded payments, webhooks, portal access, and delivery handoffs agree? | Completed purchases and payment exceptions | Reconcile immediately; pause fulfillment if the record is unclear. |
| Delivery health | Does every active engagement have a named next milestone and unresolved-risk owner? | Status update and decision log | Escalate blockers; reduce scope or rebalance capacity if required. |
| Customer health | Is the client receiving the contracted value on the agreed cadence? | Health review and renewal risk | Create a recovery plan before proposing expansion. |
| Content authority | Is content creating qualified conversation, not only impressions? | Source, CTA, lead-quality, and discovery feedback | Stop low-quality topics; deepen material that informs sales decisions. |
| Team sustainability | Is workload sustainable and is feedback acted upon? | Satisfaction trend, workload indicators, handoff friction | Change capacity, expectations, or process before burnout becomes delivery risk. |
| Security and reliability | Has any access, payment, webhook, or data-boundary exception occurred? | Incident log and reconciliation review | Contain, document, test the fix, and review authorization boundaries. |

## Ownership Model

The same person may initially hold multiple roles, but each responsibility must still have one named owner. A role is a responsibility boundary, not necessarily a headcount commitment.

| Role | Core responsibility | Decision authority |
| --- | --- | --- |
| Agency owner | Commercial priorities, risk acceptance, pricing, capacity, and launch decisions | Approves scope, escalation, and operating changes. |
| Growth owner | Positioning, content, distribution, qualification-path conversion | Stops or continues acquisition experiments. |
| Sales owner | Qualification, discovery, commercial proposal, and handoff quality | Advances, nurtures, or disqualifies opportunities. |
| Delivery owner | Scoping feasibility, milestone execution, quality, and client outputs | Accepts delivery work and raises scope/capacity risks. |
| Client-success owner | Onboarding, communication cadence, health, renewal, and escalation | Initiates recovery and renewal plans. |
| Operations owner | Payments, reconciliation, CRM hygiene, reporting, and runbooks | Resolves workflow exceptions and documents incidents. |
| Technical owner | Security, portal integrity, checkout/webhook reliability, and observability | Blocks unsafe releases and coordinates remediation. |

## Immediate Standardization Work

The next implementation sequence is intentional. ARM Agency should first standardize its bounded entry offers, then standardize how it sells them, then make the customer experience repeatable. Content and distribution are amplified once the delivery and proof system is credible.

| Sequence | Build | Outcome |
| --- | --- | --- |
| 1 | AI Infrastructure Audit Delivery and Sales Kit | A complete first paid engagement that reliably leads to a documented client decision. |
| 2 | Mandate Chain Design Workshop Kit | A facilitated design engagement with clear pre-work, decisions, and follow-through. |
| 3 | Custom MCP Tool Delivery Kit | A bounded technical implementation with specification, testing, handoff, and support boundaries. |
| 4 | Qualification and Proposal System | One consistent path from inquiry to a decision-ready scope. |
| 5 | Onboarding, Delivery, and Customer Health System | Every buyer receives a reliable first 30 days and escalation route. |
| 6 | Evidence-Safe Content and Distribution System | Marketing supports the actual operating model rather than promising beyond it. |

## Launch Constraint

The current account freeze affects the primary custom domain. It does not change these standards or prevent internal preparation, controlled demonstration on the working deployment, service-productization, sales enablement, or content drafting. Paid acquisition, primary-domain canonicalization, and broad SEO promotion remain on hold until the intended primary domain is restored and the launch checklist is revalidated.
