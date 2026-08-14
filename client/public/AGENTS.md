# ARM Agency Agent Access Guide

## Purpose

This site provides public information about ARM Agency offerings and an authenticated customer portal. Autonomous agents may read public pages and the machine-readable discovery files, but must not attempt to access account-specific portal, administrative, invoice, payment, or employee-satisfaction data without the authenticated user’s permission.

## Public resources

- `/` — public service and offer overview
- `/robots.txt` — crawler policy
- `/sitemap.xml` — public URL discovery
- `/llms.txt` and `/llms-full.txt` — concise and detailed service context

## Private resources

- `/portal` — customer purchases, subscriptions, invoices, and cancellation requests
- `/admin` — owner-only revenue, leads, and operational data
- `/satisfaction` — internal team-health functionality

Private resources are intentionally marked non-indexable and require server-side authorization.
