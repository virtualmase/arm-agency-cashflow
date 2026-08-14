import { useState } from "react";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

const streamColors: Record<string, { accent: string; dim: string }> = {
  signal: { accent: "#3ddc84", dim: "#1a7040" },
  amber: { accent: "#e8a020", dim: "#a06010" },
  violet: { accent: "#a78bfa", dim: "#7b5ea7" },
};

export default function Home() {
  const { user } = useAuth();
  const trackPageView = trpc.analytics.track.useMutation();
  useEffect(() => {
    trackPageView.mutate({ eventName: "page_view", path: window.location.pathname });
  }, []);
  return (
    <div className="min-h-screen text-[#c8cfc8] font-mono">
      <Nav user={user} />
      <Hero />
      <SignalStrip />
      <Capabilities />
      <EngagementPath />
      <PricingSection />
      <QuickStartPackages />
      <ContactSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}

function Nav({ user }: { user: any }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 h-[60px] bg-[#080a08]/85 backdrop-blur-xl border-b border-white/[0.07]">
      <a href="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-7 h-7 border border-[#e8a020] flex items-center justify-center text-[11px] font-semibold text-[#e8a020]">ARM</div>
        <span className="text-[13px] font-medium tracking-[0.1em] uppercase text-[#eaf0ea] hidden sm:inline">ARM Agency</span>
      </a>
      <div className="flex items-center gap-6">
        <a href="#capabilities" className="text-[12px] tracking-[0.08em] uppercase text-[#667066] hover:text-[#e8a020] transition-colors no-underline hidden md:inline">Capabilities</a>
        <a href="#pricing" className="text-[12px] tracking-[0.08em] uppercase text-[#667066] hover:text-[#e8a020] transition-colors no-underline hidden md:inline">Pricing</a>
        <a href="#contact" className="text-[12px] tracking-[0.08em] uppercase text-[#667066] hover:text-[#e8a020] transition-colors no-underline hidden md:inline">Contact</a>
        {user && (
          <Link href="/portal" className="text-[12px] tracking-[0.08em] uppercase text-[#e8a020] hover:text-[#e8a020]/80 transition-colors no-underline hidden md:inline">My Portal</Link>
        )}
        {user?.role === "admin" && (
          <Link href="/admin" className="text-[12px] tracking-[0.08em] uppercase text-[#3ddc84] hover:text-[#3ddc84]/80 transition-colors no-underline hidden md:inline">Dashboard</Link>
        )}
        <a href="#contact" className="border border-[#e8a020] text-[#e8a020] px-4 py-1.5 text-[11px] tracking-[0.12em] uppercase hover:bg-[#e8a020] hover:text-[#080a08] transition-all no-underline">Request Demo</a>
      </div>
    </nav>
  );
}

function Hero() {
  const trackCta = trpc.analytics.track.useMutation();
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 lg:px-12 pt-32 pb-16 relative max-w-[1400px] mx-auto">
      <div className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#e8a020] mb-8">
        <div className="w-5 h-px bg-[#e8a020]" />Autonomous Infrastructure
      </div>
      <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[1.05] tracking-tight text-[#eaf0ea] max-w-[900px]">
        Accountable AI<br />built for <em className="not-italic text-[#e8a020]">production.</em>
      </h1>
      <p className="mt-6 text-base font-light text-[#c8cfc8] max-w-[520px] leading-[1.9] font-sans">
        ARM Agency helps accountable teams scope, design, and operate AI workflows, agent infrastructure, and generative-engine visibility programs.
      </p>
      <div className="flex gap-4 mt-8">
        <a href="#contact" onClick={() => trackCta.mutate({ eventName: "cta_click", path: "/", productKey: "diagnostic", stream: "arm" })} className="px-7 py-3 bg-[#e8a020] text-[#080a08] text-[12px] font-medium tracking-[0.1em] uppercase no-underline hover:opacity-85 transition-opacity">Start with a diagnostic</a>
        <a href="#pricing" onClick={() => trackCta.mutate({ eventName: "cta_click", path: "/" })} className="px-7 py-3 border border-white/[0.07] text-[#c8cfc8] text-[12px] tracking-[0.1em] uppercase no-underline hover:border-[#c8cfc8] transition-colors">Browse offers</a>
      </div>
      <div className="flex flex-wrap gap-8 lg:gap-12 mt-16 pt-8 border-t border-white/[0.07]">
        {[{ val: "01", label: "Qualified discovery" }, { val: "02", label: "Bounded design" }, { val: "03", label: "Governed delivery" }, { val: "04", label: "Customer portal" }].map(s => (
          <div key={s.label}>
            <div className="text-2xl font-semibold text-[#eaf0ea] tracking-tight">{s.val}</div>
            <div className="text-[11px] text-[#667066] tracking-[0.1em] uppercase mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="absolute right-12 top-1/2 -translate-y-1/2 w-[360px] bg-[#0d100d] border border-white/[0.07] border-t-2 border-t-[#e8a020] hidden xl:block">
        <div className="px-3.5 py-2.5 border-b border-white/[0.07] flex items-center gap-2 text-[11px] text-[#667066]">
          <div className="w-1.5 h-1.5 bg-[#3ddc84] rounded-full shadow-[0_0_6px_#3ddc84]" />arm-agent-cli v2.4.1 — connected
        </div>
        <div className="p-4 text-[12px] leading-[2]">
          <div><span className="text-[#667066]">$</span> <span className="text-[#3ddc84]">arm</span> route --readiness</div>
          <div className="text-[#667066]">Select your operating motion...</div>
          <div><span className="text-[#e8a020]">✓</span> <span className="text-[#eaf0ea]">diagnose</span> <span className="text-[#667066]">current state</span></div>
          <div><span className="text-[#e8a020]">✓</span> <span className="text-[#eaf0ea]">design</span> <span className="text-[#667066]">accountable scope</span></div>
          <div><span className="text-[#e8a020]">✓</span> <span className="text-[#eaf0ea]">operate</span> <span className="text-[#667066]">with clear ownership</span></div>
          <div className="text-[#667066]">──────────────────────────</div>
          <div><span className="text-[#667066]">Checkout:</span> <span className="text-[#3ddc84]">Stripe</span></div>
          <div><span className="text-[#667066]">Billing:</span> <span className="text-[#eaf0ea]">receipt + portal</span></div>
          <div><span className="text-[#667066]">Next:</span> <span className="text-[#eaf0ea]">qualified scope</span></div>
          <div><span className="text-[#667066]">$</span> <span className="inline-block w-1.5 h-3.5 bg-[#e8a020] animate-pulse" /></div>
        </div>
      </div>
    </section>
  );
}

function SignalStrip() {
  const items = ["AI-Native Architecture", "Byzantine Fault Tolerance", "Agentic Workflow Orchestration", "Real-Time Attribution", "GEO Signal Governance", "Carbon-Aware Scheduling", "Mandate Chain Verification", "5 Revenue Streams", "16 Products Live"];
  return (
    <div className="py-5 px-6 bg-[#111411] border-y border-white/[0.07] overflow-hidden">
      <div className="flex gap-16 whitespace-nowrap" style={{ animation: "scroll 25s linear infinite" }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-[11px] tracking-[0.15em] uppercase text-[#667066] shrink-0"><span className="text-[#e8a020] mr-2">//</span>{item}</span>
        ))}
      </div>
      <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

function Capabilities() {
  const caps = [
    { num: "01", label: "Architecture", title: "AI-Native Signal Infrastructure", desc: "Machine-readable systems architected from first principles — structured data, semantic layers, and knowledge graphs that AI agents can query, trust, and act on.", tag: "Signal Layer" },
    { num: "02", label: "Orchestration", title: "Agentic Workflow Syndication", desc: "End-to-end orchestration of autonomous workflows across distributed systems. Agents coordinate, delegate, and self-correct under mandate constraints.", tag: "Workflow Layer" },
    { num: "03", label: "Security", title: "Enterprise-Grade Fault Tolerance", desc: "Multi-layer security with Byzantine Fault Tolerance and mandate chain verification. Systems maintain consensus and recover from adversarial conditions.", tag: "Security Layer" },
    { num: "04", label: "Visibility", title: "Real-Time Attribution & Observability", desc: "Live visibility into agent decisions, resource usage, and outcome attribution. Differential privacy protects sensitive data while maintaining transparency.", tag: "Observability Layer" },
  ];
  return (
    <section id="capabilities" className="py-24 px-6 lg:px-12 bg-[#0d100d] max-w-[1400px] mx-auto">
      <div className="text-[11px] tracking-[0.2em] uppercase text-[#e8a020] mb-4 flex items-center gap-2.5">Core capabilities <div className="flex-1 max-w-[60px] h-px bg-[#a06010]" /></div>
      <h2 className="text-[clamp(1.8rem,3.5vw,3rem)] font-light text-[#eaf0ea] tracking-tight leading-[1.15] max-w-[700px] mb-4">What ARM Agency builds and operates</h2>
      <p className="text-[15px] font-light text-[#c8cfc8] max-w-[580px] leading-[1.9] mb-12 font-sans">Four integrated disciplines that give autonomous systems the infrastructure to operate at enterprise scale without supervision failures.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-white/[0.07]">
        {caps.map(c => (
          <div key={c.num} className="p-8 bg-[#0d100d] hover:bg-[#111411] transition-colors group relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-[#e8a020] transition-colors" />
            <div className="text-[11px] text-[#a06010] tracking-[0.1em] mb-4">{c.num} — {c.label}</div>
            <div className="text-[15px] font-medium text-[#eaf0ea] mb-2 tracking-tight">{c.title}</div>
            <div className="text-[13px] text-[#c8cfc8] leading-[1.9] font-sans">{c.desc}</div>
            <div className="inline-block mt-4 text-[10px] tracking-[0.12em] uppercase text-[#3ddc84] border border-[#1a7040] px-2 py-0.5">{c.tag}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EngagementPath() {
  const steps = [
    { number: "01", title: "Diagnose", body: "Start with an AI Infrastructure Audit when the current state, decision constraints, and priorities need to be made explicit." },
    { number: "02", title: "Design", body: "Use the Mandate Chain Design Workshop to align owners, operating constraints, and a practical implementation scope." },
    { number: "03", title: "Operate", body: "Move into a qualified GEO or ARM operating engagement only after the team confirms fit, scope, and success criteria." },
  ];
  return (
    <section className="py-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
      <div className="text-[11px] tracking-[0.2em] uppercase text-[#3ddc84] mb-4 flex items-center gap-2.5">How engagements work <div className="flex-1 max-w-[60px] h-px bg-[#1a7040]" /></div>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 items-start">
        <div>
          <h2 className="text-[clamp(1.8rem,3.5vw,3rem)] font-light text-[#eaf0ea] tracking-tight leading-[1.15] mb-4">A buying path that respects the complexity of production AI.</h2>
          <p className="text-[15px] font-light text-[#c8cfc8] leading-[1.9] font-sans">The right starting point depends on the clarity of the problem. Bounded diagnostic work can be purchased directly. Ongoing services begin with scope confirmation so buyers know what will be delivered, who owns decisions, and what happens next.</p>
          <a href="#contact" className="inline-block mt-7 text-[11px] tracking-[0.14em] uppercase text-[#e8a020] border-b border-[#e8a020] pb-1 no-underline hover:text-[#eaf0ea] hover:border-[#eaf0ea] transition-colors">Discuss your starting point →</a>
        </div>
        <div className="grid gap-px border border-white/[0.07]">
          {steps.map(step => <div key={step.number} className="p-7 bg-[#0d100d] grid grid-cols-[48px_1fr] gap-5"><div className="text-[12px] text-[#3ddc84] tracking-[0.12em]">{step.number}</div><div><h3 className="text-lg font-medium text-[#eaf0ea] mb-2">{step.title}</h3><p className="text-[14px] leading-[1.8] text-[#667066] font-sans">{step.body}</p></div></div>)}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
      <div className="text-[11px] tracking-[0.2em] uppercase text-[#e8a020] mb-4 flex items-center gap-2.5">Pricing <div className="flex-1 max-w-[60px] h-px bg-[#a06010]" /></div>
      <h2 className="text-[clamp(1.8rem,3.5vw,3rem)] font-light text-[#eaf0ea] tracking-tight leading-[1.15] max-w-[700px] mb-2">A clear path from diagnostic to operating program.</h2>
      <p className="text-[15px] font-light text-[#c8cfc8] max-w-[620px] leading-[1.9] mb-4 font-sans">Choose a bounded starting point, a self-serve learning product, or a qualified operating engagement. Every offer names its delivery motion and checkout path.</p>
      <div className="inline-block text-[10px] tracking-[0.15em] uppercase text-[#3ddc84] border border-[#1a7040] px-3 py-1 mb-12">Stripe Checkout · Buyer Receipt · Customer Portal</div>

      <StreamBlock label="Stream 01 · Swell Marketing" title="GEO Retainers" desc="Done-for-you Generative Engine Optimization. We build your entity signal, publish authority content, and monitor your LLM citations every month." color="signal"
        cards={[
          { key: "swell-geo-starter", tier: "Starter", name: "GEO Starter", tagline: "Foundation signal architecture", price: "$1,500", period: "/month", features: ["4 authority articles/month", "JSON-LD entity audit + build", "Monthly LLM citation report", "Share of Model baseline", "llms.txt deployment"], cta: "Start Starter" },
          { key: "swell-geo-growth", tier: "Growth", name: "GEO Growth", tagline: "Full signal governance", price: "$2,500", period: "/month", features: ["8 authority articles/month", "JSON-LD build + maintenance", "Weekly LLM citation monitoring", "Monthly strategy call", "sameAs authority expansion", "Arctura Network distribution"], cta: "Start Growth", featured: true },
          { key: "swell-geo-scale", tier: "Scale", name: "GEO Scale", tagline: "Maximum signal velocity", price: "$3,500", period: "/month", features: ["12 authority articles/month", "Full GEO Signal Governance", "Weekly reporting dashboard", "Bi-weekly strategy calls", "Priority support + SLA", "ARM Framework initialization"], cta: "Start Scale" },
        ]} />

      <StreamBlock label="Stream 02 · ARM" title="Mandate Services" desc="Sovereign agentic infrastructure consulting. ARM designs, deploys, and governs AI agent stacks for businesses that need human-accountable autonomous systems." color="amber"
        cards={[
          { key: "arm-mandate-core", tier: "Core", name: "ARM Core", tagline: "Mandate chain + agent deployment", price: "$3,000", period: "/month", features: ["Mandate chain design", "GEO entity graph build", "1 AURE agent deployment", "Truth Ledger setup", "Monthly audit report"], cta: "Start Core" },
          { key: "arm-mandate-pro", tier: "Pro", name: "ARM Pro", tagline: "Full ARM stack + weekly briefings", price: "$5,000", period: "/month", features: ["Full ARM stack deployment", "3 AURE agents configured", "Weekly briefings from Aureus", "Quarterly strategy sessions", "Checkpoint recovery system", "Graceful escalation protocols"], cta: "Start Pro", featured: true },
          { key: "arm-mandate-sovereign", tier: "Sovereign", name: "ARM Sovereign", tagline: "Enterprise-grade agent governance", price: "$8,000", period: "/month", features: ["Full agent swarm deployment", "Custom mandate chain design", "Dedicated Aureus operator time", "SLA guarantees + uptime", "Immutable audit trail", "Enterprise governance layer"], cta: "Start Sovereign" },
        ]} />

      <StreamBlock label="Stream 03 · Arctura" title="Network Memberships" desc="Join the Arctura Collective — a sovereign network of humans, agents, and infrastructure operating as a unified signal network." color="violet"
        cards={[
          { key: "arctura-node", tier: "Node", name: "Node Member", tagline: "Signal network access", price: "$500", period: "/month", features: ["Arctura signal network access", "ARM Framework license", "Weekly Signal Report", "Community access"], cta: "Join as Node" },
          { key: "arctura-hub", tier: "Hub", name: "Hub Member", tagline: "Co-creation + revenue share", price: "$1,000", period: "/month", features: ["Full ARM Framework license", "Co-creation rights", "Referral revenue share", "Monthly council call", "Priority network routing"], cta: "Join as Hub", featured: true },
          { key: "arctura-sovereign", tier: "Sovereign", name: "Sovereign Node", tagline: "White-label operator rights", price: "$2,000", period: "/month", features: ["White-label ARM methodology", "Dedicated agent mesh slot", "Revenue share on referrals", "Sovereign governance rights", "Custom network routing"], cta: "Join Sovereign" },
        ]} />
    </section>
  );
}

type CardProps = { key: string; tier: string; name: string; tagline: string; price: string; period: string; features: string[]; cta: string; featured?: boolean };

function StreamBlock({ label, title, desc, color, cards }: { label: string; title: string; desc: string; color: string; cards: CardProps[] }) {
  const c = streamColors[color] || streamColors.signal;
  return (
    <div className="mb-16">
      <div className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: c.dim }}>{label}</div>
      <h3 className="text-[clamp(1.5rem,3vw,2.5rem)] font-light tracking-tight mb-2" style={{ color: c.accent }}>{title}</h3>
      <p className="text-[14px] text-[#667066] max-w-[560px] mb-8 font-sans">{desc}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map(card => <PricingCard {...card} productKey={card.key} color={color} key={card.key} />)}
      </div>
    </div>
  );
}

function PricingCard({ productKey, tier, name, tagline, price, period, features, cta, featured, color }: CardProps & { productKey: string; color: string }) {
  const c = streamColors[color] || streamColors.signal;
  const trackCta = trpc.analytics.track.useMutation();
  const checkout = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => { if (data.url) { toast.info("Redirecting to checkout..."); window.open(data.url, "_blank"); } },
    onError: (err) => toast.error(err.message),
  });
  const requiresQualification = productKey.startsWith("swell-") || productKey.startsWith("arm-") || productKey.startsWith("arctura-");
  const stream = productKey.startsWith("swell-") ? "swell" : productKey.startsWith("arm-") ? "arm" : "arctura";
  const beginQualifiedConversation = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    toast.info(`Tell us about your ${name} objective so we can confirm scope and fit.`);
  };
  return (
    <div className="p-8 bg-[#0b1210] border border-white/[0.07] relative transition-all hover:-translate-y-0.5"
      style={featured ? { borderLeftWidth: 2, borderLeftColor: c.accent, background: `linear-gradient(135deg, ${c.accent}08 0%, #0b1210 60%)` } : {}}>
      {featured && <div className="absolute -top-px right-6 text-[9px] font-bold tracking-[0.15em] px-2.5 py-1 rounded-b-sm" style={{ background: c.accent, color: "#080a08" }}>RECOMMENDED</div>}
      <div className="text-[9px] tracking-[0.2em] uppercase mb-2" style={{ color: c.accent }}>{tier}</div>
      <div className="text-xl font-medium text-[#eaf0ea] mb-1">{name}</div>
      <div className="text-[13px] text-[#667066] mb-6">{tagline}</div>
      <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-white/[0.07]">
        <span className="text-4xl font-light tracking-tight" style={{ color: c.accent }}>{price}</span>
        <span className="text-[11px] text-[#667066] tracking-[0.05em]">{period}</span>
      </div>
      <ul className="space-y-2.5 mb-8">
        {features.map((f, i) => <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#c8cfc8]"><span className="text-[12px] mt-0.5 shrink-0" style={{ color: c.accent }}>→</span>{f}</li>)}
      </ul>
      <button onClick={() => { trackCta.mutate({ eventName: "cta_click", path: "/", productKey, stream }); requiresQualification ? beginQualifiedConversation() : checkout.mutate({ productKey }); }} disabled={checkout.isPending}
        className="w-full py-3.5 px-6 border text-[11px] font-semibold tracking-[0.15em] uppercase text-center transition-all"
        style={{ borderColor: c.accent, color: featured ? "#080a08" : c.accent, background: featured ? c.accent : "transparent" }}
        onMouseEnter={(e) => { if (!featured) { e.currentTarget.style.background = c.accent; e.currentTarget.style.color = "#080a08"; } }}
        onMouseLeave={(e) => { if (!featured) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.accent; } }}>
        {checkout.isPending ? "Loading..." : requiresQualification ? "Request scope →" : `${cta} →`}
      </button>
    </div>
  );
}

function QuickStartPackages() {
  const trackCta = trpc.analytics.track.useMutation();
  const checkout = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => { if (data.url) { toast.info("Redirecting to checkout..."); window.open(data.url, "_blank"); } },
    onError: (err) => toast.error(err.message),
  });
  const packages = [
    // Original Quick-Start Packages
    { key: "audit", name: "AI Infrastructure Audit", desc: "Comprehensive audit of your AI infrastructure readiness, signal gaps, and deployment architecture.", price: "$2,500", color: "amber", label: "Quick-Start" },
    { key: "workshop", name: "Mandate Chain Design Workshop", desc: "Half-day workshop to encode your organization's authority structure into verifiable mandate chains.", price: "$1,500", color: "amber", label: "Quick-Start" },
    { key: "mcp_tool", name: "Custom MCP Tool", desc: "Custom MCP tool development tailored to your specific workflow and integration requirements.", price: "$500", color: "amber", label: "Quick-Start" },
    // Academy
    { key: "academy-geo-mastery", name: "GEO Mastery Course", desc: "6 modules, 30+ lessons, JSON-LD templates, LLM citation tracker. Self-paced.", price: "$297", color: "signal", label: "Academy" },
    { key: "academy-arm-cert", name: "ARM Framework Certification", desc: "4-week live cohort. Mandate chain design, agent deployment practicum, certified badge.", price: "$997", color: "signal", label: "Academy" },
    { key: "academy-agency-operator", name: "Agency GEO Operator", desc: "6-week cohort for agency owners. Build a GEO service offering, deploy AURE agents.", price: "$1,997", color: "signal", label: "Academy" },
    // Coreweaver Setup
    { key: "coreweaver-setup-standard", name: "Agent Stack Setup — Standard", desc: "Full GBrain stack deployment + 2 agents. Mandate chain, audit trail, 30-day support.", price: "$2,500", color: "amber", label: "Coreweaver" },
    { key: "coreweaver-setup-enterprise", name: "Agent Stack Setup — Enterprise", desc: "Enterprise-grade agent infrastructure. Custom swarm, full ARM governance, 90-day transition.", price: "$10,000", color: "amber", label: "Coreweaver" },
  ];
  return (
    <section className="py-24 px-6 lg:px-12 bg-[#0d100d] max-w-[1400px] mx-auto">
      <div className="text-[10px] tracking-[0.2em] uppercase text-[#667066] mb-2">Quick-Start · Academy · Infrastructure</div>
      <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-light text-[#eaf0ea] tracking-tight mb-2">One-Time Packages</h2>
      <p className="text-[14px] text-[#667066] max-w-[560px] mb-10 font-sans">Quick-start service packages, education products, and infrastructure setup fees. Pay once, own it forever.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map(pkg => {
          const c = streamColors[pkg.color];
          return (
            <div key={pkg.key} className="p-6 bg-[#0b1210] border border-white/[0.07] hover:border-white/20 transition-colors">
              <div className="text-[9px] tracking-[0.2em] uppercase mb-2" style={{ color: c.accent }}>{pkg.label}</div>
              <div className="text-base font-semibold text-[#eaf0ea] mb-1.5">{pkg.name}</div>
              <div className="text-[13px] text-[#667066] mb-4 leading-relaxed">{pkg.desc}</div>
              <div className="text-3xl font-light mb-4" style={{ color: c.accent }}>{pkg.price}</div>
              <button onClick={() => { const stream = pkg.key.startsWith("academy-") ? "academy" : pkg.key.startsWith("coreweaver-") ? "coreweaver" : "arm"; trackCta.mutate({ eventName: "cta_click", path: "/", productKey: pkg.key, stream }); checkout.mutate({ productKey: pkg.key }); }} disabled={checkout.isPending}
                className="w-full py-3 border text-[11px] font-semibold tracking-[0.15em] uppercase transition-all"
                style={{ borderColor: c.accent, color: c.accent, background: "transparent" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = c.accent; e.currentTarget.style.color = "#080a08"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.accent; }}>
                {checkout.isPending ? "Loading..." : "Purchase →"}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-12 p-8 bg-[#0b1210] border border-white/[0.07] border-l-2 border-l-[#3ddc84]">
        <div className="text-xl font-light text-[#eaf0ea] mb-3">The ARM Service Standard</div>
        <p className="text-[14px] text-[#667066] leading-[1.7] font-sans">Every engagement begins with an explicit scope, named decision owners, delivery cadence, and a practical next step. Service descriptions do not replace a written statement of work or guarantee a business outcome; the engagement terms define the commitments that apply.</p>
      </div>
    </section>
  );
}

function ContactSection() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", company: "", useCase: "", message: "" });
  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => { toast.success("Message received. We'll be in touch within one business day."); setForm({ firstName: "", lastName: "", email: "", company: "", useCase: "", message: "" }); },
    onError: (err) => toast.error(err.message),
  });
  return (
    <section id="contact" className="py-24 px-6 lg:px-12 bg-[#0d100d] max-w-[1400px] mx-auto">
      <div className="text-[11px] tracking-[0.2em] uppercase text-[#e8a020] mb-4 flex items-center gap-2.5">Contact <div className="flex-1 max-w-[60px] h-px bg-[#a06010]" /></div>
      <h2 className="text-[clamp(1.8rem,3.5vw,3rem)] font-light text-[#eaf0ea] tracking-tight leading-[1.15] mb-8">Ready to deploy?</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <p className="text-[14px] text-[#667066] leading-[1.9] mb-8 font-sans">ARM Agency works with enterprise teams deploying autonomous agents into production. We respond within one business day. A 30-day production pilot is available for qualified teams.</p>
          <div className="space-y-3">
            {[["Email", "ops@arm-agency.com"], ["Response", "Within 1 business day"], ["Demo", "60-minute live session"], ["Pilot", "30-day production pilot"], ["Streams", "5 active revenue streams"]].map(([l, v]) => (
              <div key={l} className="flex gap-4 py-2 border-b border-white/[0.05]"><span className="text-[12px] text-[#667066] w-24 shrink-0">{l}</span><span className="text-[12px] text-[#eaf0ea]">{v}</span></div>
            ))}
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); submitLead.mutate(form); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-1 block">First name</label><input type="text" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required className="w-full bg-transparent border border-white/[0.07] px-3 py-2.5 text-[13px] text-[#eaf0ea] focus:border-[#e8a020] outline-none transition-colors" placeholder="Ada" /></div>
            <div><label className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-1 block">Last name</label><input type="text" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} required className="w-full bg-transparent border border-white/[0.07] px-3 py-2.5 text-[13px] text-[#eaf0ea] focus:border-[#e8a020] outline-none transition-colors" placeholder="Lovelace" /></div>
          </div>
          <div><label className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-1 block">Work email</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="w-full bg-transparent border border-white/[0.07] px-3 py-2.5 text-[13px] text-[#eaf0ea] focus:border-[#e8a020] outline-none transition-colors" placeholder="ada@company.com" /></div>
          <div><label className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-1 block">Organization</label><input type="text" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="w-full bg-transparent border border-white/[0.07] px-3 py-2.5 text-[13px] text-[#eaf0ea] focus:border-[#e8a020] outline-none transition-colors" placeholder="Company name" /></div>
          <div><label className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-1 block">Use case</label>
            <select value={form.useCase} onChange={e => setForm(f => ({ ...f, useCase: e.target.value }))} className="w-full bg-[#080a08] border border-white/[0.07] px-3 py-2.5 text-[13px] text-[#eaf0ea] focus:border-[#e8a020] outline-none transition-colors">
              <option value="">Select one...</option><option value="geo-retainer">GEO Retainer (Swell Marketing)</option><option value="arm-mandate">ARM Mandate Services</option><option value="arctura-membership">Arctura Network Membership</option><option value="academy">Academy / Certification</option><option value="coreweaver">Coreweaver Infrastructure</option><option value="other">Other</option>
            </select>
          </div>
          <div><label className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-1 block">Tell us more</label><textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} className="w-full bg-transparent border border-white/[0.07] px-3 py-2.5 text-[13px] text-[#eaf0ea] focus:border-[#e8a020] outline-none transition-colors resize-none" placeholder="Describe your current infrastructure..." /></div>
          <button type="submit" disabled={submitLead.isPending} className="w-full py-3.5 bg-[#e8a020] text-[#080a08] text-[12px] font-medium tracking-[0.1em] uppercase hover:opacity-85 transition-opacity disabled:opacity-50">{submitLead.isPending ? "Sending..." : "Send Request →"}</button>
        </form>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const subscribe = trpc.newsletter.subscribe.useMutation({ onSuccess: () => { toast.success("Subscribed!"); setEmail(""); }, onError: (err) => toast.error(err.message) });
  return (
    <section className="py-12 px-6 lg:px-12 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 border border-white/[0.07] bg-[#0b1210]">
        <div className="text-[14px] text-[#c8cfc8]"><strong className="text-[#eaf0ea]">Stay current.</strong> New research and case studies delivered fortnightly — no noise, no marketing.</div>
        <form onSubmit={(e) => { e.preventDefault(); if (email) subscribe.mutate({ email }); }} className="flex gap-2 shrink-0">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@company.com" required className="bg-transparent border border-white/[0.07] px-3 py-2 text-[13px] text-[#eaf0ea] focus:border-[#e8a020] outline-none w-64" />
          <button type="submit" disabled={subscribe.isPending} className="px-4 py-2 bg-[#e8a020] text-[#080a08] text-[11px] font-medium tracking-[0.1em] uppercase hover:opacity-85 transition-opacity">{subscribe.isPending ? "..." : "Subscribe →"}</button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 lg:px-12 border-t border-white/[0.07] max-w-[1400px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3"><div className="w-7 h-7 border border-[#e8a020] flex items-center justify-center text-[11px] font-semibold text-[#e8a020]">ARM</div><span className="text-[13px] font-medium text-[#eaf0ea]">ARM Agency</span></div>
          <p className="text-[12px] text-[#667066] leading-relaxed font-sans">Enterprise infrastructure for autonomous AI systems. Five revenue streams, one sovereign infrastructure.</p>
        </div>
        {[
          { title: "Streams", links: [["Swell GEO", "#pricing"], ["ARM Mandate", "#pricing"], ["Arctura Network", "#pricing"], ["Academy", "#pricing"], ["Coreweaver", "#pricing"]] },
          { title: "Platform", links: [["Signal Infrastructure", "#capabilities"], ["Workflow Orchestration", "#capabilities"], ["Fault Tolerance", "#capabilities"], ["Observability", "#capabilities"]] },
          { title: "Resources", links: [["Pricing", "#pricing"], ["Contact", "#contact"], ["Request Demo", "#contact"]] },
          { title: "Ecosystem", links: [["swellmarketing.xyz", "https://swellmarketing.xyz"], ["arctura.network", "https://arctura.network"], ["coreweaverlabs.com", "https://coreweaverlabs.com"], ["arm-agency.com", "https://arm-agency.com"]] },
        ].map(col => (
          <div key={col.title}>
            <div className="text-[10px] tracking-[0.15em] uppercase text-[#667066] mb-3">{col.title}</div>
            <ul className="space-y-2">{col.links.map(([l, h]) => <li key={l}><a href={h} className="text-[12px] text-[#667066] hover:text-[#e8a020] transition-colors no-underline">{l}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-white/[0.07] gap-4">
        <div className="text-[11px] text-[#667066]">© 2026 Autonomous Resource Management LLC — All rights reserved.</div>
        <div className="flex gap-6">{["Privacy Policy", "Terms of Service", "Security"].map(l => <a key={l} href="#" className="text-[11px] text-[#667066] hover:text-[#e8a020] transition-colors no-underline">{l}</a>)}</div>
      </div>
    </footer>
  );
}
