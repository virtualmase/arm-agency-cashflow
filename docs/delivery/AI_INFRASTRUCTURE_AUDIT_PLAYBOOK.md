# AI Infrastructure Audit — Delivery Playbook

**Commercial reference:** $2,500 fixed-fee bounded diagnostic  
**Primary purpose:** Help an accountable buyer understand the current AI operating state, identify material constraints and risks, and select a practical next decision.  
**This is not:** A security certification, legal opinion, guarantee of business outcome, production deployment, or open-ended architecture engagement.

## 1. Client-Facing Scope

The audit produces a concise, decision-ready assessment of the buyer’s current AI workflows, operating constraints, decision rights, data and integration boundaries, observability needs, and prioritized next actions. The deliverable is intended to help a sponsor decide what to fix, design, defer, or validate next.

| Included | Excluded unless separately scoped |
| --- | --- |
| One intake review and one working session | Source-code remediation or production deployment |
| Review of client-provided process, architecture, or policy material | Penetration testing, compliance certification, or legal advice |
| Current-state map and constraint analysis | Unlimited stakeholder interviews or discovery cycles |
| Prioritized risk/opportunity register | Guarantees of cost savings, throughput, uptime, or commercial return |
| Recommended next-step sequence | Ongoing managed operations or implementation work |
| Executive readout and question period | Procurement, data-processing, or security-contract negotiation |

## 2. Entry Criteria

The engagement begins only after a named buyer owner confirms the decision the audit needs to inform. The client supplies the requested information at least two business days before the working session, or the schedule is reset rather than compressing the analysis.

| Required input | Minimum useful form | Why it matters |
| --- | --- | --- |
| Business decision | A one-paragraph statement describing the decision, urgency, and sponsor | Prevents a generic technical review with no commercial use. |
| Workflow overview | Diagram, written sequence, or live walkthrough | Shows where human and AI work actually meet. |
| System context | Tool list, integrations, environments, and relevant policies | Establishes the boundary of the review. |
| Stakeholder map | Sponsor, operator, technical owner, security/privacy contact | Makes decision rights visible early. |
| Known constraints | Budget, timeline, data boundaries, security concerns, vendor restrictions | Turns recommendations into something implementable. |

## 3. Delivery Sequence

| Step | Timing | Owner | Output |
| --- | --- | --- | --- |
| Confirm scope | Day 0 | Sales and delivery owner | Signed scope note, buyer decision, named contacts. |
| Send intake | Day 0 | Client-success owner | Secure evidence request and working-session invitation. |
| Review materials | Days 1–2 | Delivery owner | Initial questions, assumptions register, session plan. |
| Facilitate working session | Day 3 | Delivery owner | Current-state map, decisions, unresolved questions. |
| Analyze and prioritize | Days 4–5 | Delivery owner | Risk/opportunity register and recommended sequence. |
| Deliver executive readout | Day 6 | Delivery owner and sponsor | Findings, options, owner actions, and stated next decision. |
| Close or expand | Day 7 | Sales owner | Completion confirmation and, only if relevant, bounded next-step proposal. |

## 4. Working-Session Agenda

| Segment | Time | Objective |
| --- | --- | --- |
| Sponsor decision and success boundary | 10 minutes | Confirm what the buyer must be able to decide after the audit. |
| Current workflow walkthrough | 20 minutes | Identify handoffs, actors, information, and system dependencies. |
| Decision rights and accountability | 15 minutes | Identify who approves, operates, escalates, and owns risk. |
| Technical and data constraints | 20 minutes | Review integration, data, security, observability, and operational boundaries. |
| Failure modes and risks | 15 minutes | Identify visible failure scenarios and current safeguards. |
| Next-decision framing | 10 minutes | Confirm questions that the written assessment must answer. |

## 5. Client Deliverable Structure

The written audit should be brief enough to be used by a sponsor and concrete enough to guide the technical owner. It should state uncertainty instead of filling gaps with assumptions.

1. **Executive decision summary:** What decision this audit informs, the current-state conclusion, and the recommended next action.
2. **Operating context:** Buyer goal, workflow boundary, stakeholders, and material constraints.
3. **Current-state map:** Systems, handoffs, decision rights, and observable dependencies.
4. **Findings register:** Each finding has an observed condition, consequence, confidence level, and evidence source.
5. **Prioritized actions:** A short sequence divided into “stabilize,” “design,” and “consider later.”
6. **Open questions and assumptions:** Items that require client validation before implementation.
7. **Suggested next step:** A workshop, implementation scope, or internal action plan—only where the audit evidence supports it.

## 6. Acceptance Criteria

The audit is complete when the client has received the agreed report and executive readout, and when the following conditions are met.

| Acceptance criterion | Evidence |
| --- | --- |
| The stated buyer decision is addressed | Executive summary ties each recommendation to the decision. |
| Current state and constraints are represented accurately | Client confirms factual corrections within the agreed review window. |
| Findings distinguish evidence, assumptions, and open questions | Findings register contains source/confidence fields. |
| Recommendations are prioritized and bounded | Each action has an owner type, dependency, and practical next milestone. |
| Delivery boundary is respected | No implementation, certification, or unsupported guarantee is represented as delivered. |

## 7. Internal Quality Checklist

Before delivery, the delivery owner confirms that the report avoids unsupported claims, includes no client-confidential detail outside the agreed audience, states limitations plainly, and has a clear escalation path for security, legal, or procurement questions. The client-success owner confirms the follow-up email, invoice status, portal access where applicable, and next-contact date.

## 8. Handoff and Expansion Rules

The audit may lead to a Mandate Chain Design Workshop, a Custom MCP Tool scope, or an ARM implementation proposal. Expansion is appropriate only if the buyer has a named owner, a defined decision, and a fit with the observed findings. If these conditions are not met, the correct outcome is a documented client action plan and a respectful close.

---

### Client Email: Audit Kickoff

> Subject: Preparing for your AI Infrastructure Audit
>
> Thank you for selecting the AI Infrastructure Audit. Our objective is to help your team make a clear next decision about the current workflow, constraints, risks, and practical options. Before the session, please provide the materials listed in the intake request and name the sponsor, operational owner, and technical contact. We will use the working session to validate the current state, then deliver a concise assessment and executive readout. The audit does not include production implementation or certification; any follow-on work will be scoped separately and only if useful.

