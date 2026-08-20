# Swell Private-Brief Control Validation — 2026-08-19

## Controlled simulation

A controlled synthetic new-source candidate (`https://swellmarketing.xyz/resources/new-controlled-version/`, version `2026-08-19`) was processed through the private-brief validation path in automated tests. The test used a private decision brief with a primary-source research lead, an approved ARM Insights destination, and a claim note requiring source verification and owner approval before publication.

The validated brief passed only when every required decision field was populated, the source URL used the approved HTTPS Swell resource path, the research lead used an HTTPS source URL, the property destination was in the fixed approved-link menu, the content avoided prohibited outcome claims, and the claim notes retained a human-review boundary.

## Negative controls

The same validation rejected an unapproved external property link and a brief containing a revenue-guarantee claim. Existing owner-only queue tests additionally confirm that non-admin users cannot access review data or change review status, while an admin approval status update does not create a public page.

## Manual-publication gate

The persisted review schema defaults every created non-baseline record to `pending_review`, and the scheduled monitor writes a private review record before notifying the owner. No handler in this workflow publishes content. Publication remains a separate owner-controlled action, with attribution, citations, links, claims, and publication review required at the queue stage.

| Control | Evidence | Result |
| --- | --- | --- |
| Detection and version deduplication | Sitemap parser test admits only secure Swell resource URLs and removes duplicate `(URL, lastmod)` versions | Pass |
| Source attribution | Source URL, last-modified date, title, and public description are preserved separately from the private brief | Pass |
| Originality boundary | Prompt and validator require a distinct angle and prohibit reproduction, close paraphrase, invented quotes, or false endorsement | Pass |
| Research-source and property-link controls | Validator permits HTTPS research leads and only the approved destination menu | Pass |
| Claim safety | Validator rejects required-field gaps, absent review notes, and prohibited outcome claims | Pass |
| Owner-only manual approval | Review status defaults to `pending_review`; queue access/update is administrator gated and approval has no publication side effect | Pass |

## Test evidence

`pnpm vitest run server/swellEditorial.test.ts server/routers.test.ts` completed successfully with **47 passing assertions** after the control validation was added. This validates the controlled private-brief path; it does not authorize automatic outreach or publication.

## Scheduled-monitor persistence simulation

The scheduled monitor was additionally executed with an injected, simulated new Swell source version. The end-to-end monitor test verified that the workflow stores the source URL, source version, source title, generated private brief, research leads, approved ARM link, and claim notes through the private-review creation boundary. It deliberately does **not** set a status on insertion, so the schema default remains `pending_review`; it also produces no publication call or public route. The only side effect after successful creation is an owner notification naming the item as a private, unapproved review brief.

`pnpm vitest run server/scheduled.swell.test.ts server/swellEditorial.test.ts server/routers.test.ts` completed successfully with **48 passing assertions**. This test is a deterministic control simulation: it uses no live source, no live LLM call, no external notification, and no database insert.
