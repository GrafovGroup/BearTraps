# Verified catalogue publication

Production `content/products.json` remains empty. Category discovery is live business content; supplier products require evidence. The selected brand logo is preserved. No product photos or supplier records were invented.

## Intake formats and statuses

Use `templates/catalogue-intake.json` or `templates/catalogue-intake.csv`. The templates contain one incomplete draft with no real product. Keep completed files in a private directory, outside Git and `public/` (the default `/supplier-intake/` is ignored).

- `draft`: incomplete facts; not published.
- `pending-review`: awaiting the evidence review; not published.
- `publishable`: complete verified product, exact review digest and all confirmations required.
- `archived`: excluded; check the import manifest for resulting removals and broken relationships.

CSV has one record per row. The authoritative header list is `intakeColumns` in `lib/catalog-csv.ts`. Nested fields use JSON cells: `source_json`, `supplier_json`, `specifications_json`, `dimensions_json`, arrays such as `documents_json` and `compatibilityEvidence_json`, and `review_json`. Use true/false for booleans; use `null` for unknown nullable dimensions, weight, freight class and lead time. Blank cells are omitted, so missing required product fields block publishable records. CSV accepts quoted commas/newlines and escaped double quotes; malformed rows, duplicate/unknown headers and inputs over 10 MB are rejected.

## Evidence and content rules

`product` must match `lib/product-schema.ts`. Required supplier/source records contain an HTTPS source, reviewer role/name and UTC date. Evidence dates cannot be in the future. Every document names the exact `model`. Every related accessory needs `compatibilityEvidence` with `accessorySlug`, matching `accessoryModel` and evidence. Relationship targets must exist in the published batch. Image licence/source/hash/unique-placement rules still apply. Draft intake is private; public product evidence fields must not include confidential or personal details.

Capture, lures and deterrence categories cannot be marked general equipment. Known jurisdiction statuses require evidence; unknown remains unknown and blocks supply. Publication permits informational discovery only, not sale or use. No online checkout or offer/stock/price structured data is generated. Claims in features, specifications and variants receive the same model-evidence gate as title/summary. Validation records evidence requirements; a qualified human must verify its truth and scope.

## Content-bound review

Run these commands in a controlled development checkout or cloud environment:

```sh
pnpm catalogue:digests supplier-intake/batch.json
```

Copy the product's digest into `review.productSha256`. Add `reviewer`, `reviewedAt` and these five true attestations: `supplier`, `modelSpecifications`, `imageRightsAndUniqueness`, `regulatoryReview`, `documentsAndClaims`. Review every field first; the command calculates a digest, it does not grant approval. CSV uses the same review object in `review_json`. Object-key order does not change the digest; content/array changes do. Status and private notes are recorded separately.

```sh
pnpm import:catalogue supplier-intake/batch.csv reviewed-catalogue content/products.json
```

The output directory must not exist. It is created privately (0700), with two 0600 files: `products.json` and `review-manifest.json`. The manifest records input/output hashes, per-record status/digest/review/notes and added/changed/removed slugs relative to the optional previous catalogue. The manifest is private and never copied to public hosting. Save each run under a new directory; prior outputs are never overwritten. This replaces Phase 1C's single-output-file CLI.

Inspect the diff and all removals, then copy only approved products to `content/products.json`. Run catalogue checks and CI. Production checks reject placeholder evidence domains and validate local asset hashes. The isolated `product-fixtures` CI job uses synthetic data only in its own checkout and never creates deployment artifacts.

See [supplier SOP](SUPPLIER-ONBOARDING.md), [release checklist](RELEASE-CHECKLIST.md) and [asset register](ASSET-USAGE.md).
