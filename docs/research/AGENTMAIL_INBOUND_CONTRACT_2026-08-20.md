# AgentMail Inbound Contract — 2026-08-20

## Provider selection status

The user referenced `inbox.aigoal`, but no official documentation for that exact service was located. AgentMail is the verified candidate because the project already has an AgentMail secret configured and its official documentation supports API-managed agent inboxes and inbound webhook events. This document defines the contract before any endpoint registration.

## Endpoint and event boundary

The dedicated production endpoint will be:

`POST https://arm-agency.xyz/api/webhooks/agentic-mail`

The initial subscription must be limited to **inbound message-received events** for the approved agent inbox. It must not subscribe to sending or lifecycle events unless a specific later workflow requires them. AgentMail documents webhook creation with event types and idempotent client IDs, and documents a 1 MB payload limit that may require authenticated message hydration for complete message content. [1]

## Trust and processing contract

| Concern | Initial control |
| --- | --- |
| Delivery authentication | Capture the exact raw request body and verify the provider-issued webhook signature before parsing or persisting message content. AgentMail explicitly requires the exact body for signature verification. [2] |
| Inbox scope | Accept messages only for the dedicated approved AgentMail inbox; reject unrelated mailbox identifiers and unknown event types. |
| Data minimization | Record the event ID, delivery time, sender address, subject, and workflow status. Do not store message bodies or attachments unless a named support workflow requires them and retention is approved. |
| Replay/deduplication | Store or cache the provider event/message ID before processing; acknowledge duplicate deliveries without repeating an action. |
| External actions | The webhook may classify and prepare a private support handoff only. It must not auto-reply, publish content, begin outreach, charge/refund, change accounts, alter subscriptions, or change pricing. |
| Human review | Ambiguous, sensitive, commercial, account, legal, payment, security, or customer-access messages must be routed to a named human owner before any response. |
| Operational response | Return a narrow 2xx acknowledgement only after authentication and deduplication. Failed validation receives a non-2xx result so the provider can surface the delivery error. |

## Credential separation

`AGENTMAIL_API_KEY` may make read-only configuration and inbox-management requests. `AGENTMAIL_WEBHOOK_SECRET`, if AgentMail issues a distinct secret, is only for signature verification. The API key must never be accepted as a webhook signature and neither secret may be exposed to the client, logs, or stored webhook records.

## Read-only credential check

The official AgentMail API provides `GET https://api.agentmail.to/v0/inboxes` with bearer authentication. The project uses `limit=1` only to validate credentials without creating an inbox or sending mail. [3]

## References

[1] [AgentMail — Webhook Setup Guide](https://www.agentmail.to/docs/webhook-setup)

[2] [AgentMail — Verifying Webhooks](https://www.agentmail.to/docs/webhook-verification)

[3] [AgentMail — List Inboxes API](https://www.agentmail.to/docs/api-reference/inboxes/list)
