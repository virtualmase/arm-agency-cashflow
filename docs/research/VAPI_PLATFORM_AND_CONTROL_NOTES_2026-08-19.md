# Vapi Platform and Control Notes — 2026-08-19

## Verified capability summary

Vapi documents assistant creation, phone-number connection, inbound/outbound calling, reusable custom tools, custom server endpoints, squad handoffs, call artifacts, evaluation/monitoring, and outbound phone campaigns. An assistant requires a Vapi account; API creation requires a Vapi API key. [1]

Vapi's custom tools can call a configured server URL and return results tied to tool-call IDs. The platform recommends reusable tool definitions; its documentation notes that static parameters can supply server-trusted values without exposing them to the model. [2]

Vapi's outbound campaign flow supports recipient CSV uploads, a selected assistant, a selected outbound number, review/execute, call analytics, transcripts, dynamic variables, and concurrency controls. The platform explicitly documents trusted-calling considerations and requires valid E.164 phone numbers. [3]

## ARM Agency implementation boundary

No Vapi account, API credential, configured assistant, approved phone number, or approved `inbox.aigoal` integration is present in the current task configuration. The initial allowed design is therefore an **inbound-only, human-escalated** service assistant architecture. It can prepare knowledge, disclosure, qualification, routing, and audit procedures but cannot make calls, upload recipients, or invoke external actions.

Any later Vapi custom tool must have an authenticated server endpoint, a narrow JSON schema, trusted static parameters, minimum necessary data, logging, a human escalation path, and no permission to charge, refund, modify an account, reveal sensitive data, or make contractual commitments. Any outbound campaign requires the owner-approved recipient list, permissible-contact basis, script, caller identity, opt-out treatment, test cohort, schedule, and stop conditions described in the ARM campaign-marketing procedure.

## References

[1] [Vapi — Assistants quickstart](https://docs.vapi.ai/assistants/quickstart)

[2] [Vapi — Custom tools](https://docs.vapi.ai/tools/custom-tools)

[3] [Vapi — Outbound campaigns overview](https://docs.vapi.ai/outbound-campaigns/overview)
