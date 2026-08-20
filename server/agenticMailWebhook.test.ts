import express from "express";
import { createServer } from "node:http";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Webhook } from "svix";
import { AGENTIC_MAIL_WEBHOOK_PATH, createAgenticMailWebhookRouter } from "./agenticMailWebhook";

const signingSecret = `whsec_${Buffer.from("agentic-mail-test-secret").toString("base64")}`;
const approvedInboxId = "inbox_ops_arm_agency";
const originalEnvironment = {
  signingSecret: process.env.AGENTMAIL_WEBHOOK_SECRET,
  approvedInboxId: process.env.AGENTMAIL_APPROVED_INBOX_ID,
};

afterEach(() => {
  process.env.AGENTMAIL_WEBHOOK_SECRET = originalEnvironment.signingSecret;
  process.env.AGENTMAIL_APPROVED_INBOX_ID = originalEnvironment.approvedInboxId;
});

function signedHeaders(body: string, eventId = "evt_agentic_mail_test") {
  const timestamp = new Date();
  const signature = new Webhook(signingSecret).sign(eventId, timestamp, body);
  return {
    "content-type": "application/json",
    "svix-id": eventId,
    "svix-timestamp": String(Math.floor(timestamp.getTime() / 1000)),
    "svix-signature": signature,
  };
}

async function withServer(app: express.Express, run: (baseUrl: string) => Promise<void>) {
  const server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Test server did not bind to a TCP port");
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

describe("AgentMail inbound webhook", () => {
  it("accepts a valid signed POST as a metadata-only event and exposes deduplication outcome", async () => {
    process.env.AGENTMAIL_WEBHOOK_SECRET = signingSecret;
    process.env.AGENTMAIL_APPROVED_INBOX_ID = approvedInboxId;
    const reserveEvent = vi.fn().mockResolvedValue("accepted");
    const app = express();
    app.use(createAgenticMailWebhookRouter({ reserveEvent }));
    const body = JSON.stringify({
      event_id: "evt_agentic_mail_test",
      event_type: "message.received",
      message: { inbox_id: approvedInboxId, message_id: "msg_1", from_: ["sender@example.com"], subject: "Support request" },
    });

    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}${AGENTIC_MAIL_WEBHOOK_PATH}`, { method: "POST", headers: signedHeaders(body), body });
      expect(response.status).toBe(204);
      expect(response.headers.get("x-agentic-mail-event")).toBe("accepted");
    });

    expect(reserveEvent).toHaveBeenCalledWith(expect.objectContaining({
      eventId: "evt_agentic_mail_test",
      eventType: "message.received",
      inboxId: approvedInboxId,
      messageId: "msg_1",
      sender: "sender@example.com",
      subject: "Support request",
    }));
  });

  it("rejects unsigned or malformed requests and does not reserve an event", async () => {
    process.env.AGENTMAIL_WEBHOOK_SECRET = signingSecret;
    process.env.AGENTMAIL_APPROVED_INBOX_ID = approvedInboxId;
    const reserveEvent = vi.fn();
    const app = express();
    app.use(createAgenticMailWebhookRouter({ reserveEvent }));

    await withServer(app, async (baseUrl) => {
      const invalid = await fetch(`${baseUrl}${AGENTIC_MAIL_WEBHOOK_PATH}`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
      const method = await fetch(`${baseUrl}${AGENTIC_MAIL_WEBHOOK_PATH}`, { method: "GET" });
      expect(invalid.status).toBe(400);
      expect(method.status).toBe(405);
      expect(method.headers.get("allow")).toBe("POST");
    });

    expect(reserveEvent).not.toHaveBeenCalled();
  });

  it("returns a safe duplicate acknowledgement without triggering any external action", async () => {
    process.env.AGENTMAIL_WEBHOOK_SECRET = signingSecret;
    process.env.AGENTMAIL_APPROVED_INBOX_ID = approvedInboxId;
    const reserveEvent = vi.fn().mockResolvedValue("duplicate");
    const app = express();
    app.use(createAgenticMailWebhookRouter({ reserveEvent }));
    const body = JSON.stringify({ event_id: "evt_agentic_mail_duplicate", event_type: "message.received", message: { inbox_id: approvedInboxId, message_id: "msg_2" } });

    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}${AGENTIC_MAIL_WEBHOOK_PATH}`, { method: "POST", headers: signedHeaders(body, "evt_agentic_mail_duplicate"), body });
      expect(response.status).toBe(204);
      expect(response.headers.get("x-agentic-mail-event")).toBe("duplicate");
    });
  });
});
