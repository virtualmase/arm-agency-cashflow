import { describe, expect, it } from "vitest";
import { buildSwellEditorialPrompt, extractSourceMetadata, isAllowedSwellResourceUrl, parseSwellResourceSitemap, validatePrivateEditorialDraft } from "./swellEditorial";

describe("Swell editorial source safeguards", () => {
  it("accepts only direct Swell resource URLs over HTTPS", () => {
    expect(isAllowedSwellResourceUrl("https://swellmarketing.xyz/resources/representation-foundations/")).toBe(true);
    expect(isAllowedSwellResourceUrl("https://swellmarketing.xyz/resources/")).toBe(false);
    expect(isAllowedSwellResourceUrl("https://example.com/resources/representation-foundations/")).toBe(false);
    expect(isAllowedSwellResourceUrl("http://swellmarketing.xyz/resources/representation-foundations/")).toBe(false);
  });

  it("parses only resource URLs with versioned sitemap metadata and deduplicates source versions", () => {
    const xml = `<urlset><url><loc>https://swellmarketing.xyz/resources/one/</loc><lastmod>2026-08-18</lastmod></url><url><loc>https://swellmarketing.xyz/resources/one/</loc><lastmod>2026-08-18</lastmod></url><url><loc>https://swellmarketing.xyz/about/</loc><lastmod>2026-08-18</lastmod></url></urlset>`;
    expect(parseSwellResourceSitemap(xml)).toEqual([{ url: "https://swellmarketing.xyz/resources/one/", lastmod: "2026-08-18" }]);
  });

  it("extracts only public metadata, not an article body", () => {
    const metadata = extractSourceMetadata(`<html><head><title>Representation foundations</title><meta name="description" content="Short public description"></head><body><article>Long article body should not be persisted here.</article></body></html>`, "https://swellmarketing.xyz/resources/one/");
    expect(metadata).toEqual({ title: "Representation foundations", description: "Short public description" });
  });

  it("requires attribution, originality, no invented quotation, no endorsement, and owner approval in the editorial brief prompt", () => {
    const prompt = buildSwellEditorialPrompt({ url: "https://swellmarketing.xyz/resources/one/", lastmod: "2026-08-18" }, { title: "One", description: "Description" });
    expect(prompt).toContain("Swell Marketing");
    expect(prompt).toContain("do not reproduce");
    expect(prompt).toContain("Never invent a quote");
    expect(prompt).toContain("Do not imply a partnership or endorsement");
    expect(prompt).toContain("require owner approval");
  });

  it("accepts a controlled new-source private brief only when its source, links, claims, and review boundary are safe", () => {
    const candidate = { url: "https://swellmarketing.xyz/resources/new-controlled-version/", lastmod: "2026-08-19" };
    const result = validatePrivateEditorialDraft(candidate, {
      topic: "Controlled operating validation",
      buyerDecision: "Decide whether a public-information workflow needs human review.",
      originalAngle: "A decision-record perspective for responsible public information operations.",
      brief: "Draft a private decision brief with review checkpoints and no performance promise.",
      suggestedResearchLeads: [{ title: "NIST AI RMF", url: "https://www.nist.gov/itl/ai-risk-management-framework", why: "Primary governance reference to verify." }],
      suggestedPropertyLinks: [{ label: "ARM Insights", url: "https://arm-agency.xyz/insights", reason: "Provides contextual decision resources." }],
      claimNotes: "Private review only; verify sources and obtain owner approval before any publication.",
    });
    expect(result.suggestedPropertyLinks[0].url).toBe("https://arm-agency.xyz/insights");
  });

  it("rejects controlled new-source briefs with an unapproved link or an outcome claim", () => {
    const candidate = { url: "https://swellmarketing.xyz/resources/new-controlled-version/", lastmod: "2026-08-19" };
    const baseDraft = {
      topic: "Controlled operating validation",
      buyerDecision: "Decide whether a public-information workflow needs human review.",
      originalAngle: "A decision-record perspective for responsible public information operations.",
      brief: "Draft a private decision brief with review checkpoints.",
      suggestedResearchLeads: [],
      suggestedPropertyLinks: [],
      claimNotes: "Private review only; verify sources and obtain owner approval before any publication.",
    };
    expect(() => validatePrivateEditorialDraft(candidate, { ...baseDraft, suggestedPropertyLinks: [{ label: "Unsafe", url: "https://example.com/", reason: "Not approved." }] })).toThrow("approved destination menu");
    expect(() => validatePrivateEditorialDraft(candidate, { ...baseDraft, brief: "This will guarantee revenue growth." })).toThrow("disallowed outcome claim");
  });
});
