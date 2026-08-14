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
});
