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
    "/insights/ai-infrastructure-audit": { title: `What an AI Infrastructure Audit Examines · ${SITE}`, description: "A practical decision guide for teams evaluating an AI infrastructure audit.", canonicalPath: "/insights/ai-infrastructure-audit" },
    "/insights/geo-readiness": { title: `GEO Readiness Guide · ${SITE}`, description: "Questions to answer before starting a generative-engine optimization engagement.", canonicalPath: "/insights/geo-readiness" },
    "/insights/network-participation": { title: `Network Participation Guide · ${SITE}`, description: "A practical guide to evaluating a network participation model and its operating boundaries.", canonicalPath: "/insights/network-participation" },
    "/insights/operator-learning-path": { title: `Operator Learning Path Guide · ${SITE}`, description: "A guide for deciding whether education or implementation support is the right next step.", canonicalPath: "/insights/operator-learning-path" },
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
