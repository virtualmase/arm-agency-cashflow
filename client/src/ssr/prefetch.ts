import type { QueryClient } from "@tanstack/react-query";

export type HeadMeta = {
  title: string;
  description: string;
  canonicalPath?: string;
  noindex?: boolean;
  notFound?: boolean;
};

export type SsrPrefetch = Record<string, never>;

const SITE = "ARM Agency — Autonomous Resource Management";
const DESCRIPTION = "ARM Agency helps accountable teams design, deploy, and govern reliable AI workflows, agent infrastructure, and generative-engine visibility programs.";

export async function prefetchForPath(url: string, _queryClient: QueryClient, _prefetch: SsrPrefetch): Promise<HeadMeta> {
  let path = url.split("?")[0];
  try { path = decodeURI(path); } catch { /* retain raw path */ }
  const clean = path.replace(/\/+$/, "") || "/";
  if (clean === "/") return { title: SITE, description: DESCRIPTION, canonicalPath: "/" };
  const insightMeta: Record<string, HeadMeta> = {
    "/insights/ai-infrastructure-audit": { title: `What an AI Infrastructure Audit Examines · ${SITE}`, description: "A practical decision guide for teams evaluating an AI infrastructure audit.", canonicalPath: "/insights/ai-infrastructure-audit" },
    "/insights/geo-readiness": { title: `GEO Readiness Guide · ${SITE}`, description: "Questions to answer before starting a generative-engine optimization engagement.", canonicalPath: "/insights/geo-readiness" },
    "/insights/network-participation": { title: `Network Participation Guide · ${SITE}`, description: "A practical guide to evaluating a network participation model and its operating boundaries.", canonicalPath: "/insights/network-participation" },
    "/insights/operator-learning-path": { title: `Operator Learning Path Guide · ${SITE}`, description: "A guide for deciding whether education or implementation support is the right next step.", canonicalPath: "/insights/operator-learning-path" },
    "/insights/bounded-agent-stack-setup": { title: `Bounded Agent-Stack Setup Guide · ${SITE}`, description: "A practical guide to evaluating a scoped agent-stack or MCP-enabled implementation.", canonicalPath: "/insights/bounded-agent-stack-setup" },
    "/insights/ai-discovery-readiness": { title: `AI Discovery Readiness Guide · ${SITE}`, description: "A fact-checked guide to durable SEO and AI-discovery foundations without external-platform guarantees.", canonicalPath: "/insights/ai-discovery-readiness" },
  };
  if (insightMeta[clean]) return insightMeta[clean];
  if (clean === "/thank-you") return { title: `Thank you · ${SITE}`, description: "Purchase confirmation and next steps for ARM Agency customers.", noindex: true };
  if (clean === "/portal" || clean === "/admin" || clean === "/satisfaction") {
    return { title: SITE, description: DESCRIPTION, noindex: true };
  }
  return { title: SITE, description: DESCRIPTION, notFound: true };
}
