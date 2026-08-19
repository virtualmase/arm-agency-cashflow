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
    expect(aiDiscoveryGroup.body).toContain("technical discovery");
    expect(aiDiscoveryGroup.body).toContain("first-party conversion learning");
    expect(aiDiscoveryGroup.body).toContain("external search or model outcomes");
  });

  it("places AI Mastery guides alongside the operator learning path", () => {
    const masteryGroup = insightLibraryGroups.find((group) => group.label === "AI Mastery and Operator Decisions");
    expect(masteryGroup?.slugs).toEqual(expect.arrayContaining([
      "operator-learning-path",
      "ai-mastery-foundations",
      "ai-mastery-practice-boundaries",
    ]));
  });

  it("uses decision language without claiming outcomes for existing content paths", () => {
    const accountableOperations = insightLibraryGroups.find((group) => group.label === "Accountable AI Operations");
    const agenticCommerce = insightLibraryGroups.find((group) => group.label === "Agentic Commerce Operations");
    const operatorDecisions = insightLibraryGroups.find((group) => group.label === "AI Mastery and Operator Decisions");

    expect(accountableOperations?.body).toContain("human review boundaries");
    expect(agenticCommerce?.body).toContain("agent-payment controls");
    expect(operatorDecisions?.body).toContain("AI operator capability");
  });
});
