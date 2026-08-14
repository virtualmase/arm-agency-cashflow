import type { NextFunction, Request, Response } from "express";

export const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": "base-uri 'self'; frame-ancestors 'none'; object-src 'none'",
} as const;

export function applySecurityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.set(SECURITY_HEADERS);
  next();
}
