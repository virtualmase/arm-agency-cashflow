import Stripe from "stripe";

// A non-secret sentinel keeps metadata-only imports testable. Every operation
// must still pass assertStripeConfigured before making a Stripe API request.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_unconfigured", {
  apiVersion: "2026-04-22.dahlia",
});

export { stripe };

export function assertStripeConfigured() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe is not configured");
}

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
    description: "A qualified foundation engagement for entity clarity, structured-data parity, public-surface readiness, and an agreed evidence review cadence.",
    priceCents: 150000,
    interval: "month",
    stream: "swell",
    tier: "Starter",
  },
  {
    key: "swell-geo-growth",
    name: "GEO Growth",
    description: "A qualified operating engagement for technical, evidence, content, authority, and measurement work under a written scope and acceptance criteria.",
    priceCents: 250000,
    interval: "month",
    stream: "swell",
    tier: "Growth",
    featured: true,
  },
  {
    key: "swell-geo-scale",
    name: "GEO Scale",
    description: "A qualified multi-entity or multi-market representation program with documented governance, reporting, support boundaries, and change control.",
    priceCents: 350000,
    interval: "month",
    stream: "swell",
    tier: "Scale",
  },
  // ── ARM MANDATE SERVICES ──
  {
    key: "arm-mandate-core",
    name: "ARM Core",
    description: "A qualified operating engagement for mandate-chain design, decision records, bounded workflows, and a documented governance review cadence.",
    priceCents: 300000,
    interval: "month",
    stream: "arm",
    tier: "Core",
  },
  {
    key: "arm-mandate-pro",
    name: "ARM Pro",
    description: "A qualified governed-implementation engagement with explicit roles, review gates, evidence requirements, recovery paths, and handoff terms.",
    priceCents: 500000,
    interval: "month",
    stream: "arm",
    tier: "Pro",
    featured: true,
  },
  {
    key: "arm-mandate-sovereign",
    name: "ARM Sovereign",
    description: "A qualified enterprise governance engagement with custom mandate boundaries, operator responsibilities, audit evidence, and service terms agreed in writing.",
    priceCents: 800000,
    interval: "month",
    stream: "arm",
    tier: "Sovereign",
  },
  // ── ARCTURA NETWORK MEMBERSHIPS ──
  {
    key: "arctura-node",
    name: "Node Member",
    description: "An eligibility-reviewed network participation tier governed by the current written membership terms, access boundary, and participation expectations.",
    priceCents: 50000,
    interval: "month",
    stream: "arctura",
    tier: "Node",
  },
  {
    key: "arctura-hub",
    name: "Hub Member",
    description: "An eligibility-reviewed collaboration tier whose access, contribution model, commercial terms, and governance rights are confirmed in writing.",
    priceCents: 100000,
    interval: "month",
    stream: "arctura",
    tier: "Hub",
    featured: true,
  },
  {
    key: "arctura-sovereign",
    name: "Sovereign Node",
    description: "A qualified operator relationship with scope, infrastructure boundaries, governance rights, economics, and support obligations agreed in writing.",
    priceCents: 200000,
    interval: "month",
    stream: "arctura",
    tier: "Sovereign",
  },
  // ── ACADEMY (One-Time) ──
  {
    key: "academy-geo-mastery",
    name: "GEO Mastery Course",
    description: "Self-paced learning materials for evidence-led content, structured data, entity clarity, and public-surface readiness without outcome guarantees.",
    priceCents: 29700,
    interval: null,
    stream: "academy",
  },
  {
    key: "academy-arm-cert",
    name: "ARM Framework Certification",
    description: "A live cohort on mandate-chain design and governed implementation practice, delivered under the current published cohort and assessment terms.",
    priceCents: 99700,
    interval: null,
    stream: "academy",
  },
  {
    key: "academy-agency-operator",
    name: "Agency GEO Operator",
    description: "A cohort for agency operators building bounded, evidence-safe representation services with explicit delivery and claim-governance controls.",
    priceCents: 199700,
    interval: null,
    stream: "academy",
  },
  // ── COREWEAVER INFRASTRUCTURE ──
  {
    key: "coreweaver-managed-starter",
    name: "Managed Agent Infra — Starter",
    description: "A qualified managed-infrastructure engagement with an agreed system boundary, operating checks, maintenance responsibilities, and escalation path.",
    priceCents: 50000,
    interval: "month",
    stream: "coreweaver",
  },
  {
    key: "coreweaver-managed-pro",
    name: "Managed Agent Infra — Pro",
    description: "A qualified managed-infrastructure engagement with scoped agents, integrations, review cadence, support boundaries, and change control.",
    priceCents: 200000,
    interval: "month",
    stream: "coreweaver",
    featured: true,
  },
  {
    key: "coreweaver-setup-standard",
    name: "Agent Stack Setup — Standard",
    description: "A bounded agent-stack setup with agreed systems, mandate boundaries, acceptance tests, audit notes, and a documented handoff.",
    priceCents: 250000,
    interval: null,
    stream: "coreweaver",
  },
  {
    key: "coreweaver-setup-enterprise",
    name: "Agent Stack Setup — Enterprise",
    description: "A scoped enterprise implementation with architecture, governance, acceptance tests, transition responsibilities, and support terms agreed in writing.",
    priceCents: 1000000,
    interval: null,
    stream: "coreweaver",
  },
  // ── ORIGINAL QUICK-START PACKAGES ──
  {
    key: "audit",
    name: "AI Infrastructure Audit",
    description: "A bounded assessment of current systems, evidence, constraints, prioritized risks, and next actions, concluded with an executive readout.",
    priceCents: 250000,
    interval: null,
    stream: "arm",
  },
  {
    key: "workshop",
    name: "Mandate Chain Design Workshop",
    description: "A facilitated design engagement with defined pre-work, decision-rights mapping, a written decision record, and agreed follow-through.",
    priceCents: 150000,
    interval: null,
    stream: "arm",
  },
  {
    key: "mcp_tool",
    name: "Custom MCP Tool",
    description: "A bounded MCP implementation with agreed data access, tool behavior, acceptance tests, security constraints, and handoff documentation.",
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
