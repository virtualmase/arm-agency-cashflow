import { Link, useRoute } from "wouter";

type Source = { label: string; href: string };

type Insight = {
  stream: string;
  eyebrow: string;
  title: string;
  description: string;
  decision: string;
  sections: Array<{ title: string; body: string; citations?: Source[] }>;
  checklist: string[];
  deliverables: string[];
  cta: string;
  ctaHref: string;
  sources?: Source[];
  related?: Array<{ slug?: string; label: string; description?: string; href?: string }>;
  rubric?: Array<{ dimension: string; zero: string; one: string; two: string }>;
  image?: { src: string; alt: string; width: number; height: number; caption: string };
};

export const insights: Record<string, Insight> = {
  "agentic-commerce-infrastructure": {
    stream: "ARM Agency · Agent operations",
    eyebrow: "Pillar guide · x402 and AiFi",
    title: "Agentic commerce infrastructure: from x402 payment to governed AiFi operation",
    description: "The legacy ARM operating branch's implementation framework for teams preparing agents to buy APIs, data, tools, or services without confusing payment transport with financial authority.",
    decision: "Use this pillar when an agent may initiate a real economic action and the organization must connect payment protocol, wallet authority, budget policy, fulfillment, settlement, and audit evidence.",
    sections: [
      { title: "x402 is a payment transport, not a spending policy", body: "x402 standardizes how a client encounters a paid resource, receives payment requirements, returns signed authorization, and receives the resource after verification and settlement. The protocol does not decide which agent should be funded, which vendor is approved, or how much an agent may spend." },
      { title: "AiFi begins where autonomous action meets financial control", body: "AiFi is used here as a category label for AI-native financial operations: agents acting under delegated authority across wallets, budgets, payments, settlement, reconciliation, and compliance controls. The term is emerging and is also used by named companies and institutes, so every publication should define the intended meaning rather than imply one universal standard." },
      { title: "The operating chain must remain inspectable", body: "A production path should preserve the requester, mandate, policy decision, quoted resource, amount, asset, network, authorization, facilitator response, settlement reference, delivered result, and exception outcome. A transaction hash alone does not explain why the action was permitted or whether fulfillment met the mandate." },
      { title: "Bounded autonomy is the credible launch posture", body: "Begin with one resource type, one network, fixed or tightly bounded amounts, allowlisted counterparties, explicit timeouts, idempotent fulfillment, and human review above a defined threshold. Expand only after observed failure modes, reconciliation, and incident response are understood." },
    ],
    checklist: ["One paid agent job and its business owner are named.", "The payment scheme, network, asset, facilitator, and settlement evidence are understood.", "Wallet authority, per-call limits, aggregate budgets, and approval thresholds are enforced outside the model.", "Replay, duplicate fulfillment, timeout, refund, dispute, and failed-settlement behavior are testable.", "Finance and operations owners can reconcile payment intent, settlement, and delivered resource."],
    deliverables: ["Agentic commerce architecture and trust-boundary map", "x402 resource-server or client integration specification", "AiFi mandate, budget, and approval policy", "Settlement, fulfillment, and reconciliation evidence contract"],
    cta: "Scope an agentic commerce audit",
    ctaHref: "/#contact",
    related: [
      { label: "Understand the x402 payment flow", href: "/insights/x402-agent-payments" },
      { label: "Design AiFi controls", href: "/insights/aifi-governance-controls" },
      { label: "Use the readiness checklist", href: "/insights/agent-payment-readiness" },
    ],
    sources: [
      { label: "x402 Foundation: protocol specification v2", href: "https://github.com/x402-foundation/x402/blob/main/specs/x402-specification-v2.md" },
      { label: "Coinbase Developer Platform: how x402 works", href: "https://docs.cdp.coinbase.com/x402/core-concepts/how-it-works" },
      { label: "IMF: How Agentic AI Will Reshape Payments", href: "https://www.imf.org/en/publications/imf-notes/issues/2026/04/22/how-agentic-ai-will-reshape-payments-575560" },
    ],
  },
  "x402-agent-payments": {
    stream: "Agentic commerce infrastructure",
    eyebrow: "Protocol guide · x402",
    title: "x402 agent payments: what the protocol handles—and what your operation still owns",
    description: "A plain operating guide to HTTP 402 payment requirements, signed authorization, facilitator verification, settlement, and resource delivery.",
    decision: "Use this guide when deciding whether x402 is suitable for a paid API, MCP tool, data resource, or agent-to-agent service and what must exist around the protocol before production use.",
    sections: [
      { title: "The core exchange is request, requirement, payment, resource", body: "A client requests a protected resource. The resource server returns payment requirements. The client constructs a supported payment payload and retries. The server verifies and settles directly or through a facilitator, then returns the resource and settlement response." },
      { title: "Version and header details matter", body: "The current x402 v2 specification separates core types, scheme logic, and transport representation. For HTTP, payment requirements and signatures use defined headers and encoded schemas. Implement against the selected specification and SDK version rather than copying an older demonstration." },
      { title: "The facilitator reduces infrastructure, not accountability", body: "A facilitator can verify and settle supported scheme and network pairs. The resource server still owns accurate pricing, correct recipient configuration, authorization handling, fulfillment idempotency, error behavior, logs, and the decision to release the protected resource." },
      { title: "Security is larger than signature validity", body: "Nonce and time-window controls address replay at the payment layer. Production design must also consider compromised agent credentials, prompt-driven spend, duplicate requests, vendor substitution, denial of service, stale quotes, reconciliation gaps, and unsafe retry behavior." },
    ],
    checklist: ["The protected resource and price are explicit.", "The client, resource server, facilitator, scheme, network, asset, and recipient are identified.", "Retries cannot create duplicate charges or duplicate fulfillment.", "Payment failure and settlement uncertainty fail safely.", "Secrets and wallet signing authority remain outside prompts and browser-visible code."],
    deliverables: ["x402 integration decision record", "Payment and fulfillment sequence diagram", "Error, retry, and idempotency test plan", "Settlement evidence and operational handoff"],
    cta: "Review an x402 implementation",
    ctaHref: "/#contact",
    related: [{ label: "Return to the agentic commerce pillar", href: "/insights/agentic-commerce-infrastructure" }, { label: "Add AiFi governance", href: "/insights/aifi-governance-controls" }],
    sources: [
      { label: "x402 Foundation: protocol specification v2", href: "https://github.com/x402-foundation/x402/blob/main/specs/x402-specification-v2.md" },
      { label: "Coinbase Developer Platform: quickstart for sellers", href: "https://docs.cdp.coinbase.com/x402/quickstart-for-sellers" },
      { label: "Cloudflare: x402 Foundation and agent payment support", href: "https://blog.cloudflare.com/x402/" },
    ],
  },
  "aifi-governance-controls": {
    stream: "Agentic commerce infrastructure",
    eyebrow: "Operating guide · AiFi",
    title: "AiFi governance: the controls required before an AI agent can spend",
    description: "A bounded-autonomy model for wallets, mandates, budgets, counterparties, approvals, settlement, and financial evidence.",
    decision: "Use this guide when a team is moving from an agent that recommends a transaction to one that can authorize, initiate, or complete a financial action.",
    sections: [
      { title: "Define AiFi before using the label", body: "AiFi can refer broadly to AI-native finance, agentic finance, or a particular company or institute. ARM Agency uses it here for the operating layer that governs delegated financial actions by software agents. This is a category definition, not a claim of affiliation with AiFi-branded organizations." },
      { title: "Authority must be machine-enforced", body: "A system prompt is not a financial control. Allowed assets, networks, recipients, tools, per-action limits, time windows, aggregate budgets, and escalation thresholds should be enforced by deterministic policy and signing infrastructure outside the model." },
      { title: "Separate intent, authorization, execution, and settlement", body: "The record should distinguish what the user or system requested, what the policy engine approved, what the agent attempted, what the payment rail executed, and what ultimately settled. Keeping these states separate supports investigation, reconciliation, and safe recovery." },
      { title: "Design for exception ownership", body: "Named owners need procedures for insufficient funds, invalid signatures, price changes, compromised credentials, duplicate charges, partial fulfillment, refunds, disputes, sanctions or compliance flags, and facilitator or chain outages." },
    ],
    checklist: ["A legal or accountable principal delegates a bounded mandate.", "Policy and signing controls are independent of model output.", "Counterparties and resources can be allowlisted or risk-classified.", "Every action produces an immutable correlation and evidence trail.", "Finance, security, and operations owners agree on exception handling."],
    deliverables: ["AiFi authority and mandate model", "Wallet and budget control matrix", "Financial-action state machine", "Audit, reconciliation, and incident-response requirements"],
    cta: "Design bounded financial autonomy",
    ctaHref: "/#contact",
    related: [{ label: "Return to the agentic commerce pillar", href: "/insights/agentic-commerce-infrastructure" }, { label: "Review x402 mechanics", href: "/insights/x402-agent-payments" }],
    sources: [
      { label: "IMF: How Agentic AI Will Reshape Payments", href: "https://www.imf.org/en/publications/imf-notes/issues/2026/04/22/how-agentic-ai-will-reshape-payments-575560" },
      { label: "Visa: Agentic payments from the ground up", href: "https://www.visa.com/en-us/thought-leadership/innovation/agentic-payments-from-the-ground-up" },
      { label: "x402 v2: security considerations", href: "https://github.com/x402-foundation/x402/blob/main/specs/x402-specification-v2.md#10-security-considerations" },
    ],
  },
  "agent-payment-readiness": {
    stream: "Agentic commerce infrastructure",
    eyebrow: "Decision tool · Production gate",
    title: "Agent payment readiness: a production gate for x402 and AiFi systems",
    description: "A scored go, sandbox, or bounded-pilot instrument for teams deciding whether an agent should receive real payment authority.",
    decision: "Score each control dimension from 0 to 2 before funding a wallet, enabling a paid resource, or letting an agent cross from recommendation into financial execution. Any critical stop condition overrides the total.",
    sections: [
      { title: "Go only when the job is bounded", body: "The agent should have a named principal, defined resource class, approved counterparties, deterministic limits, known data boundary, and testable success condition. Broad purchasing authority is not a minimum viable pilot." },
      { title: "Pilot when the protocol works but operations are unproven", body: "Testnet, sandbox, or tightly capped production pilots are appropriate when payment formation and settlement work but reconciliation, exception ownership, vendor quality, or fulfillment evidence still need observation." },
      { title: "Stop when authority is implicit", body: "Do not proceed when the model chooses wallets, recipients, networks, assets, or budgets without independent controls; when secrets enter prompts; when fulfillment is not idempotent; or when no owner can freeze spending and investigate." },
      { title: "Expand from evidence, not novelty", body: "Higher limits, more counterparties, dynamic pricing, and broader autonomy should follow documented transaction history, failure review, reconciliation accuracy, and owner approval—not protocol popularity or social attention." },
      { title: "Interpret the score conservatively", body: "A total of 0–4 means stop and establish fundamentals. A total of 5–7 supports simulation or testnet work only. A total of 8–10 may support a tightly capped pilot after owner review. Stop regardless of score if raw signing keys reach the model, authority has no expiry or revocation, recipients can change without policy, fulfillment cannot be correlated to payment, or no owner can freeze and investigate." },
    ],
    rubric: [
      { dimension: "Mandate and accountability", zero: "No named principal, scope, expiry, or revocation owner.", one: "Mandate is documented but not enforced or exercised.", two: "Mandate is enforced, expiring, revocable, and tested." },
      { dimension: "Agent identity and signing", zero: "Identity is implicit or signing material is exposed to model context.", one: "Keys are separated, but identity, rotation, or request binding is incomplete.", two: "Identity, custody, request binding, freshness, rotation, and revocation are tested." },
      { dimension: "Payment policy", zero: "The model can select unrestricted assets, networks, recipients, or amounts.", one: "Some limits exist but aggregate budget or counterparty policy is manual.", two: "Resource, recipient, asset, network, amount, velocity, and aggregate budget are deterministic." },
      { dimension: "Settlement and fulfillment", zero: "A transaction reference is treated as proof of delivery.", one: "Settlement and delivery are logged but retries or correlation remain weak.", two: "Intent, authorization, settlement, fulfillment, idempotency, and reconciliation are correlated." },
      { dimension: "Exceptions and evidence", zero: "No freeze owner, incident path, or durable evidence record.", one: "Procedures exist but have not been exercised across failure modes.", two: "Replay, timeout, compromise, duplicate, partial fulfillment, refund, and outage paths are tested." },
    ],
    checklist: ["Mandate owner and wallet owner are named.", "Spend limits and approved resources are enforced outside the model.", "Test cases cover success, replay, timeout, duplicate request, settlement failure, and partial fulfillment.", "Monitoring can freeze the agent without waiting for model cooperation.", "A reviewer can trace each resource to intent, authorization, payment, settlement, and result."],
    deliverables: ["Go/pilot/stop readiness assessment", "Control and evidence gap register", "Bounded pilot specification", "Expansion criteria and human approval gate"],
    cta: "Run an agent-payment readiness review",
    ctaHref: "/#contact",
    image: { src: "/manus-storage/agent-payment-readiness-five-gates_77b5971d.png", alt: "A bounded illuminated path crosses five architectural verification gates before reaching a protected resource.", width: 1672, height: 941, caption: "Conceptual illustration of the five readiness dimensions. It is not a transaction record or evidence of a deployed payment system." },
    related: [{ label: "Return to the agentic commerce pillar", href: "/insights/agentic-commerce-infrastructure" }, { label: "Understand x402", href: "/insights/x402-agent-payments" }, { label: "Design AiFi controls", href: "/insights/aifi-governance-controls" }],
    sources: [
      { label: "Coinbase Developer Platform: x402 client and server roles", href: "https://docs.cdp.coinbase.com/x402/core-concepts/client-server" },
      { label: "x402 Foundation: protocol specification v2", href: "https://github.com/x402-foundation/x402/blob/main/specs/x402-specification-v2.md" },
      { label: "IMF: How Agentic AI Will Reshape Payments", href: "https://www.imf.org/en/publications/imf-notes/issues/2026/04/22/how-agentic-ai-will-reshape-payments-575560" },
      { label: "NIST NCCoE: software and AI agent identity and authorization", href: "https://www.nist.gov/news-events/news/2026/02/new-concept-paper-identity-and-authority-software-agents" },
      { label: "Visa: Trusted Agent Protocol specifications", href: "https://developer.visa.com/capabilities/trusted-agent-protocol/trusted-agent-protocol-specifications/" },
    ],
  },
  "ai-infrastructure-audit": {
    stream: "ARM Mandate",
    eyebrow: "Decision guide · bounded diagnostic",
    title: "What an AI Infrastructure Audit actually examines",
    description: "A practical guide for teams that need to clarify an AI workflow, its constraints, decision owners, and the next responsible action before committing to implementation.",
    decision: "Use this guide when the question is not simply whether to use AI, but what should be assessed before a team funds, governs, or changes an AI-enabled workflow.",
    sections: [
      { title: "Start with the decision, not the tool", body: "A useful audit begins by naming the decision a sponsor must make. That could be whether to proceed with a pilot, where human approval belongs, which workflow should be stabilized first, or what evidence is needed before a larger implementation is justified." },
      { title: "Map the operating reality", body: "The review looks at the current workflow, the people and systems involved, information boundaries, exceptions, dependencies, and existing controls. The purpose is not to produce an abstract architecture diagram; it is to show where an operating decision is unclear or unsupported." },
      { title: "Separate findings from assumptions", body: "A credible assessment distinguishes what was observed in supplied material or discussion from what needs validation. Open questions remain open until a responsible client owner confirms them." },
      { title: "Leave with a bounded next action", body: "The output should help the sponsor decide whether to stabilize an existing workflow, run a decision-rights workshop, commission a specific implementation, or defer work until a dependency is resolved." },
    ],
    checklist: ["The sponsor can name the decision the audit must inform.", "An operational owner and technical owner can explain the current workflow.", "Known data, security, procurement, and timing constraints are visible.", "The team can provide relevant process or system material before the working session."],
    deliverables: ["Current-state workflow and constraint map", "Evidence-aware findings register", "Prioritized action sequence", "Executive readout and decision record"],
    cta: "Start with a diagnostic",
    ctaHref: "/#contact",
  },
  "geo-readiness": {
    stream: "Swell GEO",
    eyebrow: "Decision guide · AI-search visibility",
    title: "GEO readiness: the entity, content, and measurement questions to answer first",
    description: "A grounded starting point for teams evaluating generative-engine optimization without confusing content production, technical implementation, and visibility claims.",
    decision: "Use this guide when a marketing or growth leader needs to decide whether a GEO operating engagement is appropriate and what should be clarified before setting a recurring content cadence.",
    sections: [
      { title: "Clarify the entity before increasing output", body: "Machine-readable visibility starts with a clear understanding of the organization, services, leaders, products, relationships, and source material that can be stated accurately. More pages do not compensate for ambiguous fundamentals." },
      { title: "Publish decision-grade information", body: "Useful authority content answers concrete buyer questions: what is included, how an engagement works, which constraints apply, and what evidence supports the description. It does not use unverifiable outcome language as a substitute for clarity." },
      { title: "Treat measurement as a review discipline", body: "A reporting cadence should describe the public surface, requested content, technical findings, and observed discovery signals. It should not promise control over third-party models, search systems, rankings, or commercial outcomes." },
      { title: "Set the governance rhythm", body: "A recurring engagement works best when the client can approve claims, supply source material, identify decision owners, and review content priorities on an agreed cadence." },
    ],
    checklist: ["Service descriptions and organizational facts can be verified internally.", "A subject-matter owner can review material claims.", "The team has a clear buyer audience and decision topics.", "Technical access or implementation responsibility is understood."],
    deliverables: ["Entity and public-surface assessment", "Prioritized authority-content plan", "Technical discovery findings", "Defined review and reporting cadence"],
    cta: "Discuss GEO readiness",
    ctaHref: "/#contact",
  },
  "network-participation": {
    stream: "Arctura Network",
    eyebrow: "Decision guide · network membership",
    title: "Network participation without vague membership language",
    description: "A decision framework for teams and operators considering a network relationship and needing clarity about participation, collaboration, decision rights, and boundaries.",
    decision: "Use this guide when the relevant question is whether a network participation model is useful for a specific operating objective—not simply whether access sounds attractive.",
    sections: [
      { title: "Begin with a participation purpose", body: "The participant should be able to name the collaboration, learning, distribution, or operating objective that network participation is meant to support. If the objective is undefined, membership terms cannot be evaluated meaningfully." },
      { title: "Make rights and responsibilities explicit", body: "A credible membership model identifies what a participant can access, contribute to, request, or represent—and what remains outside the relationship. Shared language is not a substitute for clear accountability." },
      { title: "Define the contribution model", body: "Network value is more durable when expectations for meetings, collaboration, referrals, confidentiality, operating participation, and review are stated rather than implied." },
      { title: "Decide whether the timing fits", body: "Participation is appropriate when the organization can commit a responsible owner, use the relationship for a defined purpose, and accept the stated operating boundary." },
    ],
    checklist: ["A named operator owns the participation decision.", "The organization has a clear reason to participate now.", "Expected collaboration and contribution boundaries can be reviewed.", "The buyer understands that eligibility and terms may apply."],
    deliverables: ["Eligibility and fit conversation", "Participation-boundary review", "Named next step or respectful no-go decision", "Documented ownership and expectations"],
    cta: "Discuss eligibility",
    ctaHref: "/#contact",
  },
  "operator-learning-path": {
    stream: "Academy",
    eyebrow: "Decision guide · operator education",
    title: "When operator education is the better first step than outsourcing",
    description: "A guide for agency owners and operators who need to decide whether learning, a cohort, implementation support, or a diagnostic is the most sensible next investment.",
    decision: "Use this guide when the team wants to develop implementation capability but needs to be realistic about starting knowledge, available time, and the work that follows education.",
    sections: [
      { title: "Education is useful when the team must own the work", body: "Training is a strong first step when operators will need to understand, execute, review, or communicate the work after a course ends. It is not a substitute for capacity, accountable ownership, or required technical access." },
      { title: "Match the program to the working context", body: "A useful curriculum tells learners what they will practice, what prerequisites matter, which materials are included, and where implementation responsibility remains with the learner or their organization." },
      { title: "Plan the work after the lesson", body: "The value of education increases when a learner has an actual workflow, client, or internal project where the concepts can be applied safely. A next-project plan should be part of enrollment readiness." },
      { title: "Know when support is a better fit", body: "If a buyer needs a decision, implementation, or high-stakes review on a fixed timeline, a diagnostic or scoped delivery engagement may be more appropriate than education alone." },
    ],
    checklist: ["A learner has the time and authority to apply the curriculum.", "The organization can name a near-term practice project.", "Prerequisite knowledge and support expectations are clear.", "The buyer can distinguish training from implementation services."],
    deliverables: ["Stated curriculum and access terms", "Templates and practical exercises where included", "Defined learner support boundary", "Clear next-step options after completion"],
    cta: "Explore Academy offers",
    ctaHref: "/#pricing",
    related: [
      { slug: "ai-mastery-foundations", label: "AI Mastery Foundations", description: "Define the operating capability, ownership, evaluation, and oversight conditions behind useful learning." },
      { slug: "ai-mastery-practice-boundaries", label: "AI Mastery Practice Boundaries", description: "Decide how a real practice project remains bounded before it becomes a production request." },
      { slug: "ai-infrastructure-audit", label: "AI Infrastructure Audit", description: "Use a diagnostic when a workflow decision or high-stakes review needs more than education." },
    ],
  },
  "ai-mastery-foundations": {
    stream: "Academy",
    eyebrow: "Capability guide · accountable AI practice",
    title: "AI Mastery foundations: build an operating capability, not a prompt collection",
    description: "A decision guide for operators and leaders who need a practical, human-accountable way to understand, evaluate, govern, and practice with AI before calling a team AI-ready.",
    decision: "Use this guide when the team must decide what internal AI capability means in its own context and whether learning, a diagnostic, or scoped delivery is the responsible next step.",
    sections: [
      { title: "Treat capability as a work context, not a badge", body: "A team gains useful capability when it can apply knowledge to a real workflow, name the operator and decision owner, evaluate outputs, and escalate uncertainty. Completing material or collecting prompts alone does not establish operational readiness.", citations: [{ label: "OECD.AI: A socio-technical approach to AI literacy", href: "https://oecd.ai/en/wonk/socio-technical-approach-ai-literacy" }] },
      { title: "Build four connected capabilities", body: "A practical learning path combines an understanding of the tool and its limits, critical evaluation of outputs, responsible-use conditions such as privacy and security, and human oversight that preserves agency and accountability. The relative depth depends on the workflow and its risk context.", citations: [{ label: "OECD.AI: A socio-technical approach to AI literacy", href: "https://oecd.ai/en/wonk/socio-technical-approach-ai-literacy" }, { label: "NIST: AI Risk Management Framework", href: "https://www.nist.gov/itl/ai-risk-management-framework" }] },
      { title: "Name the owner, purpose, and escalation path", body: "Before a learner applies AI to a meaningful workflow, clarify the intended use, what information is permitted, who reviews the output, what must not be delegated, and when work should be escalated. ARM recommends this as an operating discipline; it is not a substitute for legal, security, privacy, or procurement review.", citations: [{ label: "NIST AI RMF Playbook: Govern", href: "https://airc.nist.gov/airmf-resources/playbook/govern/" }] },
      { title: "Choose education, diagnostic, or implementation honestly", body: "Education is usually appropriate when the operator has time, authority, and a safe practice context. A diagnostic fits when the decision, workflow, constraints, or risk boundary is unclear. A bounded implementation fits only after a specific job, system boundary, acceptance test, and handoff responsibility are defined." },
    ],
    checklist: ["A learner or team has a real workflow or practice project rather than only a general interest.", "The intended use, approved information boundary, and human reviewer are named.", "The team can explain what an output means, how it will be checked, and when it must be escalated.", "The buyer can distinguish education, a diagnostic, and scoped implementation without treating any one as a guarantee."],
    deliverables: ["AI capability and practice-context map", "Named owner, review, and escalation prompts", "Learning-to-workflow application plan", "Qualified recommendation: Academy, diagnostic, bounded implementation, or no-go"],
    cta: "Explore an AI Mastery learning path",
    ctaHref: "/#pricing",
    sources: [
      { label: "NIST: AI Risk Management Framework", href: "https://www.nist.gov/itl/ai-risk-management-framework" },
      { label: "NIST AI RMF Playbook: Govern", href: "https://airc.nist.gov/airmf-resources/playbook/govern/" },
      { label: "OECD.AI: A socio-technical approach to AI literacy", href: "https://oecd.ai/en/wonk/socio-technical-approach-ai-literacy" },
    ],
    related: [
      { slug: "operator-learning-path", label: "Operator Learning Path", description: "Decide whether education is the sensible first investment for the work that follows." },
      { slug: "ai-mastery-practice-boundaries", label: "AI Mastery Practice Boundaries", description: "Turn a learning goal into a bounded real-work practice plan." },
      { slug: "ai-infrastructure-audit", label: "AI Infrastructure Audit", description: "Use a diagnostic when the operating decision needs deeper assessment." },
    ],
  },
  "ai-mastery-practice-boundaries": {
    stream: "Academy",
    eyebrow: "Practice guide · human oversight",
    title: "AI Mastery practice boundaries: learn on real work without silently moving into production",
    description: "A practical guide to defining a safe learning boundary around a real workflow, including purpose, permitted information, human review, evaluation, escalation, and the point where scoped delivery becomes necessary.",
    decision: "Use this guide when a learner or operator wants to apply AI to a real task and needs to decide what can be practiced, what requires review, and when a production or delivery decision should be escalated.",
    sections: [
      { title: "Start with one bounded user job", body: "Choose one workflow question, user role, input type, and expected output. A practice boundary makes learning observable and reviewable; it does not authorize an AI tool to take actions beyond the agreed task.", citations: [{ label: "NIST AI RMF Playbook: Govern", href: "https://airc.nist.gov/airmf-resources/playbook/govern/" }] },
      { title: "Separate practice from production authority", body: "A learner can explore an output, compare it with a source, or draft a recommendation without being authorized to deploy, send, purchase, alter a system of record, or make a high-impact decision. Human review should be designed around the actual consequence of the work, not assumed from the tool label.", citations: [{ label: "OECD.AI: A socio-technical approach to AI literacy", href: "https://oecd.ai/en/wonk/socio-technical-approach-ai-literacy" }] },
      { title: "Make evaluation visible", body: "Define a small set of checks before practice begins: accuracy against known material, missing assumptions, inappropriate disclosure, relevance to the user job, and whether the human reviewer can explain the final decision. Record exceptions so the practice improves rather than becoming invisible shadow work.", citations: [{ label: "NIST AI RMF Playbook: Govern", href: "https://airc.nist.gov/airmf-resources/playbook/govern/" }] },
      { title: "Escalate when the work becomes an operating system", body: "If the task needs integrations, privileged access, recurring automated actions, customer-facing outputs, or a formal acceptance test, it is no longer just a learning exercise. Move into a diagnostic or bounded implementation conversation with the relevant owners and controls." },
    ],
    checklist: ["One user job, intended use, and expected output are written down.", "Permitted and prohibited information are understood for the practice context.", "A human reviewer can assess the output before it affects another person or a system of record.", "The team knows which triggers require a diagnostic, technical review, or bounded implementation scope."],
    deliverables: ["Practice-boundary worksheet", "Human-review and escalation prompts", "Small evaluation checklist and exception log", "Decision path to Academy continuation, diagnostic, or scoped setup"],
    cta: "Discuss a bounded practice context",
    ctaHref: "/#contact",
    sources: [
      { label: "NIST: AI Risk Management Framework", href: "https://www.nist.gov/itl/ai-risk-management-framework" },
      { label: "NIST AI RMF Playbook: Govern", href: "https://airc.nist.gov/airmf-resources/playbook/govern/" },
      { label: "OECD.AI: A socio-technical approach to AI literacy", href: "https://oecd.ai/en/wonk/socio-technical-approach-ai-literacy" },
    ],
    related: [
      { slug: "ai-mastery-foundations", label: "AI Mastery Foundations", description: "Establish capability, ownership, evaluation, and oversight before choosing a practice project." },
      { slug: "bounded-agent-stack-setup", label: "Bounded Agent-Stack Setup", description: "Move to scoped delivery when a specified job needs systems, acceptance tests, and a handoff." },
      { slug: "ai-infrastructure-audit", label: "AI Infrastructure Audit", description: "Start with a diagnostic when the workflow boundary or decision itself remains unclear." },
    ],
  },
  "bounded-agent-stack-setup": {
    stream: "Coreweaver",
    eyebrow: "Decision guide · bounded implementation",
    title: "What a bounded agent-stack setup includes—and what it does not",
    description: "A practical way to evaluate a finite implementation offer without mistaking a defined technical handoff for an unlimited AI platform commitment.",
    decision: "Use this guide when a team wants a specific agent or MCP-enabled capability but needs a testable scope, clear data boundary, and explicit handoff before work begins.",
    sections: [
      { title: "A bounded build starts with one job", body: "The strongest implementation scopes name a user, a trigger, permitted actions, inputs, outputs, system boundary, and acceptance test. “Build us an agent” is a conversation starter, not a delivery specification." },
      { title: "Data and access boundaries come first", body: "The client and delivery team should agree on approved systems, least-privilege access, prohibited data, logging expectations, and safe failure behavior before implementation begins." },
      { title: "Acceptance is a test, not a feeling", body: "Before the build starts, the parties should define test cases, expected outputs, negative cases, environmental assumptions, and the person who can accept the work." },
      { title: "Handoff is part of delivery", body: "A useful setup includes documentation, known limitations, configuration or deployment notes, support boundaries, and an agreed process for new requests after acceptance." },
    ],
    checklist: ["One user job and one tool behavior are defined.", "Approved source systems and data fields are identified.", "A client technical owner can provide safe access or a sandbox.", "Acceptance cases and support boundary can be agreed before build."],
    deliverables: ["Written tool or integration specification", "Implementation in the agreed boundary", "Acceptance-test record", "Handoff documentation and support terms"],
    cta: "Scope a bounded setup",
    ctaHref: "/#contact",
  },
  "ai-discovery-readiness": {
    stream: "Cross-stream operating guide",
    eyebrow: "Evidence guide · AI discovery",
    title: "AI discovery readiness: improve the foundation, not the hype",
    description: "A fact-checked guide for teams that want to improve how their public information can be discovered without treating generative-search visibility as a guarantee.",
    decision: "Use this guide when deciding whether to invest in GEO or AI-discovery work. The useful question is which content, technical, measurement, and governance foundations can be improved—not whether anyone can promise an external model or search result.",
    sections: [
      { title: "Start with helpful, original information", body: "Google’s generative-search guidance emphasizes useful, reliable, people-first content and clear technical structure. A durable program gives buyers accurate answers about the service, its boundaries, the decisions it supports, and the source material behind material claims." },
      { title: "Treat structured data as accurate representation", body: "Structured data can support rich-result eligibility when it accurately represents visible page content. It should not be used to imply ratings, reviews, affiliations, or results that the page cannot substantiate, and it does not guarantee a search feature or generative-search inclusion." },
      { title: "Do not confuse optional files with ranking controls", body: "Machine-readable resources can be useful for systems that choose to use them. Google states that LLMS.txt and similar files do not help or harm Google Search visibility, so they should be maintained for a clear operational reason rather than marketed as a ranking mechanism." },
      { title: "Measure signals without inventing certainty", body: "Review crawlability, indexability, content quality, Search Console data when available, qualified conversations, and first-party conversion signals. Be cautious with tools or services that claim access to internal model or search metrics they cannot verify." },
    ],
    checklist: ["Public pages explain the actual offer, constraints, and next decision in language a buyer can use.", "Important pages are crawlable and have a clear canonical and indexing policy.", "Structured data reflects user-visible content and contains no fabricated reviews, ratings, or outcomes.", "Measurement distinguishes controllable site work from third-party search or model behavior."],
    deliverables: ["Evidence-aware public-surface and content review", "Prioritized technical and content foundation plan", "Claim-safety and structured-data review", "A defined measurement cadence with documented limits"],
    cta: "Review AI-discovery readiness",
    ctaHref: "/#contact",
    sources: [
      { label: "Google: Optimizing your website for generative AI features", href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" },
      { label: "Google: General structured data guidelines", href: "https://developers.google.com/search/docs/appearance/structured-data/sd-policies" },
      { label: "Google: Robots meta tags and indexing controls", href: "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag" },
    ],
    related: [
      { slug: "technical-seo-ai-discovery", label: "Technical SEO for AI Discovery", description: "Map crawlability, rendering, canonical, and public-route responsibilities." },
      { slug: "structured-data-governance", label: "Structured Data Governance", description: "Keep machine-readable statements aligned with visible, reviewable information." },
      { slug: "evidence-led-content-architecture", label: "Evidence-Led Content Architecture", description: "Create useful decision content without content-volume or citation promises." },
      { slug: "ai-discovery-measurement", label: "AI Discovery Measurement", description: "Use available Google and first-party signals without inventing a universal visibility score." },
      { slug: "geo-readiness", label: "GEO Readiness", description: "Decide whether a governed GEO engagement is appropriate." },
      { slug: "image-seo-fundamentals", label: "Image SEO Fundamentals", description: "Apply meaningful-visual, alt-text, and metadata standards." },
    ],
  },
  "ai-discovery-measurement": {
    stream: "AI Discovery Operating System",
    eyebrow: "Measurement guide · first-party learning",
    title: "AI discovery measurement: use available signals without inventing a universal score",
    description: "A practical measurement framework for teams that want to learn from Search Console, public-site behavior, and qualified conversations without conflating impressions with citations, conversions, or commercial outcomes.",
    decision: "Use this guide when an owner needs to decide what discovery evidence is actually available, how it should be reviewed, and which questions should remain open rather than being hidden behind a third-party score.",
    sections: [
      { title: "Name the signal before interpreting it", body: "An impression, a page visit, a CTA event, a qualified conversation, and a completed purchase are different events with different meanings. Start each review by naming the source, event definition, time range, aggregation level, and owner. This prevents an external-display signal from being presented as a commercial outcome.", citations: [{ label: "Google Search Console Help: Generative AI performance report", href: "https://support.google.com/webmasters/answer/16984139?hl=en" }] },
      { title: "Use the Search Console generative AI report where it is available", body: "Google’s report is being rolled out to a subset of properties and provides impression data for supported generative AI features in Search. Its available dimensions include pages, countries, dates, and devices. Treat it as a Google Search input—not a universal measure of every model, answer, citation, or platform.", citations: [{ label: "Google Search Console Help: Generative AI performance report", href: "https://support.google.com/webmasters/answer/16984139?hl=en" }, { label: "Google Search Central: Generative AI performance report announcement", href: "https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports" }] },
      { title: "Pair external discovery signals with first-party evidence", body: "The organization can directly govern its own page improvements, CTA definitions, form submissions, qualification notes, and follow-up outcomes. Review those alongside technical findings and available Search Console data. Do not infer that a change caused an external-system event unless the evidence supports that conclusion.", citations: [{ label: "Google: Optimizing your website for generative AI features", href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" }] },
      { title: "Keep uncertainty visible in the operating review", body: "The newest Search Console data may be preliminary, aggregation can differ between a property chart and page table, and some properties may not receive the report. Document missing data, report availability, configuration changes, and open questions. A useful review can recommend the next controlled action without manufacturing certainty.", citations: [{ label: "Google Search Console Help: Generative AI performance report", href: "https://support.google.com/webmasters/answer/16984139?hl=en" }] },
    ],
    checklist: ["Each metric has a named source, definition, time range, and responsible reviewer.", "Google generative AI impressions are labeled as impressions rather than citations, traffic, conversions, or revenue.", "First-party CTA, lead, qualification, and purchase signals are reviewed separately from external-platform measurements.", "Missing reports, preliminary values, aggregation differences, and unanswered questions remain visible in the decision record."],
    deliverables: ["Measurement dictionary and signal-boundary map", "First-party funnel and qualified-conversation review", "Search Console availability and report review where applicable", "Decision log with actions, owners, and unresolved questions"],
    cta: "Define an evidence-aware review cadence",
    ctaHref: "/#contact",
    sources: [
      { label: "Google Search Console Help: Generative AI performance report", href: "https://support.google.com/webmasters/answer/16984139?hl=en" },
      { label: "Google Search Central: Introducing generative AI performance reports", href: "https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports" },
      { label: "Google: Optimizing your website for generative AI features", href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" },
    ],
    related: [
      { slug: "ai-discovery-readiness", label: "AI Discovery Operating System", description: "Return to the full technical, content, governance, and measurement foundation." },
      { slug: "technical-seo-ai-discovery", label: "Technical SEO for AI Discovery", description: "Resolve public-route and rendering questions before interpreting discovery signals." },
      { slug: "evidence-led-content-architecture", label: "Evidence-Led Content Architecture", description: "Use source and claim controls to make measurement reviews easier to interpret." },
    ],
  },
  "technical-seo-ai-discovery": {
    stream: "AI Discovery Operating System",
    eyebrow: "Technical guide · discoverability foundations",
    title: "Technical SEO for AI discovery: build a responsibility map, not a visibility hack",
    description: "A practical guide to the public-route, rendering, canonical, linking, and indexing decisions that make an organization’s information easier to reach and review.",
    decision: "Use this guide when a technical or marketing owner needs to decide what can be improved on the site itself before making any claim about third-party search or model visibility.",
    sections: [
      { title: "Start with pages people and crawlers can reach", body: "The useful unit is a public page that answers a real buyer decision, returns a meaningful response, and can be reached through ordinary links. Google describes crawling, rendering, and indexing as separate steps; a public page still needs to be reachable and eligible before it can be considered for discovery.", citations: [{ label: "Google: JavaScript SEO basics", href: "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics" }, { label: "Google: Generative AI optimization guidance", href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" }] },
      { title: "Render public decision content early and consistently", body: "A JavaScript application can be discoverable, but rendering and diagnosis are more complex when important content is only assembled after the initial response. Server-side or pre-rendering can improve the experience for users and crawlers. It is an implementation choice and risk-reduction measure, not a ranking promise.", citations: [{ label: "Google: JavaScript SEO basics", href: "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics" }] },
      { title: "Treat canonicals, titles, and status codes as operating controls", body: "A canonical should consistently identify the preferred public URL, while titles and descriptions should describe the actual page purpose. Private customer routes should use authentication, noindex boundaries, and appropriate response behavior. These controls reduce ambiguity; they do not force indexing or an external-system appearance.", citations: [{ label: "Google: JavaScript SEO basics", href: "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics" }] },
      { title: "Link the next decision, not just another page", body: "A topic cluster works when a reader can move from a broad operating question to the specific technical, content, or service decision they need next. Use descriptive anchor text and ordinary links to connect that path. Avoid producing a separate page for every phrasing variation merely to influence a search or generative system.", citations: [{ label: "Google: Generative AI optimization guidance", href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" }] },
    ],
    checklist: ["Important public pages have stable, direct URLs and meaningful HTTP responses.", "Public decision content is present in the server-rendered response where practical.", "Canonical, title, description, and noindex decisions have a named owner.", "Internal links connect a reader to the next relevant decision rather than a generic archive."],
    deliverables: ["Public-route and rendering review", "Canonical, indexability, and internal-link responsibility map", "Prioritized technical discovery backlog", "Documented verification and review cadence"],
    cta: "Review technical discovery foundations",
    ctaHref: "/#contact",
    sources: [
      { label: "Google: JavaScript SEO basics", href: "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics" },
      { label: "Google: Optimizing your website for generative AI features", href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" },
      { label: "web.dev: Build agent-friendly websites", href: "https://web.dev/articles/ai-agent-site-ux" },
    ],
    related: [
      { slug: "ai-discovery-readiness", label: "AI Discovery Operating System", description: "Return to the cross-functional discovery foundation and its operating limits." },
      { slug: "structured-data-governance", label: "Structured Data Governance", description: "Connect page information to accurate, visible machine-readable statements." },
      { slug: "geo-readiness", label: "GEO Readiness", description: "Apply technical findings to a qualified service-readiness decision." },
    ],
  },
  "structured-data-governance": {
    stream: "AI Discovery Operating System",
    eyebrow: "Technical guide · information integrity",
    title: "Structured data governance: make public statements reviewable before they are machine-readable",
    description: "A guide to keeping structured data aligned with visible page content, named owners, and controlled updates—without treating schema as a shortcut to rich results or AI visibility.",
    decision: "Use this guide when a team needs to decide what information belongs in structured data, who can approve it, and how to prevent hidden, stale, or unsupported statements from entering public markup.",
    sections: [
      { title: "Mark up what a reader can actually see", body: "Structured data should represent the main content of the page, remain relevant to that page, and avoid hidden or misleading additions. A page’s visible statement and its machine-readable statement should be the same claim viewed through two interfaces.", citations: [{ label: "Google: General structured data guidelines", href: "https://developers.google.com/search/docs/appearance/structured-data/sd-policies" }] },
      { title: "Use one public source of truth", body: "The strongest implementation starts with an accurate service page, guide, or organizational record. JSON-LD can provide explicit clues about page meaning, but it should be generated from information that already has a responsible owner, a review path, and a visible context.", citations: [{ label: "Google: Introduction to structured data", href: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data" }] },
      { title: "Govern updates as a change-management task", body: "Pricing, operating terms, service details, and organization facts change. Treat material markup updates like public-content changes: identify the owner, record the evidence, confirm visible alignment, validate the output, and schedule a review. This makes the work maintainable without creating a false sense of external-platform control.", citations: [{ label: "Google: General structured data guidelines", href: "https://developers.google.com/search/docs/appearance/structured-data/sd-policies" }] },
      { title: "Test eligibility without promising an appearance", body: "Google recommends validation during development and monitoring after deployment. Correct structured data can make a feature eligible, but Google explicitly does not guarantee that it will appear. The operating goal is accurate representation and accountable maintenance, not a claimed rich-result outcome.", citations: [{ label: "Google: General structured data guidelines", href: "https://developers.google.com/search/docs/appearance/structured-data/sd-policies" }, { label: "Google: Introduction to structured data", href: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data" }] },
    ],
    checklist: ["Each marked-up statement is visible, current, relevant, and approved by an accountable owner.", "The selected type reflects the page’s actual primary purpose.", "No reviews, ratings, affiliations, customer outcomes, or other proof signals are invented or hidden in markup.", "Validation and post-deployment review have a named operating owner."],
    deliverables: ["Structured-data inventory and visible-content comparison", "Claim owner and evidence record", "Prioritized schema implementation or remediation plan", "Validation and review checklist"],
    cta: "Review public information integrity",
    ctaHref: "/#contact",
    sources: [
      { label: "Google: General structured data guidelines", href: "https://developers.google.com/search/docs/appearance/structured-data/sd-policies" },
      { label: "Google: Introduction to structured data", href: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data" },
      { label: "Google: Optimizing your website for generative AI features", href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" },
    ],
    related: [
      { slug: "ai-discovery-readiness", label: "AI Discovery Operating System", description: "Return to the broader technical, content, governance, and measurement foundation." },
      { slug: "technical-seo-ai-discovery", label: "Technical SEO for AI Discovery", description: "Confirm the public routes and rendering conditions that support accurate information." },
      { slug: "evidence-led-content-architecture", label: "Evidence-Led Content Architecture", description: "Create visible statements that are strong enough to govern in structured data." },
    ],
  },
  "evidence-led-content-architecture": {
    stream: "AI Discovery Operating System",
    eyebrow: "Content guide · authority without hype",
    title: "Evidence-led content architecture: build a decision library, not a content treadmill",
    description: "A system for turning subject-matter knowledge into linked, reviewable buyer guidance with sources, stated boundaries, and a clear next decision.",
    decision: "Use this guide when a content or subject-matter owner needs to decide which expertise deserves a public page, how to substantiate it, and where a reader should go next without resorting to manufactured proof.",
    sections: [
      { title: "Start with the buyer’s next decision", body: "An authority page earns its place when it resolves a concrete question: whether a team is ready, what belongs in scope, who owns a decision, or what evidence is missing. A list of keyword variations is not a content strategy. Google’s current guidance favors unique, useful, non-commodity information organized for people.", citations: [{ label: "Google: Optimizing your website for generative AI features", href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" }] },
      { title: "Separate practitioner advice from external facts", body: "ARM’s operational point of view should be clearly identified as a method or recommendation. When a page describes search-system behavior, technical eligibility, or markup policy, link to the primary authority. This gives readers a way to assess the claim rather than asking them to trust a generic assertion.", citations: [{ label: "Google: General structured data guidelines", href: "https://developers.google.com/search/docs/appearance/structured-data/sd-policies" }] },
      { title: "Use headings and links as a reader’s path", body: "Clear headings let a reader scan the question, evidence, and boundary of a page. Related links should point to the next decision: from AI-discovery fundamentals to technical implementation, information governance, visual discovery, or service readiness. Connected pages are useful when the relationships are genuine, not when they exist only to manufacture page count.", citations: [{ label: "Google: Optimizing your website for generative AI features", href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" }, { label: "web.dev: Build agent-friendly websites", href: "https://web.dev/articles/ai-agent-site-ux" }] },
      { title: "Maintain claims like operating assets", body: "A source can change, a service boundary can evolve, and an example can stop being representative. Assign a claim owner, evidence location, review date, and stop condition for material pages. If support is missing, revise, qualify, or remove the statement rather than using more persuasive language.", citations: [{ label: "Google: Optimizing your website for generative AI features", href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" }] },
    ],
    checklist: ["The page supports one identifiable buyer or operator decision.", "External-system claims link to a primary source and ARM recommendations are framed as recommendations.", "Important boundaries, assumptions, and exclusions are visible to the reader.", "The page offers a relevant next reading path and a qualified conversion route."],
    deliverables: ["Decision-led content map", "Source and claim register", "Hub-and-spoke internal-link plan", "Editorial QA and scheduled review cadence"],
    cta: "Build a decision-led content system",
    ctaHref: "/#contact",
    sources: [
      { label: "Google: Optimizing your website for generative AI features", href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" },
      { label: "Google: General structured data guidelines", href: "https://developers.google.com/search/docs/appearance/structured-data/sd-policies" },
      { label: "web.dev: Build agent-friendly websites", href: "https://web.dev/articles/ai-agent-site-ux" },
    ],
    related: [
      { slug: "ai-discovery-readiness", label: "AI Discovery Operating System", description: "See where public content fits with technical, governance, and measurement work." },
      { slug: "image-seo-fundamentals", label: "Image SEO Fundamentals", description: "Apply the same truthfulness and context standards to meaningful visuals." },
      { slug: "geo-readiness", label: "GEO Readiness", description: "Move from a decision library to a qualified GEO operating conversation." },
    ],
  },
  "image-seo-fundamentals": {
    stream: "Cross-stream operating guide",
    eyebrow: "Evidence guide · visual discovery",
    title: "Image SEO fundamentals: meaningful visuals, accurate metadata, and fast delivery",
    description: "A practical guide to image filenames, alt text, visual context, responsive delivery, and metadata for teams that want discoverability without turning accessibility into keyword stuffing.",
    decision: "Use this guide when deciding whether an image improves a buyer’s understanding, accessibility, performance, or public discovery—and what should be true before it is published.",
    sections: [
      { title: "Start with an image that earns its place", body: "A visual should explain, evidence, orient, or support a decision on the page. Decorative imagery can be appropriate, but it should not be used as manufactured proof, a substitute for a clear offer, or a stock visual that implies a client outcome that did not occur." },
      { title: "Name assets for people and systems", body: "Use concise, lowercase, hyphen-separated names that truthfully describe the visual, such as arm-agency-founder-professional-headshot.webp. Avoid generic camera names, revision clutter, keyword lists, or claims the image cannot substantiate. A filename is a light contextual clue, not a ranking mechanism." },
      { title: "Write alt text for the context, not a keyword field", body: "Alt text should describe the meaningful visual content or function in its page context. A useful description supports people using screen readers and helps clarify the image subject. Decorative images should use empty alt text; keyword strings and redundant phrases create a worse experience." },
      { title: "Ship the right image, not simply the newest format", body: "Choose the format, dimensions, compression, and responsive approach based on the placement and measured experience. WebP or AVIF can reduce bytes for suitable raster images; SVG is often a better fit for logos and line diagrams. Include intrinsic width and height, use an img fallback within picture patterns, and avoid serving oversized hero assets to small devices." },
      { title: "Use image metadata only when it is representative", body: "A page may benefit from a preferred preview image through accurate Open Graph or structured metadata. The image must be relevant to the page and visible content. Metadata can inform a platform’s selection, but it does not guarantee an image preview, rich result, ranking, or AI citation." },
    ],
    checklist: ["The visual helps a buyer understand the page or is deliberately decorative.", "The filename is concise, factual, lowercase, and hyphen-separated.", "The alt text describes meaningful content or correctly uses an empty value for decoration.", "Dimensions, loading strategy, format, and compression match the placement.", "Any caption, metadata, and visible claims accurately represent the asset and page."],
    deliverables: ["Image inventory and placement review", "Filename and alt-text standards", "Responsive-format and performance recommendations", "Preferred-image and structured-data accuracy review", "Future asset intake and quality-assurance workflow"],
    cta: "Review image SEO readiness",
    ctaHref: "/#contact",
    image: {
      src: "/manus-storage/arm-agency-image-seo-foundations_38f4a915.svg",
      alt: "Diagram showing ARM Agency's five image SEO foundations: truthful visual, descriptive asset name, contextual alt text, appropriate delivery, and accurate metadata.",
      width: 1200,
      height: 630,
      caption: "Image SEO Foundations — an original ARM Agency visual explaining the standards described in this guide.",
    },
    sources: [
      { label: "Google: Image SEO best practices", href: "https://developers.google.com/search/docs/appearance/google-images" },
      { label: "web.dev: Image performance", href: "https://web.dev/learn/performance/image-performance" },
      { label: "web.dev: Use WebP images", href: "https://web.dev/articles/serve-images-webp" },
    ],
  },
};

export default function InsightPage() {
  const [, params] = useRoute("/insights/:slug");
  const insight = params ? insights[params.slug] : undefined;

  if (!insight) {
    return <div className="min-h-screen bg-[#080a08] text-[#c8cfc8] font-mono flex items-center justify-center px-6"><div className="max-w-lg text-center"><div className="text-[#e8a020] text-[11px] tracking-[0.2em] uppercase mb-4">Resource unavailable</div><h1 className="text-3xl text-[#eaf0ea] font-light mb-4">This guide is not available.</h1><Link href="/" className="text-[#e8a020] no-underline">Return to ARM Agency →</Link></div></div>;
  }

  return <main className="min-h-screen bg-[#080a08] text-[#c8cfc8] font-mono">
    <nav className="sticky top-0 z-20 flex items-center justify-between h-[60px] px-6 lg:px-12 bg-[#080a08]/90 backdrop-blur-xl border-b border-white/[0.07]"><Link href="/" className="flex items-center gap-2.5 no-underline"><div className="w-7 h-7 border border-[#e8a020] flex items-center justify-center text-[11px] font-semibold text-[#e8a020]">ARM</div><span className="text-[13px] tracking-[0.1em] uppercase text-[#eaf0ea]">ARM Agency</span></Link><Link href="/" className="text-[11px] tracking-[0.14em] uppercase text-[#e8a020] no-underline">Explore offers →</Link></nav>
    <article className="max-w-4xl mx-auto px-6 lg:px-12 pt-20 pb-24">
      <div className="text-[10px] tracking-[0.2em] uppercase text-[#3ddc84] mb-5">{insight.eyebrow} · {insight.stream}</div>
      <h1 className="text-[clamp(2.35rem,6vw,4.6rem)] leading-[1.05] font-light tracking-tight text-[#eaf0ea] max-w-3xl">{insight.title}</h1>
      <p className="mt-7 text-[17px] leading-[1.9] text-[#c8cfc8] font-sans max-w-2xl">{insight.description}</p>
      {insight.image ? <figure className="mt-10 border border-white/[0.08] bg-[#0d100d]"><img src={insight.image.src} alt={insight.image.alt} width={insight.image.width} height={insight.image.height} decoding="async" className="block w-full h-auto"/><figcaption className="px-4 py-3 text-[11px] leading-[1.7] text-[#8e988e] font-sans border-t border-white/[0.08]">{insight.image.caption}</figcaption></figure> : null}
      <div className="mt-10 p-6 bg-[#0d100d] border border-white/[0.07] border-l-2 border-l-[#e8a020]"><div className="text-[10px] tracking-[0.16em] uppercase text-[#e8a020] mb-3">The decision this supports</div><p className="text-[15px] leading-[1.85] text-[#eaf0ea] font-sans">{insight.decision}</p></div>
      <div className="mt-14 space-y-10">{insight.sections.map((section) => <section key={section.title}><h2 className="text-2xl font-light text-[#eaf0ea] mb-3">{section.title}</h2><p className="text-[15px] leading-[1.9] text-[#c8cfc8] font-sans">{section.body}</p>{section.citations?.length ? <p className="mt-3 text-[11px] leading-[1.7] text-[#8e988e] font-sans">Sources: {section.citations.map((source, index) => <span key={source.href}>{index ? " · " : ""}<a href={source.href} target="_blank" rel="noreferrer" className="text-[#e8a020] hover:underline">[{index + 1}] {source.label}</a></span>)}</p> : null}</section>)}</div>
      {insight.rubric?.length ? <section className="mt-14"><h2 className="text-2xl font-light text-[#eaf0ea] mb-3">Readiness scoring rubric</h2><p className="text-[14px] leading-[1.8] text-[#8e988e] font-sans mb-6">Assign 0, 1, or 2 only from evidence available today. Do not award future-state controls.</p><div className="space-y-4">{insight.rubric.map((row) => <article key={row.dimension} className="p-6 bg-[#0d100d] border border-white/[0.07]"><h3 className="text-[16px] text-[#eaf0ea] mb-4">{row.dimension}</h3><div className="grid md:grid-cols-3 gap-4 text-[12px] leading-[1.7] font-sans"><p><strong className="text-[#e8a020]">0 · Absent</strong><br/>{row.zero}</p><p><strong className="text-[#e8a020]">1 · Documented</strong><br/>{row.one}</p><p><strong className="text-[#3ddc84]">2 · Tested</strong><br/>{row.two}</p></div></article>)}</div></section> : null}
      <div className="mt-16 grid md:grid-cols-2 gap-6"><section className="p-6 bg-[#0d100d] border border-white/[0.07]"><h2 className="text-lg font-light text-[#eaf0ea] mb-4">Readiness questions</h2><ul className="space-y-3">{insight.checklist.map((item) => <li key={item} className="flex gap-3 text-[14px] leading-[1.7] font-sans"><span className="text-[#3ddc84]">→</span>{item}</li>)}</ul></section><section className="p-6 bg-[#0d100d] border border-white/[0.07]"><h2 className="text-lg font-light text-[#eaf0ea] mb-4">What a scoped next step can deliver</h2><ul className="space-y-3">{insight.deliverables.map((item) => <li key={item} className="flex gap-3 text-[14px] leading-[1.7] font-sans"><span className="text-[#e8a020]">→</span>{item}</li>)}</ul></section></div>
      <section className="mt-16 p-8 bg-[#111411] border border-[#1a7040] text-center"><div className="text-[10px] tracking-[0.18em] uppercase text-[#3ddc84] mb-3">A bounded next step</div><h2 className="text-2xl font-light text-[#eaf0ea] mb-3">Need help applying this to your operating context?</h2><p className="text-[14px] leading-[1.8] text-[#c8cfc8] max-w-xl mx-auto font-sans mb-6">We begin by clarifying the decision, scope, ownership, and constraints. The appropriate next step may be a diagnostic, a workshop, a bounded implementation, or a respectful no-go decision.</p><a href={insight.ctaHref} className="inline-block px-6 py-3 bg-[#e8a020] text-[#080a08] text-[11px] font-medium tracking-[0.13em] uppercase no-underline hover:opacity-85">{insight.cta} →</a></section>
      {insight.related?.length ? <section className="mt-10"><h2 className="text-[11px] tracking-[0.14em] uppercase text-[#667066] mb-4">Continue the decision path</h2><div className="grid md:grid-cols-3 gap-4">{insight.related.map((item) => { const href = item.href ?? `/insights/${item.slug}`; return <Link key={href} href={href} className="block p-5 bg-[#0d100d] border border-white/[0.07] no-underline hover:border-[#3ddc84]/60 transition-colors"><h3 className="text-[14px] font-medium text-[#eaf0ea] mb-2">{item.label} <span className="text-[#3ddc84]">→</span></h3>{item.description ? <p className="text-[12px] leading-[1.7] text-[#8e988e] font-sans">{item.description}</p> : null}</Link>; })}</div></section> : null}
      {insight.sources?.length ? <section className="mt-10 border-t border-white/[0.07] pt-7"><h2 className="text-[11px] tracking-[0.14em] uppercase text-[#667066] mb-4">Sources</h2><ul className="space-y-2">{insight.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer" className="text-[12px] text-[#e8a020] hover:underline">{source.label} ↗</a></li>)}</ul></section> : null}
    </article>
  </main>;
}
