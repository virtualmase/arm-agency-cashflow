import { describe, expect, it } from "vitest";
import { insights } from "./InsightPage";

describe("public stream guides", () => {
  it("publishes an evidence-safe guide and conversion route for every revenue stream", () => {
    const expected = [
      ["ai-infrastructure-audit", "ARM Mandate"],
      ["geo-readiness", "Swell GEO"],
      ["network-participation", "Arctura Network"],
      ["operator-learning-path", "Academy"],
      ["bounded-agent-stack-setup", "Coreweaver"],
      ["ai-discovery-readiness", "Cross-stream operating guide"],
      ["image-seo-fundamentals", "Cross-stream operating guide"],
    ] as const;

    expected.forEach(([slug, stream]) => {
      const guide = insights[slug];
      expect(guide).toBeDefined();
      expect(guide.stream).toBe(stream);
      expect(guide.sections.length).toBeGreaterThanOrEqual(3);
      expect(guide.checklist.length).toBeGreaterThanOrEqual(3);
      expect(guide.deliverables.length).toBeGreaterThanOrEqual(3);
      expect(guide.ctaHref).toMatch(/^\//);
    });
  });

  it("discloses authoritative source links for the evidence-backed AI-discovery guide", () => {
    const guide = insights["ai-discovery-readiness"];
    expect(guide.sources).toHaveLength(3);
    guide.sources?.forEach((source) => expect(source.href).toMatch(/^https:\/\/developers\.google\.com\//));
  });

  it("discloses authoritative search and performance guidance for image SEO", () => {
    const guide = insights["image-seo-fundamentals"];
    expect(guide.sources).toHaveLength(3);
    expect(guide.sources?.[0].href).toBe("https://developers.google.com/search/docs/appearance/google-images");
    expect(guide.sources?.slice(1).every((source) => source.href.startsWith("https://web.dev/"))).toBe(true);
    expect(guide.image).toMatchObject({ src: expect.stringMatching(/^\/manus-storage\//), width: 1200, height: 630 });
    expect(guide.image?.alt).toContain("five image SEO foundations");
  });
});
