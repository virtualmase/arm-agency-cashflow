import { Link } from "wouter";
import { insights } from "./InsightPage";

export const insightLibraryGroups = [
  {
    label: "AI Discovery Operating System",
    title: "Build a public information system that can be understood, reviewed, and improved.",
    body: "This cluster separates controllable foundations—technical delivery, accurate machine-readable information, evidence-led content, visual context, and qualification—from claims about external search or model outcomes.",
    slugs: ["ai-discovery-readiness", "technical-seo-ai-discovery", "structured-data-governance", "evidence-led-content-architecture", "ai-discovery-measurement", "image-seo-fundamentals", "geo-readiness"],
  },
  {
    label: "Accountable AI Operations",
    title: "Make the next operating decision explicit before building more infrastructure.",
    body: "These guides help teams establish scope, decision ownership, technical boundaries, acceptance conditions, and handoff requirements for a bounded AI intervention.",
    slugs: ["ai-infrastructure-audit", "bounded-agent-stack-setup"],
  },
  {
    label: "Agentic Commerce Operations",
    title: "Connect machine payments to bounded authority, fulfillment, and financial evidence.",
    body: "This cluster separates x402 payment transport from AiFi governance, then turns both into an inspectable readiness and implementation path for autonomous economic activity.",
    slugs: ["agentic-commerce-infrastructure", "x402-agent-payments", "aifi-governance-controls", "agent-payment-readiness"],
  },
  {
    label: "AI Mastery and Operator Decisions",
    title: "Build accountable internal capability before treating AI as an outsourced black box.",
    body: "These guides help agency operators and accountable leaders choose an appropriate learning path, define bounded practice conditions, and recognize when a diagnostic or implementation scope is the better next step.",
    slugs: ["operator-learning-path", "ai-mastery-foundations", "ai-mastery-practice-boundaries", "network-participation"],
  },
] as const;

export default function InsightsIndex() {
  return <main className="min-h-screen bg-[#080a08] text-[#c8cfc8] font-mono">
    <nav className="sticky top-0 z-20 flex items-center justify-between h-[60px] px-6 lg:px-12 bg-[#080a08]/90 backdrop-blur-xl border-b border-white/[0.07]">
      <Link href="/" className="flex items-center gap-2.5 no-underline"><div className="w-7 h-7 border border-[#e8a020] flex items-center justify-center text-[11px] font-semibold text-[#e8a020]">ARM</div><span className="text-[13px] tracking-[0.1em] uppercase text-[#eaf0ea]">ARM Agency</span></Link>
      <a href="/#contact" className="text-[11px] tracking-[0.14em] uppercase text-[#e8a020] no-underline">Discuss your context →</a>
    </nav>
    <section className="max-w-6xl mx-auto px-6 lg:px-12 pt-20 pb-10">
      <div className="text-[10px] tracking-[0.2em] uppercase text-[#3ddc84] mb-5">Public authority library · decision-led guidance</div>
      <h1 className="text-[clamp(2.5rem,6vw,5.4rem)] font-light leading-[1.05] tracking-tight text-[#eaf0ea] max-w-4xl">Guides for accountable AI, public information, and operating decisions.</h1>
      <p className="mt-7 text-[17px] leading-[1.9] text-[#c8cfc8] font-sans max-w-3xl">This library is organized around the next decision a buyer, operator, or technical owner needs to make. It connects source-backed technical SEO and GEO guidance with bounded service, implementation, learning, and participation paths.</p>
      <div className="mt-10 p-6 bg-[#0d100d] border border-white/[0.07] border-l-2 border-l-[#e8a020] max-w-3xl"><div className="text-[10px] tracking-[0.16em] uppercase text-[#e8a020] mb-3">How to use this library</div><p className="text-[14px] leading-[1.85] text-[#eaf0ea] font-sans">Start with the decision closest to your current constraint. Each guide identifies what can be assessed, what remains uncertain, and the appropriate qualified next step. ARM Agency does not promise rankings, citations, rich results, model mentions, or commercial outcomes from public-content work.</p></div>
    </section>
    <section className="max-w-6xl mx-auto px-6 lg:px-12 pb-24 space-y-16">
      {insightLibraryGroups.map((group) => <section key={group.label}>
        <div className="text-[10px] tracking-[0.18em] uppercase text-[#e8a020] mb-3">{group.label}</div>
        <h2 className="text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.15] font-light text-[#eaf0ea] max-w-3xl">{group.title}</h2>
        <p className="mt-4 text-[14px] leading-[1.85] text-[#8e988e] font-sans max-w-3xl">{group.body}</p>
        <div className="mt-7 grid md:grid-cols-2 lg:grid-cols-3 gap-4">{group.slugs.map((slug) => {
          const insight = insights[slug];
          return <Link key={slug} href={`/insights/${slug}`} className="block p-6 bg-[#0d100d] border border-white/[0.07] no-underline hover:border-[#3ddc84]/70 hover:-translate-y-0.5 transition-all">
            <div className="text-[9px] tracking-[0.16em] uppercase text-[#3ddc84] mb-3">{insight.eyebrow}</div>
            <h3 className="text-[18px] leading-[1.3] font-light text-[#eaf0ea]">{insight.title}</h3>
            <p className="mt-3 text-[12px] leading-[1.75] text-[#8e988e] font-sans">{insight.description}</p>
            <div className="mt-5 text-[10px] tracking-[0.14em] uppercase text-[#e8a020]">Read the guide →</div>
          </Link>;
        })}</div>
      </section>)}
      <section className="p-8 bg-[#111411] border border-[#1a7040] text-center"><div className="text-[10px] tracking-[0.18em] uppercase text-[#3ddc84] mb-3">A bounded next step</div><h2 className="text-2xl font-light text-[#eaf0ea] mb-3">Need help applying a guide to your operating context?</h2><p className="text-[14px] leading-[1.8] text-[#c8cfc8] max-w-xl mx-auto font-sans mb-6">We begin by clarifying the decision, scope, ownership, and constraints. The next step may be a diagnostic, a workshop, a bounded implementation, education, or a respectful no-go decision.</p><a href="/#contact" className="inline-block px-6 py-3 bg-[#e8a020] text-[#080a08] text-[11px] font-medium tracking-[0.13em] uppercase no-underline hover:opacity-85">Discuss your starting point →</a></section>
    </section>
  </main>;
}
