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
  if (clean === "/thank-you") return { title: `Thank you · ${SITE}`, description: "Purchase confirmation and next steps for ARM Agency customers.", noindex: true };
  if (clean === "/portal" || clean === "/admin" || clean === "/satisfaction") {
    return { title: SITE, description: DESCRIPTION, noindex: true };
  }
  return { title: SITE, description: DESCRIPTION, notFound: true };
}
