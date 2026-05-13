import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-04-22.dahlia",
});

export { stripe };

// ── STREAM 1: Swell GEO Retainers (Recurring) ──
// ── STREAM 2: ARM Mandate Services (Recurring) ──
// ── STREAM 3: Arctura Network Memberships (Recurring) ──
// ── STREAM 4: Academy (One-Time) ──
// ── STREAM 5: Coreweaver Infrastructure (Mixed) ──

export type StreamKey = "swell" | "arm" | "arctura" | "academy" | "coreweaver";

export interface ProductConfig {
  key: string;
  name: string;
  description: string;
  priceCents: number;
  interval: "month" | null; // null = one-time
  stream: StreamKey;
  tier?: string;
  featured?: boolean;
}

export const ALL_PRODUCTS: ProductConfig[] = [
  // ── SWELL GEO RETAINERS ──
  {
    key: "swell-geo-starter",
    name: "GEO Starter",
    description: "Foundation signal architecture. 4 articles/month, JSON-LD entity audit + build, monthly LLM citation report.",
    priceCents: 150000,
    interval: "month",
    stream: "swell",
    tier: "Starter",
  },
  {
    key: "swell-geo-growth",
    name: "GEO Growth",
    description: "Full signal governance. 8 articles/month, JSON-LD build + maintenance, weekly LLM citation monitoring, monthly strategy call.",
    priceCents: 250000,
    interval: "month",
    stream: "swell",
    tier: "Growth",
    featured: true,
  },
  {
    key: "swell-geo-scale",
    name: "GEO Scale",
    description: "Maximum signal velocity. 12 articles/month, full GEO Signal Governance, weekly reporting, bi-weekly strategy calls, priority support.",
    priceCents: 350000,
    interval: "month",
    stream: "swell",
    tier: "Scale",
  },
  // ── ARM MANDATE SERVICES ──
  {
    key: "arm-mandate-core",
    name: "ARM Core",
    description: "Mandate chain design, GEO entity graph, agent deployment, Truth Ledger setup, monthly audit.",
    priceCents: 300000,
    interval: "month",
    stream: "arm",
    tier: "Core",
  },
  {
    key: "arm-mandate-pro",
    name: "ARM Pro",
    description: "Full ARM stack deployment + governance. 3 AURE agents, weekly briefings, quarterly strategy sessions.",
    priceCents: 500000,
    interval: "month",
    stream: "arm",
    tier: "Pro",
    featured: true,
  },
  {
    key: "arm-mandate-sovereign",
    name: "ARM Sovereign",
    description: "Enterprise ARM deployment. Full agent swarm, custom mandate chain, dedicated Aureus operator, SLA guarantees.",
    priceCents: 800000,
    interval: "month",
    stream: "arm",
    tier: "Sovereign",
  },
  // ── ARCTURA NETWORK MEMBERSHIPS ──
  {
    key: "arctura-node",
    name: "Node Member",
    description: "Arctura signal network access. ARM Framework license, weekly Signal Report, community access.",
    priceCents: 50000,
    interval: "month",
    stream: "arctura",
    tier: "Node",
  },
  {
    key: "arctura-hub",
    name: "Hub Member",
    description: "Full ARM Framework license, co-creation rights, referral revenue share, monthly council call.",
    priceCents: 100000,
    interval: "month",
    stream: "arctura",
    tier: "Hub",
    featured: true,
  },
  {
    key: "arctura-sovereign",
    name: "Sovereign Node",
    description: "White-label ARM methodology, dedicated agent mesh slot, revenue share on referrals, sovereign governance rights.",
    priceCents: 200000,
    interval: "month",
    stream: "arctura",
    tier: "Sovereign",
  },
  // ── ACADEMY (One-Time) ──
  {
    key: "academy-geo-mastery",
    name: "GEO Mastery Course",
    description: "6 modules, 30+ lessons, JSON-LD templates, LLM citation tracker, community access. Self-paced.",
    priceCents: 29700,
    interval: null,
    stream: "academy",
  },
  {
    key: "academy-arm-cert",
    name: "ARM Framework Certification",
    description: "4-week live cohort. Mandate chain design, agent deployment practicum, certified badge.",
    priceCents: 99700,
    interval: null,
    stream: "academy",
  },
  {
    key: "academy-agency-operator",
    name: "Agency GEO Operator",
    description: "6-week cohort for agency owners. Build a GEO service offering, deploy AURE agents for clients.",
    priceCents: 199700,
    interval: null,
    stream: "academy",
  },
  // ── COREWEAVER INFRASTRUCTURE ──
  {
    key: "coreweaver-managed-starter",
    name: "Managed Agent Infra — Starter",
    description: "Managed GBrain stack + 1 agent. Monthly health checks, uptime monitoring, patch management.",
    priceCents: 50000,
    interval: "month",
    stream: "coreweaver",
  },
  {
    key: "coreweaver-managed-pro",
    name: "Managed Agent Infra — Pro",
    description: "Managed GBrain stack + up to 5 agents. Daily sync, priority support, custom integrations.",
    priceCents: 200000,
    interval: "month",
    stream: "coreweaver",
    featured: true,
  },
  {
    key: "coreweaver-setup-standard",
    name: "Agent Stack Setup — Standard",
    description: "Full GBrain stack deployment + 2 agents. Mandate chain, audit trail, 30-day handoff support.",
    priceCents: 250000,
    interval: null,
    stream: "coreweaver",
  },
  {
    key: "coreweaver-setup-enterprise",
    name: "Agent Stack Setup — Enterprise",
    description: "Enterprise-grade agent infrastructure. Custom swarm architecture, full ARM governance, 90-day managed transition.",
    priceCents: 1000000,
    interval: null,
    stream: "coreweaver",
  },
  // ── ORIGINAL QUICK-START PACKAGES ──
  {
    key: "audit",
    name: "AI Infrastructure Audit",
    description: "Comprehensive audit of your AI infrastructure readiness, signal gaps, and deployment architecture.",
    priceCents: 250000,
    interval: null,
    stream: "arm",
  },
  {
    key: "workshop",
    name: "Mandate Chain Design Workshop",
    description: "Half-day workshop to encode your organization's authority structure into verifiable mandate chains.",
    priceCents: 150000,
    interval: null,
    stream: "arm",
  },
  {
    key: "mcp_tool",
    name: "Custom MCP Tool",
    description: "Custom MCP tool development tailored to your specific workflow and integration requirements.",
    priceCents: 50000,
    interval: null,
    stream: "arm",
  },
];

// Helper to get products by stream
export function getProductsByStream(stream: StreamKey) {
  return ALL_PRODUCTS.filter(p => p.stream === stream);
}

// Helper to get a single product by key
export function getProductByKey(key: string) {
  return ALL_PRODUCTS.find(p => p.key === key);
}

// Format price for display
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString()}`;
}

// Stream metadata for UI
export const STREAMS = {
  swell: { name: "Swell Marketing", label: "Stream 01", color: "signal" },
  arm: { name: "ARM", label: "Stream 02", color: "amber" },
  arctura: { name: "Arctura", label: "Stream 03", color: "violet" },
  academy: { name: "Academy", label: "Stream 04", color: "signal" },
  coreweaver: { name: "Coreweaver", label: "Stream 05", color: "amber" },
} as const;
