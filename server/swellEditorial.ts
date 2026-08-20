export const SWELL_SITEMAP_URL = "https://swellmarketing.xyz/sitemap.xml";
export const SWELL_MONITOR_ID = "swell-marketing-resources";
export const SWELL_RESOURCE_PATH_PREFIX = "/resources/";

export type SwellResourceCandidate = {
  url: string;
  lastmod: string;
};

export type SourceMetadata = {
  title: string;
  description: string | null;
};

export type PrivateEditorialDraft = {
  topic: string;
  buyerDecision: string;
  originalAngle: string;
  brief: string;
  suggestedResearchLeads: Array<{ title: string; url: string; why: string }>;
  suggestedPropertyLinks: Array<{ label: string; url: string; reason: string }>;
  claimNotes: string;
};

export const ALLOWED_ARM_PROPERTY_LINKS = new Set([
  "https://arm-agency.xyz/insights",
  "https://arm-agency.xyz/insights/ai-discovery-readiness",
  "https://arm-agency.xyz/insights/technical-seo-ai-discovery",
  "https://arm-agency.xyz/insights/structured-data-governance",
  "https://arm-agency.xyz/insights/evidence-led-content-architecture",
  "https://arm-agency.xyz/insights/ai-discovery-measurement",
  "https://swellmarketing.xyz/resources/",
  "https://arctura.network/",
  "https://coreweaverlabs.com/",
]);

const isHttpsUrl = (value: string): boolean => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

const outcomeClaimPattern = /\b(guarantee(?:d)?|top[- ]?rank(?:ing|ed)?|drive\s+(?:revenue|conversion)|promise\s+(?:revenue|conversion|outcomes?))\b/i;

/**
 * Reject unsafe draft data before it reaches the private owner queue. This is
 * intentionally a narrow structural guard, not a substitute for human review.
 */
export function validatePrivateEditorialDraft(candidate: SwellResourceCandidate, draft: PrivateEditorialDraft): PrivateEditorialDraft {
  if (!isAllowedSwellResourceUrl(candidate.url)) throw new Error("Unexpected editorial source URL");
  const requiredText = [draft.topic, draft.buyerDecision, draft.originalAngle, draft.brief, draft.claimNotes];
  if (requiredText.some((value) => !value || !value.trim())) throw new Error("Editorial draft is missing a required review field");
  if (outcomeClaimPattern.test(`${draft.originalAngle}\n${draft.brief}`)) throw new Error("Editorial draft contains a disallowed outcome claim");
  if (!/review|approval|verify/i.test(draft.claimNotes)) throw new Error("Editorial draft must retain human-review claim notes");
  if (draft.suggestedResearchLeads.some((lead) => !lead.title.trim() || !lead.why.trim() || !isHttpsUrl(lead.url))) {
    throw new Error("Editorial research leads must be attributable HTTPS sources");
  }
  if (draft.suggestedPropertyLinks.some((link) => !link.label.trim() || !link.reason.trim() || !ALLOWED_ARM_PROPERTY_LINKS.has(link.url))) {
    throw new Error("Editorial property links must use the approved destination menu");
  }
  return draft;
}

const decodeXml = (value: string) => value
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .trim();

export function isAllowedSwellResourceUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:"
      && url.hostname === "swellmarketing.xyz"
      && url.pathname.startsWith(SWELL_RESOURCE_PATH_PREFIX)
      && url.pathname !== "/resources/";
  } catch {
    return false;
  }
}

export function parseSwellResourceSitemap(xml: string): SwellResourceCandidate[] {
  const blocks = xml.match(/<url>[\s\S]*?<\/url>/gi) ?? [];
  const seen = new Set<string>();
  const candidates: SwellResourceCandidate[] = [];

  for (const block of blocks) {
    const locMatch = block.match(/<loc>([\s\S]*?)<\/loc>/i);
    const lastmodMatch = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/i);
    const url = locMatch ? decodeXml(locMatch[1]) : "";
    const lastmod = lastmodMatch ? decodeXml(lastmodMatch[1]) : "";
    if (!url || !lastmod || !isAllowedSwellResourceUrl(url) || seen.has(`${url}|${lastmod}`)) continue;
    seen.add(`${url}|${lastmod}`);
    candidates.push({ url, lastmod });
  }

  return candidates;
}

export function extractSourceMetadata(html: string, fallbackUrl: string): SourceMetadata {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
    ?.replace(/\s+/g, " ")
    .trim() || new URL(fallbackUrl).pathname;
  const description = html.match(/<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)["']/i)?.[1]
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["'](?:description|og:description)["']/i)?.[1]
    || null;
  return { title: decodeXml(title).slice(0, 512), description: description ? decodeXml(description).slice(0, 2000) : null };
}

export const buildSwellEditorialPrompt = (candidate: SwellResourceCandidate, metadata: SourceMetadata) => `
You prepare a PRIVATE editorial review packet for ARM Agency. The source is a Swell Marketing resource. Produce a distinct operating perspective; do not reproduce, summarize section-by-section, closely paraphrase, or quote the source. The record must clearly attribute the source and require owner approval before any publication.

SOURCE
- Publisher: Swell Marketing
- Canonical URL: ${candidate.url}
- Updated: ${candidate.lastmod}
- Title: ${metadata.title}
- Public description: ${metadata.description ?? "No description available"}

TASK
Return JSON only. Frame a buyer decision ARM can help clarify. Keep claims bounded: do not promise search rankings, third-party citations, conversion, compliance, revenue, or outcomes. Do not imply a partnership or endorsement from Swell. Never invent a quote from the source. Suggested external sources are research leads that require human verification before they appear publicly.

Use this fixed menu of reader-useful internal or affiliated destinations; suggest only destinations that genuinely fit:
- https://arm-agency.xyz/insights
- https://arm-agency.xyz/insights/ai-discovery-readiness
- https://arm-agency.xyz/insights/technical-seo-ai-discovery
- https://arm-agency.xyz/insights/structured-data-governance
- https://arm-agency.xyz/insights/evidence-led-content-architecture
- https://arm-agency.xyz/insights/ai-discovery-measurement
- https://swellmarketing.xyz/resources/
- https://arctura.network/
- https://coreweaverlabs.com/

Output schema:
{
  "topic": "short topic",
  "buyerDecision": "the decision this helps a reader make",
  "originalAngle": "a distinct ARM operating angle, not a restatement of the source",
  "brief": "a concise 3-5 section draft brief for an original response",
  "suggestedResearchLeads": [{"title":"primary or reputable source to verify","url":"https://...","why":"why it is relevant"}],
  "suggestedPropertyLinks": [{"label":"destination label","url":"https://...","reason":"reader benefit"}],
  "claimNotes": "claims to avoid and approval notes"
}`;
