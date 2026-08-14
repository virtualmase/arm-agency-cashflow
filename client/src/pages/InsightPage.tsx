import { Link, useRoute } from "wouter";

type Insight = {
  stream: string;
  eyebrow: string;
  title: string;
  description: string;
  decision: string;
  sections: Array<{ title: string; body: string }>;
  checklist: string[];
  deliverables: string[];
  cta: string;
  ctaHref: string;
  sources?: Array<{ label: string; href: string }>;
};

export const insights: Record<string, Insight> = {
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
      <div className="mt-10 p-6 bg-[#0d100d] border border-white/[0.07] border-l-2 border-l-[#e8a020]"><div className="text-[10px] tracking-[0.16em] uppercase text-[#e8a020] mb-3">The decision this supports</div><p className="text-[15px] leading-[1.85] text-[#eaf0ea] font-sans">{insight.decision}</p></div>
      <div className="mt-14 space-y-10">{insight.sections.map((section) => <section key={section.title}><h2 className="text-2xl font-light text-[#eaf0ea] mb-3">{section.title}</h2><p className="text-[15px] leading-[1.9] text-[#c8cfc8] font-sans">{section.body}</p></section>)}</div>
      <div className="mt-16 grid md:grid-cols-2 gap-6"><section className="p-6 bg-[#0d100d] border border-white/[0.07]"><h2 className="text-lg font-light text-[#eaf0ea] mb-4">Readiness questions</h2><ul className="space-y-3">{insight.checklist.map((item) => <li key={item} className="flex gap-3 text-[14px] leading-[1.7] font-sans"><span className="text-[#3ddc84]">→</span>{item}</li>)}</ul></section><section className="p-6 bg-[#0d100d] border border-white/[0.07]"><h2 className="text-lg font-light text-[#eaf0ea] mb-4">What a scoped next step can deliver</h2><ul className="space-y-3">{insight.deliverables.map((item) => <li key={item} className="flex gap-3 text-[14px] leading-[1.7] font-sans"><span className="text-[#e8a020]">→</span>{item}</li>)}</ul></section></div>
      <section className="mt-16 p-8 bg-[#111411] border border-[#1a7040] text-center"><div className="text-[10px] tracking-[0.18em] uppercase text-[#3ddc84] mb-3">A bounded next step</div><h2 className="text-2xl font-light text-[#eaf0ea] mb-3">Need help applying this to your operating context?</h2><p className="text-[14px] leading-[1.8] text-[#c8cfc8] max-w-xl mx-auto font-sans mb-6">We begin by clarifying the decision, scope, ownership, and constraints. The appropriate next step may be a diagnostic, a workshop, a bounded implementation, or a respectful no-go decision.</p><a href={insight.ctaHref} className="inline-block px-6 py-3 bg-[#e8a020] text-[#080a08] text-[11px] font-medium tracking-[0.13em] uppercase no-underline hover:opacity-85">{insight.cta} →</a></section>
      {insight.sources?.length ? <section className="mt-10 border-t border-white/[0.07] pt-7"><h2 className="text-[11px] tracking-[0.14em] uppercase text-[#667066] mb-4">Sources</h2><ul className="space-y-2">{insight.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer" className="text-[12px] text-[#e8a020] hover:underline">{source.label} ↗</a></li>)}</ul></section> : null}
    </article>
  </main>;
}
