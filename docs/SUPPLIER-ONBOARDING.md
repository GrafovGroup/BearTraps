# Supplier outreach and product onboarding SOP

Internal operating document. No supplier has been contacted by this implementation. No partnership, inventory, certification, price or delivery promise is inferred.

## Outreach checklist

Prioritize professional live-capture equipment, compatible transport systems, warning signage, eligible consumables, waste/food storage infrastructure, monitoring and exclusion equipment. Ask each prospective supplier for:

- Legal supplier identity, business contact and written permission to offer the exact models in the intended Canadian destinations.
- Manufacturer, exact model/SKU, revision/date, specification sheets, measured dimensions/weight, materials and variant identifiers.
- Trailer/ramp/winch/cradle/tie-down compatibility evidence naming both exact models and any capacity or installation constraints.
- Freight classification, packaging, unloading/site-access requirements and dated lead-time guidance. Obtain a fresh written quote before promising supply.
- Original image files, original source, written publication licence, rights contact, and exact-model documents; record hashes and one content-image placement per original.
- Model-specific certification evidence and issuing-body scope; qualified review of jurisdiction and buyer eligibility for potentially regulated equipment. Unknown eligibility blocks supply.

Do not request passwords. Keep commercial terms, personal contacts and review notes in the private intake directory, outside public hosting and Git.

## Intake and four-eye review

1. Copy the JSON or CSV template into a private workspace. One unique `internalId` per record. Use draft while incomplete; pending-review when evidence is ready. Do not treat a blank template as a product.
2. Fill exact facts with sources. CSV scalar cells hold text/booleans/numbers; `_json` cells contain JSON objects/arrays. Spreadsheet cells containing supplier text should be formatted as text; do not execute formula-like content. The importer never evaluates formulas.
3. Run the digest command after the product fields are final. A reviewer checks supplier authority, exact model/specs, image rights/uniqueness, regulatory restrictions, documents and claims. Record the digest, reviewer, UTC date and five confirmations. A digest binds the review to content; it does not prove the source is true or replace human review.
4. Change status to publishable only after review. Any product edit invalidates that review digest. Archive withdrawn records and remove/update inbound accessory links. A second operator reviews additions, changes and especially removals against the previous published catalogue.
5. Import to a new private output directory. Retain the original intake and manifest together in controlled storage; neither belongs in `public/`. Copy only approved `products.json` into `content/products.json`.
6. Add individually licensed image assets and update ASSET-USAGE.md. Audit exact and visual duplicates against this site and available prior-site inventories; record inaccessible inventories privately. No shared category/fallback photos.
7. Run full CI, inspect rendered product details, model documents, accessory links, contact prefill and metadata. Obtain owner deployment approval. Preserve the reviewed input, manifest and release checksum for rollback/audit.

## Ongoing review

Recheck evidence before material content changes or publication, and when a supplier revises or withdraws a model. Agree an evidence refresh schedule with the catalogue owner. Withdraw unsupported claims promptly; archive products when supply authority ends. Supplier outreach and receipt of documents are staff actions, not automated by this repository.
