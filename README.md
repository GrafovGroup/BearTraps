# BEARTRAPS.CA

Professional wildlife equipment website. Next.js App Router, TypeScript, Tailwind CSS. Hosting target: WHC.ca. GitHub builds the static website; no Mac server or Node process is needed for hosting.

## Cloud workflow

1. Push a branch or open a pull request. GitHub Actions installs dependencies and runs lint, TypeScript, RFQ tests, the production export and route checks.
2. Download the `beartraps-whc` artifact from the successful Actions run. The artifact contains `beartraps-whc.zip`.
3. In WHC cPanel > Domains, verify the document root for BearTraps.ca. Do not assume it is public_html when the domain is an addon.
4. Back up existing files. Upload the inner ZIP in File Manager and extract its contents into the verified document root. Keep existing mail, validation, and unrelated domain files intact.
5. Confirm HTTPS, direct category URLs, RFQ downloads, sitemap and 404 behavior on the live domain.

Automated SFTP deployment is a next step after the correct WHC account, target directory, credentials and server fingerprint are verified. Never commit credentials. No deployment has been performed by this foundation change.

## Development (optional)

Node 22.13 or newer: `npm install`, `npm run dev`. Checks: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `node scripts/check-export.mjs`. This is not required on the owner's Mac.

## Content and architecture

- `app/page.tsx`: homepage.
- `app/[slug]/page.tsx`: category and institutional/legal routes.
- `lib/catalog.ts`: typed category/product model; no published supplier inventory.
- `lib/pages.ts`: institutional and policy copy.
- `components/quote-form.tsx`: persistent requirement basket, accessible client validation and local RFQ download.
- `lib/quote.ts`: shared schema for a future server integration.
- `integrations/quote-route.ts`: disabled server integration reference, excluded from the static deployment.
- `templates/product-page.tsx`: product template, to activate under `app/products/[slug]/page.tsx` when verified records exist; add `generateStaticParams` for published products.
- `public/.htaccess`: WHC/Apache response headers and custom 404.
- `docs/IMPLEMENTATION.md`: verification limits and next-phase work.

The current customer experience is a requirements catalog. It does not present invented inventory, prices, product evidence or manufacturer affiliations. RFQ downloads do not send email. No checkout or upload endpoint exists.
