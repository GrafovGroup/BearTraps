# Internal asset register

| Asset | Source | Website | Page | Placement |
| --- | --- | --- | --- | --- |
| Culvert equipment technical drawing (retired by imagery update) | Original inline SVG formerly in app/page.tsx | BearTraps.ca | / | Former hero; no longer rendered |
| Selected shield logo | Owner-selected option 1; built-in imagegen background extraction | BearTraps.ca | Site shell | Header/footer brand identity, explicitly selected by owner |

Historical Phase 1D state: no stock photographs or fallback photos. The technical drawing is conceptual, not a photograph or a model specification. It makes no completed-project or inventory claim. The brand mark is identity, not content photography. Future separate image placements require distinct originals.

Historical Phase 1D content-image count: one technical drawing, one placement. Portfolio-wide visual duplicate verification has not been completed; prior-site asset inventories were not audited. Check those inventories before publishing image changes. The owner-selected logo was deployed with Phase 1D on October 12, 2026; see DEPLOYMENT-PHASE-1D-2026-10-12.md. No additional content imagery was introduced.

## Phase 1B

No new content image was added. The existing homepage illustration remains a single placement. Product cards and related-equipment cards are text-only; future validated product images render only on their product-detail page. Product asset records require source, rights evidence and SHA-256; build validation rejects missing files, hash mismatches and repeated source/path/hash. This is an exact-duplicate control, not visual similarity or portfolio-wide verification. The latter remains a human audit before publication. Internal fixture records contain no deployed images.

## Selected logo — October 12, 2026

The owner selected option 1 from the five-logo concept set. `public/brand/beartraps-shield.png` is the transparent website derivative: shield, bear, trees, amber sun and BEARTRAPS wordmark, without .ca. It replaces the earlier inline shield and text lockup in the shared header/footer. The footer uses a light brand panel to preserve contrast and the approved colours. Header and footer reuse is the explicitly selected brand identity; it does not authorize content-photo reuse.

- Source concept: `design/logo-options-2026-10-12/01-shield.png` in the original project workspace; generated October 12, 2026.
- Preparation: built-in imagegen, transparent background extraction; no supplier/product imagery.
- Website asset SHA-256: `7f535007dbbf85eaba0c3697cbc6eb50fe59e86ec1c02f76ecc50e5c08baf230`.
- Edit prompt: “Preserve the selected shield, bear head facing right, three pine trees, amber sun and BEARTRAPS wordmark. Remove the surrounding background to transparency; retain opaque white bear details. Tightly frame the horizontal lockup; no .ca, tagline, shadows or redesign.”
- Portfolio-wide prior-site inventory remains unaudited. This is an owner-selected identity asset; no claim of portfolio-wide visual uniqueness is made.


## Page imagery enrichment — October 12, 2026

The owner approved generated imagery. The current image register is `content/page-images.json`: 12 distinct source images, exactly one placement each, across 11 pages. Eight are real public-domain photographs; four were made with the built-in image_gen tool. The homepage technical drawing is replaced. There are no image fallbacks or reused category thumbnails. Responsive WebP variants serve the same placement only. The logo retains the owner's explicit brand-identity reuse exception.

Every entry records the source, rights, original hash, exported file hashes, dimensions, page, placement and neutral alt text. Images describe category contexts; they are not supplier catalogue records, inventory evidence, certified models or company-project evidence. No product has been added to the catalogue.

Photo credits: black bear — Neal Lewis / NPS; culvert trailer and radio telemetry — USGS Interagency Grizzly Bear Study Team; bear cage — Trevor MacInnis, public-domain dedication; campground, shelter and electric fence — NPS Katmai; food locker — NPS Voyageurs. Original source pages and direct downloads are listed in the JSON register. No attribution-restricted photograph is included. USGS pages explicitly mark their selected images Public Domain; NPS asset records give Public domain / Full granting rights.

Generated assets: hero capture enclosure, field supplies, warning sign and trail camera. Full prompts are in `docs/PAGE-IMAGE-PROMPTS.md`; original PNGs are preserved in the owner's project `design/page-images-2026-10-12/`. All website references point to committed `public/images/` WebP files, never the image-generation cache. No customer-facing provenance disclaimers are added.

Validation: post-export check enforces one placement per source/id and all variant hashes. Cloud browser checks load every image at desktop and 320px widths, assert alt text and no horizontal overflow, and save screenshots. See PAGE-IMAGERY-IMPLEMENTATION.md for duplicate-check scope and verification results.
