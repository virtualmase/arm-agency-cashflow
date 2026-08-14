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

  it("marks unknown routes as noindex and not found", async () => {
    const meta = await prefetchForPath("/not-a-real-route", {} as any, {});
    expect(meta.notFound).toBe(true);
    expect(meta.noindex).toBeUndefined();
  });
});
