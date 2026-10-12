# Supplier intake and publication

Keep supplier intake files outside `public/` and outside Git if commercially sensitive. Copy `templates/catalogue-intake.json`, assign unique internal IDs and collect evidence. No supplier inventory has been provided; `content/products.json` remains empty.

## Status and review

- `draft`: incomplete records; any product fields may be collected.
- `pending-review`: evidence collected; qualified reviewer checks it.
- `publishable`: full product schema, verified publication flags and complete signed review required.
- `archived`: excluded from generated catalogue, like draft and pending-review.

For each publishable entry, `product` must match `lib/product-schema.ts`. `review` must include `reviewer`, ISO UTC `reviewedAt` and all five confirmations set to `true`: `supplier`, `modelSpecifications`, `imageRightsAndUniqueness`, `regulatoryReview`, `documentsAndClaims`. This is a recorded human attestation, not automated verification of the truth of supplier claims.

## Evidence checklist

1. Supplier identity, permission to offer the exact model, source URL, review date and reviewer.
2. Exact SKU/model, dimensions, weight, transport/freight constraints, variants and specification sheet. Leave unknown optional values null; never manufacture evidence.
3. Documents and performance claims scoped to the exact model. Validate links and certification scope with the issuing body.
4. Rights for every image and its single placement; update ASSET-USAGE.md. Check hashes, visual duplicates and accessible prior-site inventories. Record inaccessible inventories privately.
5. Buyer/province eligibility and qualified regulatory review. Unknown status stays unknown and blocks purchase. Publishable means suitable for an RFQ listing, not permission to sell or use a product.
6. Accessories/relationships must refer to other publishable records and have compatibility evidence. Removing a referenced product requires updating its relationships.

## Import and review

Run in a development checkout or controlled cloud environment:

```sh
pnpm import:catalogue supplier-intake.json reviewed-products.json
```

The command validates the entire batch and exclusively creates a new output; it never overwrites an existing file. Draft/pending/archived entries and internal notes/review attestations do not enter the output. Product source evidence remains part of published product data; keep personal reviewer details out of those public evidence fields.

Review the diff, then copy approved output to `content/products.json`. Run catalogue checks, tests and a cloud build/three-engine browser suite before publishing. Imports do not scrape suppliers, upload assets, deploy, or enable checkout. Test fixtures are explicitly synthetic and must never be copied into production.
