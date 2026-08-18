import { afterEach, describe, expect, it } from "vitest";
import { getCanonicalOrigin } from "./canonicalOrigin";

const originalCanonicalOrigin = process.env.CANONICAL_ORIGIN;

afterEach(() => {
  if (originalCanonicalOrigin === undefined) delete process.env.CANONICAL_ORIGIN;
  else process.env.CANONICAL_ORIGIN = originalCanonicalOrigin;
});

describe("canonical-origin runtime configuration", () => {
  it("uses the configured primary custom domain for the public metadata origin", () => {
    process.env.CANONICAL_ORIGIN = "https://arm-agency.xyz/";
    expect(getCanonicalOrigin()).toBe("https://arm-agency.xyz");
  });

  it("falls back to the primary custom domain when configuration is absent", () => {
    delete process.env.CANONICAL_ORIGIN;
    expect(getCanonicalOrigin()).toBe("https://arm-agency.xyz");
  });
});
