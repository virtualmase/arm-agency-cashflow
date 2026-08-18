import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "../../..");
const files = [
  "client/index.html",
  "client/public/faq.html",
  "client/public/robots.txt",
  "client/public/sitemap.xml",
  "client/public/llms.txt",
  "server/_core/vite.ts",
];

describe("primary custom-domain public identity", () => {
  it("uses arm-agency.xyz and does not retain temporary-host identity in launch artifacts", () => {
    files.forEach((file) => {
      const source = fs.readFileSync(path.join(projectRoot, file), "utf8");
      expect(source).toContain("https://arm-agency.xyz");
      expect(source).not.toContain("armcashflow-gw96qvq2.manus.space");
    });
  });
});
