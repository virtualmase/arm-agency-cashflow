import { describe, expect, it } from "vitest";
import { prefetchForPath } from "./prefetch";

describe("SSR indexing policy", () => {
  it("marks authenticated and operational routes as noindex", async () => {
    const meta = await prefetchForPath("/portal", {} as any, {});
    expect(meta.noindex).toBe(true);
  });

  it("keeps public authority guides indexable with a canonical path", async () => {
    const meta = await prefetchForPath("/insights/ai-discovery-readiness", {} as any, {});
    expect(meta.noindex).toBeUndefined();
    expect(meta.canonicalPath).toBe("/insights/ai-discovery-readiness");
  });

  it("keeps the public authority library indexable with its canonical path", async () => {
    const meta = await prefetchForPath("/insights", {} as any, {});
    expect(meta.noindex).toBeUndefined();
    expect(meta.canonicalPath).toBe("/insights");
    expect(meta.notFound).toBeUndefined();
  });

  it("keeps the AI Discovery Operating System spokes indexable with their own canonicals", async () => {
    const routes = [
      "/insights/technical-seo-ai-discovery",
      "/insights/structured-data-governance",
      "/insights/evidence-led-content-architecture",
      "/insights/ai-discovery-measurement",
      "/insights/ai-mastery-foundations",
      "/insights/ai-mastery-practice-boundaries",
    ];

    for (const route of routes) {
      const meta = await prefetchForPath(route, {} as any, {});
      expect(meta.noindex).toBeUndefined();
      expect(meta.canonicalPath).toBe(route);
      expect(meta.notFound).toBeUndefined();
    }
  });

  it("marks unknown routes as noindex and not found", async () => {
    const meta = await prefetchForPath("/not-a-real-route", {} as any, {});
    expect(meta.notFound).toBe(true);
    expect(meta.noindex).toBeUndefined();
  });
});
