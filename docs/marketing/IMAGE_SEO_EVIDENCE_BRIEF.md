# Image SEO and Visual Discovery — Evidence Brief

**Purpose:** Ground ARM Agency’s image SEO recommendations in current official guidance and distinguish durable fundamentals from unsupported visual-search promises.

## Evidence-Based Fundamentals

Google recommends using standard HTML `<img>` elements to help it discover and process images; it states that CSS background images are not indexed in the same way.[1] When responsive-image patterns such as `<picture>` or `srcset` are used, Google recommends retaining an `<img>` fallback with a `src` attribute.[1]

Google supports several image formats in `<img src>`, including JPEG, PNG, WebP, SVG, and AVIF. It advises matching the filename extension to the actual file type.[1] Modern formats such as WebP and AVIF can improve compression compared with older formats, but the correct choice depends on image content, quality needs, support, and measured performance.[2]

Google describes alt text as the most important image metadata attribute. It should be useful, information-rich, and contextual; keyword stuffing creates a poor user experience and may be treated as spam. Google also uses nearby page content, captions, and titles as subject-matter signals.[1]

Google recommends short, descriptive filenames rather than generic names such as `image1.jpg` or `IMG00023.JPG`. Filenames are a light clue, not a substitute for meaningful page context or accurate alt text.[1]

For image previews, Google can use preferred-image metadata such as `og:image` or `primaryImageOfPage`, but selection remains automated. An image should be relevant and representative of the page; structured data must accurately reflect visible content and is not a display guarantee.[1] [4]

| Safe service statement | Statement to avoid |
| --- | --- |
| “We improve image discoverability, accessibility, performance, and visual context using descriptive assets and metadata.” | “WebP or alt text guarantees image rankings, visual search traffic, or AI citations.” |
| “We use filenames such as `arm-agency-founder-professional-headshot.webp` when they accurately describe the image.” | “Every filename should repeat target keywords.” |
| “Alt text describes meaningful image content in page context; decorative images may use empty alt text.” | “Alt text is a hidden keyword field.” |
| “We assess preferred-image metadata and structured data where it accurately represents visible content.” | “Structured image metadata guarantees a preview or rich result.” |

## ARM Asset Standard

| Asset factor | Standard |
| --- | --- |
| File name | Lowercase, hyphen-separated, descriptive, factual, stable. Example: `arm-agency-founder-professional-headshot.webp`. Avoid generic names, keyword lists, unsupported claims, dates unless materially useful, and ambiguous revision suffixes. |
| Format | Prefer SVG for logos/line diagrams where appropriate; use WebP/AVIF for suitable photographic/raster imagery after quality review; retain a compatible fallback where needed. |
| Dimensions | Supply a meaningful intrinsic width and height to reduce layout shift. Match the asset to expected display size and use responsive candidates only when the benefit justifies complexity. |
| Alt text | Describe the meaningful content and function in the surrounding page context. Do not begin with “image of”; do not use keyword strings. Use empty `alt=""` for purely decorative images. |
| Caption/context | Place meaningful images near relevant explanatory content. Use captions when they clarify the visual’s relevance or evidence. |
| Metadata | Use an accurate preferred image in `og:image` / `primaryImageOfPage` only when a page has a representative visual asset. Never use a generic logo as the preferred image for unrelated substantive content. |
| Evidence | Do not manufacture client screens, reviews, dashboards, results, headshots, endorsements, or other visual proof. Mark conceptual diagrams as illustrative where needed. |

## Quality Review Questions

1. Does the image help a buyer understand the page, or is it decorative noise?
2. Does the filename describe what the asset actually depicts?
3. Does the alt text serve a screen-reader user in this specific context?
4. Are width, height, loading strategy, and format appropriate to the placement?
5. Does metadata accurately reflect visible content, and is it needed?
6. Is every claim within the image or caption supported and reviewable?
7. Can the agency explain why this image improves client understanding, accessibility, or performance?

## References

[1] [Google Search Central, “Google image SEO best practices”](https://developers.google.com/search/docs/appearance/google-images)

[2] [web.dev, “Image performance”](https://web.dev/learn/performance/image-performance)

[3] [web.dev, “Use WebP images”](https://web.dev/articles/serve-images-webp)

[4] [Google Search Central, “General structured data guidelines”](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
