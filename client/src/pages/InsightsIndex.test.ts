import { describe, expect, it } from "vitest";
import { insights } from "./InsightPage";
import { insightLibraryGroups } from "./InsightsIndex";

describe("public authority library", () => {
  it("groups every published guide into a decision-led content path", () => {
    const librarySlugs = insightLibraryGroups.flatMap((group) => group.slugs);
    expect(new Set(librarySlugs).size).toBe(Object.keys(insights).length);
    librarySlugs.forEach((slug) => expect(insights[slug]).toBeDefined());
  });

  it("keeps the AI Discovery Operating System cluster connected at library level", () => {
    const aiDiscoveryGroup = insightLibraryGroups[0];
    expect(aiDiscoveryGroup.slugs).toEqual(expect.arrayContaining([
      "ai-discovery-readiness",
      "technical-seo-ai-discovery",
      "structured-data-governance",
      "evidence-led-content-architecture",
      "ai-discovery-measurement",
      "image-seo-fundamentals",
      "geo-readiness",
    ]));
  });

  it("places AI Mastery guides alongside the operator learning path", () => {
    const masteryGroup = insightLibraryGroups.find((group) => group.label === "AI Mastery and Operator Decisions");
    expect(masteryGroup?.slugs).toEqual(expect.arrayContaining([
      "operator-learning-path",
      "ai-mastery-foundations",
      "ai-mastery-practice-boundaries",
    ]));
  });
});
