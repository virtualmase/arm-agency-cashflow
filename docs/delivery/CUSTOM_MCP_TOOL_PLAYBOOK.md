# Custom MCP Tool — Delivery Playbook

**Commercial reference:** $500 fixed-fee bounded tool engagement  
**Primary purpose:** Specify, build, test, and hand over one narrowly defined MCP-enabled tool or integration outcome.  
**This is not:** An open-ended platform build, security certification, managed hosting commitment, or a promise that a third-party system will remain available.

## 1. Client-Facing Scope

The engagement delivers one agreed tool behavior or integration boundary. The work is intentionally limited so that a buyer can test a useful capability without being sold an undefined “AI automation project.”

| Included | Excluded unless separately scoped |
| --- | --- |
| Requirements clarification for one use case | Multiple unrelated tools or a broad agent platform |
| Interface and data-boundary specification | Production hosting, monitoring, or 24/7 support |
| Implementation of the agreed tool behavior | Custom front-end application or enterprise identity system |
| Test plan and acceptance walkthrough | Third-party vendor contract negotiation or API guarantees |
| Handoff documentation and stated support boundary | Unbounded iteration after acceptance |

## 2. Entry Criteria

The buyer must identify the user, trigger, permitted action, expected output, data source, access owner, and acceptance test. If any of these are missing, the work begins with a brief specification activity rather than development.

| Requirement | Example of an acceptable answer |
| --- | --- |
| User and job | “A support operator needs to retrieve a defined account summary during a customer call.” |
| Trigger | “An approved query is submitted from the designated tool client.” |
| Permitted action | “Read summary fields from the named system; no write access.” |
| Data boundary | “Only account ID, status, and plan fields; no payment credentials or sensitive notes.” |
| Access owner | “Client technical owner provides least-privilege test credentials or a sandbox.” |
| Acceptance test | “For three approved test IDs, tool returns specified fields and handles not-found safely.” |

## 3. Delivery Sequence

| Step | Owner | Output |
| --- | --- | --- |
| Confirm the one-use-case specification | Delivery and client technical owner | Signed specification note and acceptance test. |
| Define interface and safeguards | Delivery owner | Input/output schema, error behavior, data-access boundary. |
| Build and test | Delivery owner | Working implementation in the agreed environment. |
| Run acceptance walkthrough | Delivery and client owner | Test results, known limitations, correction decisions. |
| Handoff | Delivery and client-success owner | Usage guide, deployment/configuration note, support boundary. |

## 4. Specification Template

| Field | Required detail |
| --- | --- |
| Tool name and version | A clear, stable name and version label. |
| Intended user | Role and authorized environment. |
| Problem statement | The specific task reduced or enabled by the tool. |
| Inputs | Required fields, formats, validation, and invalid-input behavior. |
| Outputs | Required fields, formats, safe error states, and examples. |
| Systems and data | Approved source systems, fields, permissions, and retention constraints. |
| Prohibited actions | Actions the tool must not perform. |
| Logging and observability | What is logged, what is not logged, and who reviews exceptions. |
| Acceptance tests | Test cases, expected results, failure tests, and responsible approver. |
| Handoff boundary | Code/configuration/documentation included and post-acceptance support terms. |

## 5. Acceptance Criteria

The client accepts the delivery when the agreed acceptance tests pass in the agreed environment, the documented data boundary is respected, known limitations are stated, and the client receives the promised handoff material. Any new workflow, interface, access, or policy request is handled as a scope change rather than silently added.

## 6. Quality and Security Checklist

Before handoff, the technical owner confirms least-privilege access, input validation, safe failure behavior, no secrets in documentation or logs, and no prohibited data in outputs. The client-success owner confirms that the client knows the support boundary and named post-handoff contact.

## 7. Handoff Email

> Subject: Custom MCP Tool — Acceptance and Handoff
>
> The agreed tool behavior has been delivered and tested against the acceptance cases in the attached record. The handoff includes the specification, configuration or deployment notes, usage guidance, test results, and known limitations. Please confirm acceptance or identify a specific deviation from the agreed acceptance criteria within the review window. Requests outside the stated specification can be evaluated as a separate scope change.
