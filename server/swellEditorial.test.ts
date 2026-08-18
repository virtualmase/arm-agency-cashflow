import { describe, expect, it } from "vitest";
import { buildSwellEditorialPrompt, extractSourceMetadata, isAllowedSwellResourceUrl, parseSwellResourceSitemap } from "./swellEditorial";

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
});
