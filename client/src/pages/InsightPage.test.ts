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
      ["technical-seo-ai-discovery", "AI Discovery Operating System"],
      ["structured-data-governance", "AI Discovery Operating System"],
      ["evidence-led-content-architecture", "AI Discovery Operating System"],
      ["ai-discovery-measurement", "AI Discovery Operating System"],
      ["ai-mastery-foundations", "Academy"],
      ["ai-mastery-practice-boundaries", "Academy"],
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

  it("interlinks the AI Discovery Operating System through citation-backed technical and content spokes", () => {
    const hub = insights["ai-discovery-readiness"];
    expect(hub.related?.map((item) => item.slug)).toEqual(expect.arrayContaining([
      "technical-seo-ai-discovery",
      "structured-data-governance",
      "evidence-led-content-architecture",
      "ai-discovery-measurement",
    ]));

    ["technical-seo-ai-discovery", "structured-data-governance", "evidence-led-content-architecture", "ai-discovery-measurement"].forEach((slug) => {
      const guide = insights[slug];
      expect(guide.sources?.length).toBeGreaterThanOrEqual(3);
      expect(guide.sections.some((section) => section.citations?.length)).toBe(true);
      expect(guide.related?.some((item) => item.slug === "ai-discovery-readiness")).toBe(true);
    });
  });

  it("keeps the AI Mastery guides source-backed and linked to Academy, diagnostic, and bounded-delivery decisions", () => {
    ["ai-mastery-foundations", "ai-mastery-practice-boundaries"].forEach((slug) => {
      expect(insights[slug].sources?.map((source) => source.href)).toEqual(expect.arrayContaining([
        "https://www.nist.gov/itl/ai-risk-management-framework",
        "https://airc.nist.gov/airmf-resources/playbook/govern/",
        "https://oecd.ai/en/wonk/socio-technical-approach-ai-literacy",
      ]));
      expect(insights[slug].related?.length).toBeGreaterThanOrEqual(3);
    });
    expect(insights["ai-mastery-foundations"].related?.map((item) => item.slug)).toContain("operator-learning-path");
    expect(insights["ai-mastery-practice-boundaries"].related?.map((item) => item.slug)).toContain("bounded-agent-stack-setup");
  });
});
