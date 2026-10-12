# Phase 1A implementation

## Foundation

16 content routes: homepage, seven equipment categories (including deterrence-protection), government-procurement, industries, about, contact, request-quote, product-compliance, privacy and terms. Custom 404, sitemap.xml and robots.txt. Forest/amber design, original technical hero illustration, responsive CSS and mobile menu.

## Architecture and data

Next.js App Router and static export for WHC. TypeScript and Tailwind CSS. Typed product model includes identification, supplier/model, specifications, dimensions, weight, media/documents, availability, RFQ state, regulatory classification, eligibility, restrictions, freight and evidence. Supplier records remain empty pending verified source information. Product detail rendering is retained as an activation template.

## RFQ

Multi-category, quantity-aware basket persists equipment selections in browser storage. Contact details remain in memory until locally downloaded. Shared Zod validation rejects invalid inputs, impossible dates, unsupported categories and unsafe quantities. User acknowledgement is required. No claim of receipt, no email delivery, no checkout, no attachments. A server handler reference validates on the server but deliberately returns unavailable for delivery; it is not included in the static build.

## Compliance

No fabricated stock, prices, clients or certifications. Unknown legal status blocks purchase; no purchase path exists even for a quote-ready record. The eligibility helper is a future integration boundary, not legal verification. Human review remains mandatory for exact products and destinations.

## SEO and accessibility

Titles, descriptions, canonicals, organization and breadcrumb structured data. Semantic headings, skip link, labeled form controls, keyboard focus, error summaries, reduced-motion support and responsive layouts. French locale is reserved in data only; no translated pages are claimed.

## Validation

The initial local TypeScript check passed using already-installed dependencies. The first lint identified a React effect issue and two configuration warnings, corrected in the cloud branch. Local installation/build and browser QA were blocked by the Mac's full disk. GitHub Actions is the authoritative validation for the resulting branch; see its actual results. Cloud checks include lint, types, six RFQ/compliance tests, production build and exported-route checks. No browser-based accessibility or responsive interaction test is claimed yet.

## Requirement resolutions

The current user instructions override older sample/demo and customer-facing placeholder-label instructions in the master brief. Category sourcing requirements replace fabricated demonstration inventory. No customer-facing image provenance captions are added. WHC static hosting takes precedence over an assumed Node hosting runtime. No live RFQ service is claimed.

## Remaining dependencies / Phase 1B

1. Confirm WHC account, domain document root and HTTPS. Back up any existing content and deploy the verified cloud artifact.
2. Audit desktop, tablet and phone views in a browser, keyboard order, basket persistence/removal, form errors and downloaded RFQ contents.
3. Supply verified manufacturers, products, specifications, SKU/model records, eligibility, evidence and unique licensed images.
4. Activate product routes from verified published records; add exact-model document links and reviewed jurisdiction rules.
5. Configure a verified RFQ destination via a WHC-compatible secure backend or external service. Add delivery queue, rate limits, retention policy and anti-spam checks. Update privacy disclosures before activation.
6. Confirm operating business details and phone number; the specified placeholder is currently used.
7. Add reviewed French translations and routing, search/filtering and document management as inventory grows.
8. Capture a dependency lockfile from a successful cloud installation for reproducibility.
