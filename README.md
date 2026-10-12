# BEARTRAPS.CA

Professional wildlife equipment website: Next.js App Router, TypeScript, Tailwind CSS and a static export for WHC.ca. GitHub builds and tests the site. No web server needs to run on the owner's Mac.

## Cloud build and hosting

The GitHub Actions workflow uses Node 22 and pnpm 11.25.0 with the committed lockfile. It runs lint, types, catalogue/contact/compliance tests (plus retained internal legacy tests), catalogue integrity checks, production export, route checks, Chromium/Firefox/WebKit interaction tests and Chromium axe accessibility checks. Successful runs package `beartraps-whc.zip` and browser evidence as 14-day artifacts.

Follow [WHC deployment](docs/WHC-DEPLOYMENT.md) to upload to the verified cPanel document root. Phase 1D was deployed and verified on October 12, 2026; see the [deployment record](docs/DEPLOYMENT-PHASE-1D-2026-10-12.md). Product and contact delivery configuration is not inferred from the hosting provider.

## Development and checks (optional)

Node >=22.13 and pnpm 11.25.0:

```sh
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run check:catalogue
pnpm run build
node scripts/check-export.mjs
pnpm exec playwright install --with-deps chromium firefox webkit
pnpm run test:browser
```

`pnpm run dev` is an optional developer preview, not the production hosting setup. All build and browser commands are also run in the cloud workflow.

## Content and catalogue

- `lib/categories.ts`: category copy and sourcing applications.
- `lib/product-schema.ts`: schema, publication/evidence/rights validation and structured data.
- `lib/catalog.ts`: production records. No supplier products have been published; internal fixtures live only under `tests/fixtures/`.
- `app/products/[[...slug]]/page.tsx`: `/products/` directory and static `/products/<slug>/` pages for verified published records. `generateStaticParams` includes the directory plus verified product slugs; there is no fabricated placeholder product route.
- `components/catalogue/`: sourcing/product results, filters, specs, documents and accessory links.
- `scripts/check-catalogue.ts`: local asset existence and hash checks in addition to schema validation.

Add supplier-backed records only after human evidence review. Validate identifiers, variant SKUs, relationships, model-specific claims, image rights and per-province records. No price/Offer/availability schema is invented. Product photography is reserved for a single product-detail placement; cards are text-first to avoid image reuse. Document every new image in `docs/ASSET-USAGE.md` and check prior-site inventories before publishing.

## Product discovery and contact

The latest owner brief replaces the public RFQ/basket model. Visitors browse categories and verified specifications, then contact the team. `/contact/` collects name, optional company/phone, email, subject and message with consent. With no delivery endpoint configured it prepares an explicitly unsent email link. Product enquiry links prefill name/model/SKU and URL. Staff handle quotations, tender documents and orders offline.

`/request-quote/` and `/equipment-package/` are retired with WHC 301 redirects and static/client fallbacks. Their old internal modules are not imported by public pages. The owner confirmed (833) 696-9996 in Phase 1D. `content/business.json` controls call links and organization telephone metadata. Setting `phone` to null hides call links; missing confirmation, malformed numbers or mismatched display text fail validation.

See [contact delivery](docs/CONTACT-DELIVERY.md), [operations](docs/OPERATIONS.md), [supplier intake](docs/CATALOGUE-PUBLISHING.md) and [security assessment](docs/SECURITY.md). CSV/JSON imports bind human review to a content digest and produce a private change manifest alongside the publishable catalogue. No verified supplier records were provided, so the catalogue retains useful category discovery without invented products.

The optional PHP 8.2 bridge is a separate disabled artifact requiring a secured validation/queue/mail upstream. It is not included in the static upload ZIP. Phase 1D is live on WHC. Automatic email delivery remains disabled; preparing a message does not send it.

## Phase 1D workflow

- [Supplier outreach and onboarding SOP](docs/SUPPLIER-ONBOARDING.md): evidence collection and review.
- [Catalogue publication](docs/CATALOGUE-PUBLISHING.md): CSV/JSON templates, digest approval and private import manifests.
- [Release checklist](docs/RELEASE-CHECKLIST.md): artifact/commit/hash review, explicit deployment approval, WHC smoke tests and rollback.
- The static artifact includes a separate `release-manifest.json` companion with archive/file hashes, product count, confirmed phone and contact mode. Upload only the inner website ZIP.
- A separate CI job builds synthetic product records and intercepts contact-service requests to verify detailed pages, filtering, accessibility and receipt/retry behavior. It cannot create release artifacts or send live mail.
- Production browser evidence includes 320/390/768/1440px layouts and lab navigation/resource observations. These are CI measurements, not field Core Web Vitals.

## Reports

- [Phase 1D implementation](docs/PHASE-1D-IMPLEMENTATION.md)
- [Phase 1C implementation](docs/PHASE-1C-IMPLEMENTATION.md)
- [Phase 1B historical implementation](docs/PHASE-1B-IMPLEMENTATION.md)
- [Phase 1A historical review](docs/IMPLEMENTATION.md)
- [Asset register](docs/ASSET-USAGE.md)
