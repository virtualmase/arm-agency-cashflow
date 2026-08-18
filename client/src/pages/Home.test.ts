import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const homeSource = fs.readFileSync(path.resolve(import.meta.dirname, "Home.tsx"), "utf8");

describe("public image SEO conversion path", () => {
  it("links the Swell GEO offer and qualified contact path to the visual discovery audit", () => {
    expect(homeSource).toContain('secondaryInsightSlug="image-seo-fundamentals"');
    expect(homeSource).toContain("Read the visual discovery guide");
    expect(homeSource).toContain('value="image-seo-audit"');
  });

  it("does not publish unsupported uptime, citation, fault-tolerance, or performance claims", () => {
    ["Byzantine Fault Tolerance", "SLA guarantees + uptime", "Monthly LLM citation report", "Share of Model baseline", "16 Products Live", "30-day production pilot"].forEach((claim) => {
      expect(homeSource).not.toContain(claim);
    });
    expect(homeSource).toContain("Service terms agreed in writing");
    expect(homeSource).toContain("Scope, timing, participants, and any pilot terms are confirmed during qualification.");
  });

  it("routes direct checkout through an authenticated customer account", () => {
    expect(homeSource).toContain("Sign in to create a checkout tied to your customer portal.");
    expect(homeSource).toContain("getLoginUrl()");
    expect(homeSource).toContain("beginAccountBoundCheckout");
  });
});
