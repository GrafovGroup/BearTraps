# Phase 1B implementation report

Branch: `codex/phase-1b`, based on Phase 1A `b8c98ff77ddf077747f7bd2cad12dfbe2ff9be0b`.

## Summary

Implements the catalogue architecture, expanded RFQ, procurement package builder and validation described in `PHASE-1B-MASTER-PROMPT.md`. WHC static export and the existing brand are preserved. Phase 1A and main are not replaced.

The owner designated **info@beartraps.ca** as the quote recipient and confirms the mailbox is active. No endpoint credentials or supplier records were supplied. Therefore no products are fabricated and online submission remains disabled; downloads and print/PDF are functional. Mailbox delivery and WHC deployment are not claimed.

## Routes and components

The original 16 routes remain, with two additions:

- `/products/`: searchable/filterable catalogue, using useful category sourcing results when no verified products exist.
- `/equipment-package/`: capture, transport, signage, monitoring and consumables requirement builder.
- `/products/<slug>/`: generated exclusively for verified published records by the optional catch-all route's `generateStaticParams`. No dummy product slug is generated.

Reusable components cover catalogue filters/results, product cards, specifications, supplier documents, compliance notices, related accessories, variant selection, persistent RFQ lines and package choices. Procurement and contact pages link into the new workflow.

## Product data and evidence

Production records: **0**; verified published products: **0**. Internal synthetic fixtures live under `tests/fixtures/` and are not imported into the site.

The validated schema contains SKU/model/manufacturer, supplier source evidence, variants, verified specifications, dimensions, weight, transport/freight requirements, lead time, manuals/spec sheets, applications/features, eligible buyer types, provinces served, province-specific status/evidence, accessories and related products. Publication requires verified supplier/source records and specifications. Model-specific claims require evidence; unknown legal status remains blocked.

Validation rejects duplicate IDs/SKUs/slugs/variant IDs, broken/self references, missing rights evidence, duplicated image sources/paths/hashes and mismatched model claim scopes. Cloud checks verify referenced image files and hashes. Visual similarity and portfolio-wide image checks still require the internal inventory audit; no new content imagery was added in this phase.

Filters support keywords, category, application, verified supplier, features, maximum width and sorting, with progressive results. Supplier/dimension/feature controls appear when verified inventory exists. Product JSON-LD has factual identifiers and no invented price, Offer or stock claim.

## RFQ and delivery

The basket supports category, published product/variant and multiple custom sourcing lines, bulk quantities and per-line specifications. Package selections merge quantities without discarding custom specifications. Legacy Phase 1A selections migrate; corrupt/unknown records are rejected. Contact and project fields remain transient; equipment selections and line specifications persist until cleared.

The form captures organization, buyer type, contact, province, destination, delivery deadline, tender number, closing date/time/time zone, document references, freight/installation requirements and consent. Validation rejects incomplete deadlines, past tender deadlines, impossible dates, DST gaps/repeated times and delivery deadlines before tender closing. No tender bid is automatically submitted.

Download and print/PDF summaries include line-item and procurement details. Online delivery uses a documented HTTPS adapter and requires a positive server receipt. Network/provider uncertainty is not presented as success. Retrying an unchanged form preserves its idempotency key for the form session.

`integrations/rfq-handler.ts` is a separately hosted server contract with Zod validation, origin/method/content-type checks, body limits and mandatory rate-limit/spam/durable-acceptance dependencies. It does not execute under WHC static hosting and does not provision those services. No attachments are accepted, no secrets are hardcoded, and generic errors do not expose provider messages or contact content.

See `RFQ-DELIVERY.md` for backend activation and `WHC-DEPLOYMENT.md` for upload/rollback procedures. The GitHub workflow leaves the endpoint empty.

## Regulatory controls

All equipment remains quote-only; no checkout exists. Per-product/province records require human review and evidence. Unknown/missing/prohibited status and unverified buyers block supply. Even evidenced eligibility returns human-review-required with `purchaseAllowed: false`. These are conservative workflow controls, not legal conclusions or a completed legal rules database.

## SEO and accessibility

Static routes, titles/descriptions, canonicals, sitemap, robots, breadcrumbs and Apache 404 configuration are maintained. New catalogue/package pages have metadata. Form labels, field-level errors, focused error summary, consent controls, keyboard skip link, reduced-motion behavior and a dedicated print layout are included. English remains the only published language; no French translation is falsely claimed.

## Verification

Pre-push checks used already-installed tools without a local web server. Initial TypeScript/lint checks and the first 19 unit tests passed. Final cloud results and commit references will be recorded after the feature build completes.

Cloud commands:

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm test`
- `pnpm run check:catalogue`
- `pnpm run build`
- `node scripts/check-export.mjs`
- `pnpm exec playwright install --with-deps chromium firefox webkit`
- `pnpm run test:browser`

The browser suite covers responsive widths, keyboard skip navigation, catalogue search, custom RFQ lines, basket persistence, tender fields, package merging, print/download and disabled online submission. Chromium axe checks target catalogue, RFQ, procurement, package and bear-trap category pages. Automated checks are not a full human screen-reader or legal audit.

## Remaining dependencies

1. Verified WHC access/document root, DNS/HTTPS and an authorized upload; no live deployment performed.
2. Delivery service credentials for the owner-confirmed active mailbox, durable queue, spam/rate limits, retention policy and actual inbox confirmation before enabling submission.
3. Supplier-backed product/model/specification/evidence and unique licensed image records before publishing inventory.
4. Human compatibility, provincial legal and buyer-authorization review for each regulated supply decision.
5. Reviewed French translations and manual screen-reader/keyboard audit.

## Prioritized Phase 1C

1. Deploy the reviewed static package to the confirmed WHC root, retain a backup and perform live smoke tests.
2. Implement the selected RFQ backend against the documented contract and verify real delivery to the owner's recipient before activation.
3. Onboard the first verified product families; audit sourcing evidence, exact-model accessories, image rights/uniqueness and generated product pages.
4. Complete human accessibility and cross-browser review of real product content; address measured issues.
5. Add reviewed French content and supplier/CMS integrations as confirmed operational needs require.
