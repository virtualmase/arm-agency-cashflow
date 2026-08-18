import type { QueryClient } from "@tanstack/react-query";

export type HeadMeta = {
  title: string;
  description: string;
  canonicalPath?: string;
  noindex?: boolean;
  notFound?: boolean;
  imagePath?: string;
  imageAlt?: string;
};

export type SsrPrefetch = Record<string, never>;

const SITE = "ARM Agency — Autonomous Resource Management";
const DESCRIPTION = "ARM Agency helps accountable teams design, deploy, and govern reliable AI workflows, agent infrastructure, and generative-engine visibility programs.";

export async function prefetchForPath(url: string, _queryClient: QueryClient, _prefetch: SsrPrefetch): Promise<HeadMeta> {
  let path = url.split("?")[0];
  try { path = decodeURI(path); } catch { /* retain raw path */ }
  const clean = path.replace(/\/+$/, "") || "/";
  if (clean === "/") return { title: SITE, description: DESCRIPTION, canonicalPath: "/" };
  if (clean === "/insights") return { title: `Authority Library · ${SITE}`, description: "Decision-led public guides for AI discovery, technical SEO, structured-data governance, accountable AI operations, and operator readiness.", canonicalPath: "/insights" };
  const insightMeta: Record<string, HeadMeta> = {
    "/insights/agentic-commerce-infrastructure": { title: `Agentic Commerce Infrastructure: x402 and AiFi · ${SITE}`, description: "A decision framework connecting x402 payment transport to governed AiFi operations for autonomous agents.", canonicalPath: "/insights/agentic-commerce-infrastructure" },
    "/insights/x402-agent-payments": { title: `x402 Agent Payments Guide · ${SITE}`, description: "How x402 payment requirements, authorization, verification, settlement, and resource delivery fit into agent operations.", canonicalPath: "/insights/x402-agent-payments" },
    "/insights/aifi-governance-controls": { title: `AiFi Governance for Agent Spending · ${SITE}`, description: "Controls for wallets, mandates, budgets, approvals, settlement, and evidence before AI agents can spend.", canonicalPath: "/insights/aifi-governance-controls" },
    "/insights/agent-payment-readiness": { title: `Agent Payment Readiness Score for x402 and AiFi · ${SITE}`, description: "A scored stop, sandbox, or bounded-pilot instrument for teams enabling agent payments and financial autonomy.", canonicalPath: "/insights/agent-payment-readiness", imagePath: "/images/agent-payment-readiness-five-gates.png", imageAlt: "Five architectural verification gates on a bounded agent-payment path" },
    "/insights/ai-infrastructure-audit": { title: `What an AI Infrastructure Audit Examines · ${SITE}`, description: "A practical decision guide for teams evaluating an AI infrastructure audit.", canonicalPath: "/insights/ai-infrastructure-audit" },
    "/insights/geo-readiness": { title: `GEO Readiness Guide · ${SITE}`, description: "Questions to answer before starting a generative-engine optimization engagement.", canonicalPath: "/insights/geo-readiness" },
    "/insights/network-participation": { title: `Network Participation Guide · ${SITE}`, description: "A practical guide to evaluating a network participation model and its operating boundaries.", canonicalPath: "/insights/network-participation" },
    "/insights/operator-learning-path": { title: `Operator Learning Path Guide · ${SITE}`, description: "A guide for deciding whether education or implementation support is the right next step.", canonicalPath: "/insights/operator-learning-path" },
    "/insights/ai-mastery-foundations": { title: `AI Mastery Foundations · ${SITE}`, description: "A source-backed guide to accountable AI capability, human oversight, practical learning, and the right next operating decision.", canonicalPath: "/insights/ai-mastery-foundations" },
    "/insights/ai-mastery-practice-boundaries": { title: `AI Mastery Practice Boundaries · ${SITE}`, description: "A source-backed guide to practice AI on real work with human review, evaluation, escalation, and clear production boundaries.", canonicalPath: "/insights/ai-mastery-practice-boundaries" },
    "/insights/bounded-agent-stack-setup": { title: `Bounded Agent-Stack Setup Guide · ${SITE}`, description: "A practical guide to evaluating a scoped agent-stack or MCP-enabled implementation.", canonicalPath: "/insights/bounded-agent-stack-setup" },
    "/insights/ai-discovery-readiness": { title: `AI Discovery Readiness Guide · ${SITE}`, description: "A fact-checked guide to durable SEO and AI-discovery foundations without external-platform guarantees.", canonicalPath: "/insights/ai-discovery-readiness" },
    "/insights/ai-discovery-measurement": { title: `AI Discovery Measurement Guide · ${SITE}`, description: "A source-backed guide to first-party conversion learning and available Google generative AI discovery signals without invented visibility scores.", canonicalPath: "/insights/ai-discovery-measurement" },
    "/insights/technical-seo-ai-discovery": { title: `Technical SEO for AI Discovery · ${SITE}`, description: "A source-backed guide to public-route, rendering, canonical, linking, and indexability responsibilities without visibility promises.", canonicalPath: "/insights/technical-seo-ai-discovery" },
    "/insights/structured-data-governance": { title: `Structured Data Governance Guide · ${SITE}`, description: "A guide to aligning visible public statements, structured data, named owners, and controlled updates.", canonicalPath: "/insights/structured-data-governance" },
    "/insights/evidence-led-content-architecture": { title: `Evidence-Led Content Architecture · ${SITE}`, description: "A decision-led framework for source-backed authority content, internal links, and claim governance.", canonicalPath: "/insights/evidence-led-content-architecture" },
    "/insights/image-seo-fundamentals": { title: `Image SEO Fundamentals Guide · ${SITE}`, description: "A source-backed guide to accurate image metadata, accessible alt text, responsive formats, and visual discovery foundations.", canonicalPath: "/insights/image-seo-fundamentals", imagePath: "/manus-storage/arm-agency-image-seo-foundations_38f4a915.svg", imageAlt: "ARM Agency image SEO foundations diagram" },
  };
  if (insightMeta[clean]) return insightMeta[clean];
  if (clean === "/thank-you") return { title: `Thank you · ${SITE}`, description: "Purchase confirmation and next steps for ARM Agency customers.", noindex: true };
  if (clean === "/portal" || clean === "/admin" || clean === "/satisfaction") {
    return { title: SITE, description: DESCRIPTION, noindex: true };
  }
  return { title: SITE, description: DESCRIPTION, notFound: true };
}
