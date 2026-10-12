# BEARTRAPS.CA

Professional wildlife equipment website: Next.js App Router, TypeScript, Tailwind CSS and a static export for WHC.ca. GitHub builds and tests the site. No web server needs to run on the owner's Mac.

## Cloud build and hosting

The GitHub Actions workflow uses Node 22 and pnpm 11.25.0 with the committed lockfile. It runs lint, types, data/RFQ/compliance/delivery tests, catalogue integrity checks, production export, route checks, Chromium/Firefox/WebKit interaction tests and Chromium axe accessibility checks. Successful runs package `beartraps-whc.zip` and browser evidence as 14-day artifacts.

Follow [WHC deployment](docs/WHC-DEPLOYMENT.md) to upload to the verified cPanel document root. No deployment has been performed by this feature branch. Product and RFQ delivery configuration is not inferred from the hosting provider.

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

## Procurement and RFQ

`/equipment-package/` combines category requirements without implying compatibility. The basket supports categories, published products/variants, custom sourcing, quantities and line specifications. Existing Phase 1A baskets migrate automatically. Contact/project fields remain in memory; equipment and line specifications persist on the device until cleared.

`/request-quote/` collects buyer and tender details, validates closing date/time/time zone (including DST ambiguity), and generates a text or printable RFQ. It never submits a tender bid. The owner selected **info@beartraps.ca** as the intended recipient. The owner confirms the mailbox is active. Automated backend delivery has not been configured or tested.

Online submission is disabled by default. [RFQ delivery integration](docs/RFQ-DELIVERY.md) describes the adapter, independent server contract, required durable queue/rate limiting/spam verification and activation procedure. `integrations/rfq-handler.ts` does not execute on static hosting. No API key belongs in the client bundle.

## Reviews

- [Phase 1A review](docs/IMPLEMENTATION.md)
- [Phase 1B implementation report](docs/PHASE-1B-IMPLEMENTATION.md)
- [Internal asset register](docs/ASSET-USAGE.md)

## Phase 1C

Supplier intake now supports four review statuses and JSON import into `content/products.json`; see [publication workflow](docs/CATALOGUE-PUBLISHING.md). Mobile catalogue/category pages offer a persistent RFQ shortcut. [Operations](docs/OPERATIONS.md) covers measurement, lead handling, privacy, delivery acceptance and rollback. The optional PHP 8.2 bridge is a separate, disabled artifact requiring a secured validation/queue/mail upstream; see [RFQ delivery](docs/RFQ-DELIVERY.md).

No verified supplier records or live online delivery have been added. Phase 1B remains the deployed site until the Phase 1C artifact is approved. See [Phase 1C report](docs/PHASE-1C-IMPLEMENTATION.md) for actual checks and remaining configuration.
