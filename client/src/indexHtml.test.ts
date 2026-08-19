import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("public document head", () => {
  it("exposes the configured Builder base application identifier", () => {
    const documentHtml = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
    expect(documentHtml).toContain('<meta name="base:app_id" content="6a8553b86ea1f57fed3338a0" />');
  });
});
