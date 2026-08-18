# Swell Publication Response System

## Purpose

This system converts a genuinely new public Swell Marketing resource into a **reviewable ARM editorial opportunity**. Its purpose is to help ARM articulate an original operational perspective, connect readers to useful related properties, and preserve source attribution. It is not a content-scraping, auto-rewrite, auto-publish, citation-fabrication, or backlink-manipulation system.

> **Governing rule:** a Swell article can trigger research and a private editorial brief; it never authorizes copying, close paraphrase, publication, a commercial claim, or an implied endorsement.

## Publication-source assessment — August 18, 2026

Swell Marketing exposes a public XML sitemap at `https://swellmarketing.xyz/sitemap.xml`. It lists resource URLs under `/resources/` and provides `lastmod` values suitable for low-frequency, deterministic change detection. The standard WordPress feed and REST-post paths did not provide usable public discovery output at the time of assessment. No public webhook or callback interface was identified; therefore the workflow must use a controlled sitemap-diff check rather than claim real-time event delivery.

| Input | Proposed use | Boundary |
| --- | --- | --- |
| Swell XML sitemap | Detect a new `/resources/` URL or an updated `lastmod` value. | A sitemap change is an editorial signal, not permission to reproduce a page. |
| Canonical Swell resource URL | Link directly to the original item and record title, publication detection time, and content fingerprint. | Preserve the original author/publisher attribution; do not alter the source URL. |
| Public source page | Extract only the minimal topic context necessary for a private brief. | Do not persist a full article body; use a short attributable excerpt only when genuinely needed for commentary. |
| ARM authority library and properties | Select relevant existing resources and one legitimate internal or affiliated contextual link. | Links must serve a reader decision, not simulate endorsement or force cross-site SEO. |

## Detection and deduplication

The scheduled check should run **once daily** at an off-peak UTC time. It will fetch the sitemap, retain only new `/resources/` paths, and compare each normalized canonical URL plus `lastmod` against durable records. A resource is eligible for a private brief only once per version. If a URL changes later, the system records a new review candidate rather than silently overwriting the prior record.

## Original-response brief

For each eligible item, the system creates a private review packet with the following fields.

| Field | Required control |
| --- | --- |
| Source attribution | Swell title, canonical URL, detected date, and a link to the original. |
| Topic and decision | A one-sentence description of the buyer or operator decision addressed. |
| Original ARM angle | A distinct, context-specific operating perspective that does not restate the source’s structure or wording. |
| Quote policy | Default to no quotation. If quotation is necessary for criticism, commentary, or comparison, use only the shortest attributable excerpt needed; never use a “quote” as a substitute for original analysis. |
| Reputable sources | Primary guidance or named authors appropriate to the factual claim, not a generic list of citations. |
| Contextual links | One to three reader-useful links to relevant ARM guides or affiliated properties, each with a stated reason. |
| Claim review | Explicit prohibited claims, assumptions, and any source/review owner needed before publication. |
| Conversion route | A proportional next step—usually a guide, diagnostic, or qualification discussion, not an automatic sale. |

## Approval boundary

The system may automatically **detect, deduplicate, classify, and draft a private brief**. It may notify the owner that a review packet is ready. It must not automatically publish an ARM page, post to an external social network, email a third party, or present generated text as approved. Publication requires the existing editorial workflow: growth brief, subject-matter review, evidence review, conversion review, and owner-approved publication.

## Post-publication review

Approved responses should be reviewed against qualified conversations, contextual CTA activity, source freshness, and reader confusion—not page count, generic impressions, or claimed influence on third-party systems. A response should be updated, repurposed, or retired when its source, service boundary, or evidence basis is no longer current.
