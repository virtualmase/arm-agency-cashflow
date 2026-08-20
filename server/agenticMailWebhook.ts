import { Router, raw, type Request, type Response } from "express";
import { Webhook } from "svix";
import { reserveAgenticMailWebhookEvent } from "./db";

export const AGENTIC_MAIL_WEBHOOK_PATH = "/api/webhooks/agentic-mail";

type AgentMailMessage = {
  inbox_id?: string;
  message_id?: string;
  from_?: string[];
  subject?: string;
};

export type AgentMailInboundEvent = {
  event_id?: string;
  event_type?: string;
  message?: AgentMailMessage;
};

type VerificationResult =
  | { ok: true; event: Required<Pick<AgentMailInboundEvent, "event_id" | "event_type">> & { message: Required<Pick<AgentMailMessage, "inbox_id" | "message_id">> & AgentMailMessage } }
  | { ok: false; status: number; error: string };

function normalizedHeaders(headers: Request["headers"]): Record<string, string> {
  return Object.fromEntries(Object.entries(headers).flatMap(([key, value]) => {
    if (typeof value === "string") return [[key, value]];
    if (Array.isArray(value)) return [[key, value.join(",")]];
    return [];
  }));
}

export function verifyAgentMailInboundEvent(rawBody: Buffer, headers: Request["headers"], signingSecret: string | undefined, approvedInboxId: string | undefined): VerificationResult {
  if (!signingSecret) return { ok: false, status: 503, error: "agentic_mail_webhook_not_configured" };
  if (!approvedInboxId) return { ok: false, status: 503, error: "agentic_mail_inbox_not_configured" };

  try {
    const event = new Webhook(signingSecret).verify(rawBody.toString("utf8"), normalizedHeaders(headers)) as AgentMailInboundEvent;
    if (event.event_type !== "message.received") return { ok: false, status: 422, error: "unsupported_agentic_mail_event" };
    if (!event.event_id || !event.message?.inbox_id || !event.message.message_id) return { ok: false, status: 422, error: "malformed_agentic_mail_event" };
    if (event.message.inbox_id !== approvedInboxId) return { ok: false, status: 403, error: "unapproved_agentic_mail_inbox" };
    return { ok: true, event: event as VerificationResult extends { ok: true; event: infer E } ? E : never };
  } catch {
    return { ok: false, status: 400, error: "invalid_agentic_mail_signature" };
  }
}

export function createAgenticMailWebhookRouter(dependencies = { reserveEvent: reserveAgenticMailWebhookEvent }) {
  const router = Router();

  router.post(AGENTIC_MAIL_WEBHOOK_PATH, raw({ type: "application/json", limit: "1mb" }), async (req: Request, res: Response) => {
    const verified = verifyAgentMailInboundEvent(
      Buffer.isBuffer(req.body) ? req.body : Buffer.from(""),
      req.headers,
      process.env.AGENTMAIL_WEBHOOK_SECRET,
      process.env.AGENTMAIL_APPROVED_INBOX_ID,
    );
    if (!verified.ok) return res.status(verified.status).json({ error: verified.error });

    try {
      const outcome = await dependencies.reserveEvent({
        eventId: verified.event.event_id,
        eventType: verified.event.event_type,
        inboxId: verified.event.message.inbox_id,
        messageId: verified.event.message.message_id,
        sender: verified.event.message.from_?.[0] ?? null,
        subject: verified.event.message.subject ?? null,
      });
      // Only receipt metadata is stored. No reply, workflow automation, account action,
      // payment, publication, or message-body persistence occurs in this handler.
      return res.status(204).set("X-Agentic-Mail-Event", outcome).send();
    } catch {
      return res.status(500).json({ error: "agentic_mail_event_reservation_failed" });
    }
  });

  router.all(AGENTIC_MAIL_WEBHOOK_PATH, (_req, res) => res.status(405).set("Allow", "POST").json({ error: "method_not_allowed" }));
  return router;
}

export const agenticMailWebhookRouter = createAgenticMailWebhookRouter();
