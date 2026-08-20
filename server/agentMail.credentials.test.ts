import { describe, expect, it } from "vitest";

const AGENTMAIL_LIST_INBOXES_URL = "https://api.agentmail.to/v0/inboxes?limit=1";

describe("AgentMail credential", () => {
  it.skipIf(process.env.AGENTMAIL_CREDENTIAL_VALIDATION !== "1")("authenticates to the read-only inbox listing endpoint without creating or sending mail", async () => {
    const apiKey = process.env.AGENTMAIL_API_KEY;
    expect(apiKey, "AGENTMAIL_API_KEY must be configured").toBeTruthy();

    const response = await fetch(AGENTMAIL_LIST_INBOXES_URL, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(15_000),
    });

    expect(response.status, "AgentMail rejected the configured API credential").toBe(200);
    const payload = await response.json() as { inboxes?: unknown[] };
    expect(Array.isArray(payload.inboxes), "AgentMail did not return the expected inbox list").toBe(true);
  }, 20_000);
});
