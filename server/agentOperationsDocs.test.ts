import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const docsRoot = path.resolve(import.meta.dirname, "../docs");

function readDocument(relativePath: string) {
  return fs.readFileSync(path.join(docsRoot, relativePath), "utf8");
}

describe("future-agent operating documentation", () => {
  it("keeps the operating-system map and its core role procedures available", () => {
    const index = readDocument("agent-operations/README.md");
    [
      "PRODUCT_AND_OFFER_OPERATING_GUIDE.md",
      "SALES_AND_QUALIFICATION_PROCEDURE.md",
      "CUSTOMER_SERVICE_PROCEDURE.md",
      "CAMPAIGN_MARKETING_PROCEDURE.md",
      "AGENT_GOVERNANCE_AND_ESCALATION.md",
      "OWNER_TRANSITION_AND_EXIT_READINESS_PLAN.md",
    ].forEach((name) => expect(index).toContain(name));
  });

  it("preserves the owner-approval boundary for external, financial, and account actions", () => {
    const governance = readDocument("agent-operations/AGENT_GOVERNANCE_AND_ESCALATION.md");
    expect(governance).toContain("Required approver");
    expect(governance).toContain("Never charge, refund, transfer, change pricing");
    expect(governance).toContain("No external publication or send");
  });

  it("keeps the exit plan evidence-led and free of unsupported transaction value claims", () => {
    const entityCard = readDocument("strategy/ARM_AGENCY_ENTITY_CARD.md");
    const exitPlan = readDocument("strategy/OWNER_TRANSITION_AND_EXIT_READINESS_PLAN.md");
    expect(entityCard).toContain("Treat the business as private");
    expect(exitPlan).toContain("No transaction value");
    expect(exitPlan).toContain("not a valuation");
    expect(exitPlan).toContain("First 90-day action register");
  });
});
