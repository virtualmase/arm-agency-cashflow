# Image SEO Baseline Audit

**Audit date:** 2026-08-14

## Current Public-Surface Finding

The current ARM Agency public experience is intentionally typography- and CSS-led. A source audit found no public `<img>`, `<picture>`, CSS `background-image`, `og:image`, or `primaryImageOfPage` usage in the client source. The public asset directory currently contains only platform support files rather than content imagery.

This means there are **no existing raster or SVG content assets to rename, convert to WebP/AVIF, add alt text to, or optimize for image sitemap discovery**. It also means the site does not yet rely on generic stock imagery, simulated customer visuals, or unsupported visual proof. That is a useful baseline to preserve.

| Audit area | Current finding | Current action |
| --- | --- | --- |
| Public content images | None detected | Do not invent imagery merely to satisfy an SEO checklist. |
| `<img>` / `<picture>` metadata | None detected | Apply the image intake template before the first meaningful image is added. |
| CSS background imagery | None detected | Preserve text-led design unless a visual serves a clear explanatory role. |
| Open Graph preferred image | None configured | Add only when ARM has a representative, rights-cleared, truthful page-preview asset. |
| `primaryImageOfPage` or image structured data | None configured | Use only where an image is visible, relevant, and accurately represents page content. |
| Image sitemap | None configured | Reassess when meaningful images exist that are not otherwise discoverable. |
| Filenames / alt text | Not applicable to current public content | Enforce standards for all new assets. |

## Recommended First Visual Assets

The first additions should be useful, sourceable, and constrained rather than decorative volume.

| Priority | Candidate asset | Buyer value | Truth and rights control |
| --- | --- | --- | --- |
| 1 | A rights-cleared professional founder or operator headshot | Supports clear authorship and human accountability where appropriate | Use a factual filename and alt text; obtain subject approval; do not imply endorsement or customer status. |
| 2 | An original, labeled diagnostic decision map | Helps buyers understand Diagnose → Design → Operate | Mark illustrative; base labels on actual service boundaries; avoid client-specific claims. |
| 3 | An original scoped-delivery process diagram | Clarifies handoffs, acceptance, and support boundaries | Keep it product-accurate and update when process changes. |
| 4 | A representative social-preview image for major public guides | Makes shared links identifiable without creating a generic logo preview | Use a guide-specific visual that accurately represents visible page content. |

## Implementation Gate

Before any asset is added, complete `docs/templates/IMAGE_SEO_INTAKE_AND_QA.md`. The visual must then be checked at its rendered route for filename, alt text, visible context, width/height, loading treatment, metadata, claim safety, and rights/consent.

> **Do not optimize a nonexistent or unhelpful image.** The next quality step is to select a small number of meaningful, rights-cleared visual assets—not to add filler or treat filename conventions as a substitute for useful content.
