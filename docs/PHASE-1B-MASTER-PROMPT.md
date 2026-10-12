# BearTraps.ca — Phase 1B Codex Implementation Prompt

## Objective
Implement Phase 1B in GrafovGroup/BearTraps, building on the completed Phase 1A branch `codex/phase-1a-whc`. This is a **code implementation task**, not a strategy document. Inspect `docs/IMPLEMENTATION.md`, `README.md`, `lib/catalog.ts`, `lib/quote.ts`, the existing site and CI workflow before editing. Preserve the forest-green/charcoal/amber government-grade brand, responsive design, WHC.ca static-export architecture, and working routes. Do not overwrite Phase 1A.

## Commercial priorities
1. Professional bear traps: live-capture cage/culvert equipment and only legally permitted mechanical capture equipment. Do not imply that mechanical bear traps are legal for bears throughout Canada.
2. Trap transport: dedicated trailers, cradles, ramps, winches, tie-downs and towing accessories.
3. Bear warning signage: aluminum/reflective, trail closure, temporary, bilingual EN/FR, custom institutional orders.
4. Approved lures, attractants and field consumables, subject to provincial, environmental, shipping and buyer restrictions.
5. Bear-resistant waste bins, food lockers, recycling systems, storage enclosures and park furnishings (bear-resistance claims only with verifiable evidence).
6. Monitoring, remote cameras, solar/GPS accessories, deterrence and exclusion.

## Workstream A — Real catalogue architecture
- Expand the typed product schema and category data to support SKU, manufacturer, model, verified specs, variants, dimensions, weight, transport requirements, freight class, manuals, downloadable spec sheets, supplier record, compliance status, eligible buyer types, provinces served, lead time, related products and compatible accessories.
- Add robust category pages, faceted filters (category, application, supplier when verified, dimensions, features), sorting, keyword search and paginated or accessible progressive results.
- Implement static product detail routes at `/products/[slug]` using `generateStaticParams` and only verified publishable records. Retain static-export compatibility.
- Introduce a clearly separated **internal sample/fixture data set** for tests and UI development; never present invented products, suppliers, stock, prices, model numbers, or certification claims as genuine customer-facing inventory. If verified products are unavailable, show useful category-level sourcing/RFQ experiences and clear non-inventory copy.
- Build reusable product card, specification table, technical-document list, compliance notice, related accessories and quote basket components.
- Add data validation for product records, broken references, missing image rights, duplicate SKUs/slugs, and unsupported certification claims.
- Add product schema.org structured data only when facts are real and appropriate; do not invent Offer pricing or availability.

## Workstream B — RFQ system
- Preserve the Phase 1A persistent multi-category quantity-aware basket, and enhance it for specific product/model or sourcing requests, multiple lines, accessories, bulk quantities and custom specs.
- Support institutional buyer fields: organization, contact, email, phone, province, delivery destination, tender number, bid closing date/time and timezone, delivery deadline, procurement documents reference, technical requirements, freight/installation needs and consent.
- Preserve client-side and server-side Zod validation; add accessibility, clear errors, spam/rate-limit protections, and privacy-conscious data handling.
- **Do not claim a quote has been submitted unless a configured backend actually accepted it.**
- Hosting is WHC static export. Build a documented adapter/interface for a secure WHC-compatible PHP endpoint or vetted external form/email service. Do not add Next.js server routes that are assumed to execute on static hosting.
- Implement actual delivery only if verified endpoint credentials and destination are available through secure environment configuration; otherwise retain a clear disabled state/local RFQ download with a deployment checklist. Never hardcode credentials or assume `info@beartraps.ca` is provisioned. Destination address is TBD by owner.
- If implementing an endpoint, require server validation, spam protection, request-size limits, safe handling of any uploads, logs without sensitive data, and delivery-failure reporting. Avoid storing sensitive procurement documents without configured secure storage and retention policy.
- Add confirmation, error and retry UX only for actual backend states.

## Workstream C — Government procurement
- Improve `/government-procurement` for public-sector RFQs, bulk equipment packages, custom fabrication sourcing, freight, bilingual signage and specification support.
- Add printable/downloadable RFQ summary and professional quote basket line-item format.
- Build tender reference and submission-deadline handling, without suggesting the site automatically bids on tenders.
- Add an equipment package builder: capture equipment + trailer + signage + monitoring + consumables; preserve compatibility and legal review requirements.
- No government-approved supplier badges, public contracts, customer logos or certified claims without documentation.

## Workstream D — Content, UX and imagery
- Continue premium industrial, government-grade UI. Product-first home page: bear traps primary, transport second, signage/lures and bear-resistant infrastructure prominent.
- Improve mobile catalogue and quote flow; keep uppercase navigation and calls to action.
- Use only owned/licensed imagery or original technical illustrations. Track attribution, source and rights in `docs/ASSET-USAGE.md`. No deceptive AI imagery presented as a real manufacturer's exact model.
- Clear product-vs-service distinction. No unsupported national office/warehouse claims.
- Ensure English pages work and leave localization structure ready for future reviewed French content.

## Workstream E — Regulatory controls
- Regulated trapping/capture equipment, mechanical devices, attractants and restricted accessories are **quote-only and human-review-only**. Unknown legal status blocks sale and must never default to approved.
- Maintain a per-product/per-province eligibility and evidence record, with a human verification requirement. Do not encode guesses as legal conclusions.
- No harmful trapping instructions or unlawful-use guidance. No claims of certification or humane performance without substantiation.
- Do not imply bear-resistant benches/tables are tested without verified evidence.

## Workstream F — SEO, QA, deployment readiness
- Keep static Next.js export for WHC. Verify route generation, `.htaccess`, sitemap, metadata, canonical URLs, accessibility, performance and 404 behavior.
- Create useful non-duplicative category copy, buyer-focused technical sections, FAQ only when accurate, and internal links among equipment/accessories.
- Extend automated tests for product data validation, filters, quote basket, restricted checkout, deadline validation, and static export. Keep GitHub Actions passing.
- Document WHC deployment procedure and exactly which parts require a secure backend, domain DNS, verified mail destination and human product sourcing.
- Do not claim live deployment, completed browser QA, delivered emails or passing tests unless actually verified.

## Acceptance criteria
1. Existing Phase 1A site and routes continue to work.
2. Catalogue supports typed product pages for verified records, category filtering/search and accessory relationships.
3. RFQ basket supports product quantities, custom sourcing and government tender fields.
4. Regulated items have no direct checkout and require manual eligibility review.
5. Static export builds for WHC; lint, typecheck, tests and route checks pass in CI.
6. No fabricated products, manufacturer affiliations, stock, pricing, certifications or tender wins.
7. All unconfigured live integrations are visibly nonfunctional rather than pretending success.

## Required completion report
Create `docs/PHASE-1B-IMPLEMENTATION.md` covering: summary, commit/branch, routes and components, product schema and published records, RFQ behavior and delivery status, procurement features, compliance controls, SEO, tests with exact commands/results, screenshots or browser checks actually performed, blockers, configuration still needed, and a prioritized Phase 1C plan. Update README and other relevant documentation.

## Execution
Work on the existing Phase 1A implementation branch or a new feature branch based on it. Do not replace `main` without review. Inspect first, implement incrementally, run all available checks, commit the work and report the outcome.