import type { Request, Response } from "express";
import type { SsrPrefetch } from "../../client/src/ssr/prefetch";

// The public marketing surface is intentionally static today. Keeping this
// allowlist empty prevents private tRPC data from ever being embedded in HTML.
export async function buildSsrPrefetch(_req: Request, _res: Response): Promise<SsrPrefetch> {
  return {};
}
