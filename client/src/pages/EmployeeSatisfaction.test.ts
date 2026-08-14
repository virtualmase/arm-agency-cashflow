import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const pageSource = fs.readFileSync(path.resolve(import.meta.dirname, "EmployeeSatisfaction.tsx"), "utf8");

describe("employee satisfaction data integrity", () => {
  it("uses feedback-derived owner signals instead of unsupported operational telemetry", () => {
    ["99.99%", "BFT Consensus", "Carbon Budget", "All systems operational", "No anomalies detected"].forEach((claim) => {
      expect(pageSource).not.toContain(claim);
    });
    expect(pageSource).toContain("Feedback Review Signals");
    expect(pageSource).toContain("These values describe submitted feedback only");
    expect(pageSource).toContain("trpc.feedback.list.useQuery");
  });
});
