const DEFAULT_CANONICAL_ORIGIN = "https://arm-agency.xyz";

export function getCanonicalOrigin() {
  return (process.env.CANONICAL_ORIGIN || DEFAULT_CANONICAL_ORIGIN).replace(/\/$/, "");
}
