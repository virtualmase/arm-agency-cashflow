#!/usr/bin/env node

const commandArgs = process.argv.slice(2);
if (commandArgs[0] === "--") commandArgs.shift();
const [originArg, ...args] = commandArgs;
const canonicalIndex = args.indexOf("--canonical");
const canonicalArg = canonicalIndex >= 0 ? args[canonicalIndex + 1] : undefined;

if (!originArg) {
  console.error("Usage: pnpm verify:launch -- <origin> [--canonical <canonical-origin>]");
  process.exit(1);
}

const origin = new URL(originArg).origin;
const canonicalOrigin = new URL(canonicalArg || origin).origin;
let failures = 0;

function pass(label) {
  console.log(`PASS  ${label}`);
}

function fail(label, detail) {
  failures += 1;
  console.error(`FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
}

function requireHeader(response, name, expected) {
  const actual = response.headers.get(name);
  if (actual === expected) pass(`${name}: ${expected}`);
  else fail(`${name}`, `expected "${expected}", received "${actual || "missing"}"`);
}

async function request(path) {
  try {
    return await fetch(`${origin}${path}`, { redirect: "manual" });
  } catch (error) {
    fail(path, error instanceof Error ? error.message : String(error));
    return null;
  }
}

async function verifyPublicPage(path, expectedText) {
  const response = await request(path);
  if (!response) return;
  if (response.status === 200) pass(`${path} returns 200`);
  else fail(`${path} returns 200`, `received ${response.status}`);
  requireHeader(response, "x-content-type-options", "nosniff");
  requireHeader(response, "x-frame-options", "DENY");
  requireHeader(response, "referrer-policy", "strict-origin-when-cross-origin");
  const body = await response.text();
  if (body.includes(expectedText)) pass(`${path} contains expected public content`);
  else fail(`${path} content`, `missing "${expectedText}"`);
  return body;
}

async function verifyPrivatePage(path) {
  const response = await request(path);
  if (!response) return;
  if (response.status === 200) pass(`${path} returns the application shell`);
  else fail(`${path} response`, `received ${response.status}`);
  requireHeader(response, "x-robots-tag", "noindex, follow");
  requireHeader(response, "content-security-policy", "base-uri 'self'; frame-ancestors 'none'; object-src 'none'");
}

console.log(`\nARM Agency controlled launch verification\nOrigin: ${origin}\nCanonical expectation: ${canonicalOrigin}\n`);

const home = await verifyPublicPage("/", "ARM Agency");
if (home) {
  const expectedCanonical = `<link rel="canonical" href="${canonicalOrigin}/"`;
  if (home.includes(expectedCanonical)) pass("home page canonical matches expected origin");
  else fail("home page canonical", `missing ${expectedCanonical}`);
}

await verifyPublicPage("/insights/ai-discovery-readiness", "AI discovery readiness");
await verifyPublicPage("/faq.html", "Direct answers for");

for (const [path, expectedText] of [
  ["/robots.txt", "User-agent"],
  ["/sitemap.xml", "<urlset"],
  ["/llms.txt", "ARM Agency"],
]) {
  const response = await request(path);
  if (!response) continue;
  if (response.status === 200) pass(`${path} returns 200`);
  else fail(`${path} returns 200`, `received ${response.status}`);
  const body = await response.text();
  if (body.includes(expectedText)) pass(`${path} contains expected content`);
  else fail(`${path} content`, `missing "${expectedText}"`);
}

await verifyPrivatePage("/portal");
await verifyPrivatePage("/admin");
await verifyPrivatePage("/thank-you?session_id=launch-validation");

if (failures) {
  console.error(`\nLaunch verification failed with ${failures} issue(s). Do not begin promotion until they are resolved.\n`);
  process.exitCode = 1;
} else {
  console.log("\nLaunch verification passed. Continue with the manual Stripe, support, capacity, and distribution gates in docs/launch/AUGUST_24_ACTIVATION_RUNBOOK.md.\n");
}
