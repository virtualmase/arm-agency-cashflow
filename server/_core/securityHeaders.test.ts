import { describe, expect, it, vi } from "vitest";
import { applySecurityHeaders, SECURITY_HEADERS } from "./securityHeaders";

describe("baseline HTTP security headers", () => {
  it("sets the expected conservative response headers before continuing", () => {
    const set = vi.fn();
    const next = vi.fn();
    applySecurityHeaders({} as any, { set } as any, next);
    expect(set).toHaveBeenCalledWith(SECURITY_HEADERS);
    expect(next).toHaveBeenCalledOnce();
  });
});
