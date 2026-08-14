# ARM Agency Quality and Portfolio Governance

**Purpose:** Provide a durable decision system for long-term improvement. The agency should become more capable over time without accumulating unsupported claims, brittle features, hidden delivery risk, or unsustainable team load.

## 1. Quality-First Operating Principle

ARM Agency does not optimize for the number of shipped pages, features, offers, or campaigns. It optimizes for **useful, defensible, and repeatable client outcomes within stated delivery boundaries**. A change is valuable only when it improves a buyer decision, a client delivery step, an operational control, a security boundary, or a sustainable capacity condition.

> **Portfolio rule:** Every new initiative must improve an existing lifecycle stage or be explicitly deferred. New work does not enter delivery merely because it is interesting.

## 2. Change Intake Standard

Every proposed product, content, technical, operations, or marketing change receives a short intake record before implementation.

| Intake field | Required answer |
| --- | --- |
| Problem | What observable buyer, client, delivery, security, or team problem does this address? |
| Lifecycle stage | Discover, qualify, scope, collect, onboard, deliver, retain, or learn. |
| Evidence | What data, client feedback, operational signal, or validated judgment supports the need? |
| Intended user | Which buyer, client, operator, or owner benefits? |
| Proposed change | What will be built, changed, documented, or stopped? |
| Non-goals | What is deliberately outside the work? |
| Risk | What could go wrong commercially, operationally, technically, legally, or for team capacity? |
| Quality gate | What proves the change is accurate, safe, usable, and complete? |
| Owner | Who can make the decision and own the next action? |
| Review date | When will the team review the result and decide continue, repair, or retire? |

## 3. Prioritization Rubric

Score each proposed initiative from **1** to **5** in each dimension. The score informs judgment; it does not replace it.

| Dimension | 1 | 3 | 5 |
| --- | --- | --- | --- |
| Client value | Indirect or speculative | Helps a known client step | Resolves a recurring, material client decision or risk |
| Revenue integrity | Cosmetic commercial impact | Improves a conversion or handoff step | Protects collection, delivery readiness, renewal, or repeatability |
| Evidence strength | Assumption only | Mixed signal or informed hypothesis | Repeated signal, verified defect, or clear operating need |
| Risk reduction | Low consequence | Reduces a manageable process issue | Closes a material security, payment, scope, or capacity risk |
| Reusability | One-off | Useful to one stream or team | Reusable across multiple offers, clients, or lifecycle stages |
| Effort/capacity | Large or disruptive | Moderate effort | Small, bounded, and fits committed capacity |

| Priority band | Rule | Treatment |
| --- | --- | --- |
| P0 | Material security, payment, client-data, delivery, or capacity risk | Contain and correct before new acquisition or expansion work. |
| P1 | Strong evidence of recurring client/revenue/quality improvement | Schedule in the current operating cycle with named owner and quality gate. |
| P2 | Valuable but dependent on evidence, capacity, or a prerequisite | Keep in backlog with a validation action rather than premature build. |
| P3 | Interesting but weakly connected to an active lifecycle need | Archive or revisit only when evidence changes. |

## 4. Definitions of Done

No asset should be marked complete solely because it exists. Completion depends on the asset type.

| Asset type | Definition of done |
| --- | --- |
| Public content | Buyer decision is clear; claims are sourced or scoped; CTA is proportionate; metadata and links work; an owner reviews response quality. |
| Offer or service | Delivery boundary, client inputs, exclusions, acceptance criteria, owner, capacity, and next step are documented. |
| Sales asset | Qualification or proposal language matches actual delivery; commercial boundaries and handoff fields are explicit. |
| Software feature | Data model, authorization, loading/error states, tests, type check, and production build pass; release/rollback path is known. |
| Scheduled process | Trigger, owner, idempotency, failure response, and review action are documented; production deployment requirement is satisfied. |
| Security control | Threat or boundary is stated; server-side enforcement exists where required; regression test or review procedure is included. |
| Client-success process | Client message, owner, timing, escalation rule, and health/quality signal are defined. |
| Team-sustainability control | Capacity implication is visible; team can surface risk; a decision owner can change workload or scope. |

## 5. Review Cadence

| Cadence | Forum | Required output |
| --- | --- | --- |
| Daily | Operational triage | Owner and next action for material lead, payment, delivery, support, or security signal. |
| Weekly | Portfolio review | One continue/repair/stop decision per active workstream; updated operating decision log. |
| Monthly | Quality and client-health review | Review service quality, claims, delivery capacity, retention risk, and employee health. |
| Quarterly | Strategic portfolio review | Retire stale offers/content, confirm access roles, review roadmap assumptions, and update improvement priorities. |
| Before launch/campaign | Controlled release review | Domain, offer, content, payment, support, capacity, and rollback gates pass. |

## 6. Guardrails for Long-Term Quality

1. **Evidence before amplification.** Do not scale a message, campaign, or offer before the delivery boundary and evidence are ready.
2. **Depth before breadth.** Improve the smallest number of offers and client paths necessary to learn reliably before adding more.
3. **One source of truth.** Keep delivery playbooks, sales scopes, website copy, structured data, and client communications aligned.
4. **Human accountability remains explicit.** No automation, dashboard, or AI-generated output replaces the named owner for a material client or business decision.
5. **Capacity is a quality constraint.** If the team cannot deliver the existing promise sustainably, pause expansion rather than dilute the promise.
6. **Retire as well as create.** Remove outdated guides, unsupported claims, stale offers, unused metrics, and confusing process steps.

## 7. Long-Term Backlog Themes

| Theme | Examples of quality-first work |
| --- | --- |
| Delivery maturity | More detailed service templates, client portals for delivery artifacts, acceptance tracking, and scoped change-control workflow. |
| Commercial learning | Lost-reason analysis, account plans, partner fit criteria, proposal library, and price/scope learning based on actual delivery. |
| Authority | Periodically refreshed guide series, source review, buyer-question research, and reusable sales education. |
| Client success | Health scoring based on real delivery signals, onboarding improvements, renewal preparation, and respectful cancellation learning. |
| Operations | Exception handling, reconciliation automation, decision-log review, safer observability, and provider dependency review. |
| Team sustainability | Capacity planning, handoff simplification, workload reviews, learning time, and recovery after intensive delivery periods. |
| Controlled growth | Incremental distribution experiments, source quality review, and acquisition scaling only after operational gates pass. |

## 8. Portfolio Decision Log Prompt

At each weekly review, the owner should be able to answer: **What is the single highest-quality next improvement, why now, what evidence supports it, who owns it, how will we know it helped, and what work will we not do this week to protect quality?**
