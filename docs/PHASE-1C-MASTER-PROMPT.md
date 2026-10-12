# OWNER OVERRIDE — PRODUCT DISCOVERY + SIMPLE CONTACT (LATEST DECISION)

This section supersedes conflicting RFQ/tender submission requirements below and in earlier phase briefs. Implement this model, not the older RFQ workflow.

**Commercial objective:** BearTraps.ca is a government-grade product discovery and lead-generation website. Visitors browse equipment and specifications, then **call the sales team or submit a simple contact form**. Staff handle quotations, tender documents, pricing and orders offline. Do not offer website RFQ baskets, multi-line quote submissions, equipment package request builders, tender upload forms, checkout or automated tender submissions.

## Required customer experience
- Homepage and every product/category page prominently feature **CALL US** and **CONTACT US** actions. Use a real `tel:` link only after the owner confirms the business phone number; until then do not invent a phone number. Display a contact action or clearly configured placeholder instead.
- Product detail pages: name, photos (rights-verified), description, technical specifications, documents (verified), related accessories, and **ASK ABOUT THIS PRODUCT**. This opens the simple contact page/form with product name/SKU/URL prefilled where possible.
- Contact form: name, company/organization (optional), email, phone (optional), subject or product of interest, message, consent. Minimal validation, accessible errors, spam prevention, privacy protections. No tender deadlines, quantity basket, freight fields or procurement file uploads.
- Form recipient: **info@beartraps.ca** (owner confirms active). Implement WHC-compatible secure server-side delivery only when configured and verified. No fake submission success. Provide mailto fallback until operational, without suggesting mailto is an automated submitted form.
- Government procurement page: present supply capabilities, product categories and direct contact information. Invite procurement officers to call/email directly with their requirements. No online tender portal.
- Remove RFQ basket, multi-item quote UX, equipment package builder and associated navigation/CTAs from the public UI. Retire or redirect legacy `/request-quote` and `/equipment-package` paths to the contact or relevant catalogue page without broken links. Keep useful internal code only if non-public and non-conflicting.
- Prioritize product browsing: category search/filtering, rich verified specifications, accessory cross-links, SEO and strong mobile contact calls-to-action.
- Keep regulated capture equipment quote-by-conversation only, subject to buyer/jurisdiction legal review; no direct checkout. No fabricated products, availability, suppliers or certifications.
- Preserve WHC static export, visual identity, CI, existing functioning routes and accessibility. Update tests and docs to reflect the simplified sales funnel.
- In the Phase 1C report explicitly confirm which legacy RFQ features were removed or redirected and which contact delivery tests actually passed.

---

# BearTraps.ca — Phase 1C Codex Master Prompt

## Goal
Bring BearTraps.ca to a verifiable commercial launch-ready state on WHC.ca, while preserving the government-grade design and legal safeguards. This is an implementation instruction, not just a planning exercise.

## Mandatory prerequisite gate
Before changing code, inspect current branch, open pull requests, commits, `docs/IMPLEMENTATION.md`, `docs/PHASE-1B-MASTER-PROMPT.md`, and any Phase 1B report. **Do not assume Phase 1B has been implemented merely because its prompt exists.** If Phase 1B is incomplete, implement or finish its essential catalogue, verified product publishing, quote basket and institutional RFQ work first, then proceed to Phase 1C. If work exists on another branch, identify it and integrate safely, avoiding overwrites. Report the baseline and branch decisions.

## Workstream 1 — Real sales intake
- Confirmed primary contact and RFQ recipient: **info@beartraps.ca**. The owner states the mailbox is active.
- On static WHC hosting, do not assume Next.js API routes will run. Implement a secure WHC-compatible server endpoint or authenticated form service with server-side validation, anti-spam, rate limiting, abuse prevention, safe logs and clear delivery failure handling.
- All SMTP/API credentials must come from secure server environment, never from the repository or browser bundle. If configuration is unavailable, implement the adapter and documented deployment steps, leaving honest no-delivery UI and the local RFQ download fallback.
- Support product lines, quantities, model/SKU, custom sourcing requests, buyer organization, province, destination, tender reference, closing deadline/timezone, requested delivery date and attachments only if secure validated storage/handling exists.
- Provide meaningful success state only after confirmed backend acceptance; distinguish accepted-for-processing from confirmed inbox delivery.
- Add a delivery verification checklist for owner: external test submission, received email at info@beartraps.ca, spam folder check, failure case and privacy retention.

## Workstream 2 — Procurement and quote conversion
- Dedicated government procurement landing page with buyer-specific paths, bulk orders, technical specifications, custom sourcing and delivery coordination.
- Professional multi-item downloadable RFQ summary and tender-ready specification request form.
- Create quote-ready equipment package workflows: capture system + suitable transport trailer + signage + monitoring + lawful consumables; do not claim model compatibility unless verified.
- Enable quote-request links from category/product cards, sticky mobile CTA where appropriate and accessible quote basket management.
- Avoid fabricated vendor approvals, government contracts, certifications, inventory, manufacturers and prices.

## Workstream 3 — Catalogue publishing and evidence
- Only publish real products supported by verified supplier details, model/spec sheets, imagery rights and regulatory review. Keep sample fixtures internal.
- Ensure product search, filters, product details, related accessories and technical document links are usable if Phase 1B implemented them; otherwise finish these requirements.
- Keep bear traps the flagship category; trailers, warning signage, lures and bear-resistant site furnishings prominent.
- Add internal data/evidence checklist and admin-friendly import format (CSV or JSON), validation and clear status: draft, pending-review, publishable, archived.
- Bear-resistant certification claims require evidence; unknown legal status blocks purchase. Regulated bear-capture equipment, mechanical devices and restricted lures remain quote-only, subject to qualified human review and applicable Canadian/provincial law. Do not provide harmful trapping instructions.

## Workstream 4 — Hosting, security and performance
- Preserve Next.js static export and WHC.ca-compatible `.htaccess` unless verified hosting requirements dictate a change.
- Produce a deployable artifact, documented cPanel document-root procedure, rollback plan, cache headers, HTTPS verification, redirect/canonical checks, 404/sitemap/robots checks, and safe preservation of existing DNS/mail.
- Add basic privacy/terms/contact accuracy review, security headers and dependency vulnerability checks.
- Never modify DNS, MX records, production mail configuration or deploy live without verified owner-provided access and explicit approval.

## Workstream 5 — SEO, measurement, accessibility
- Strengthen useful technical category copy, FAQ, breadcrumbs, metadata, schema based only on verified facts, image alt text and internal links.
- Prepare privacy-conscious analytics and Search Console verification placeholders; do not invent property IDs or claim integration is active.
- Audit keyboard navigation, contrast, reduced motion, responsive layout, empty catalogue states, form validation and mobile quote flow.
- Add an operational launch checklist for indexability, quote conversion, site health and procurement lead handling.

## Quality gates
- Existing Phase 1A and any Phase 1B routes still work.
- Lint, typecheck, tests, production static export and generated-route verification pass in CI.
- Test quote form validation, basket persistence, restricted-item behavior, legal-review gates, and backend failure/success handling.
- Verify that no email delivery, deployed site, product availability or supplier relationship is claimed unless actually confirmed.
- Provide reproducible steps and actual outcomes for browser QA; do not claim a test was performed if it was not.

## Deliverables
1. Implement code in a feature branch based on the latest relevant completed work; do not force-push or overwrite `main`.
2. Update README and relevant technical docs.
3. Write `docs/PHASE-1C-IMPLEMENTATION.md` with baseline and Phase 1B gate findings, features built, files changed, test outcomes, exact live email delivery status, supplier data status, hosting/deployment status, blockers, and Phase 2 recommendations.
4. Commit the implementation and provide a PR for review when feasible.

## Non-negotiable
This is a commercial procurement site, not a general outdoor blog. Keep product hierarchy focused on professional bear traps first, transportation second, signage/lures third, and bear-resistant furniture/infrastructure alongside related wildlife equipment. Government-grade presentation, truthful claims, Canadian legal compliance and a working lead intake path are mandatory.

## Owner-confirmed production hosting decision (2026-10-12)
- **WHC.ca is the confirmed production host**, not an optional alternative. Keep the static Next.js export and WHC/cPanel-compatible deployment packaging.
- **info@beartraps.ca** is the confirmed active sales and RFQ recipient. Do not assume mailbox activity means a working website submission endpoint.
- Determine and document the exact cPanel document root, PHP availability/version, HTTPS, rewrite support and upload method before any deployment; do not guess the path.
- Prefer a small secure PHP handler on WHC if the account supports it, otherwise a vetted HTTPS form service. Use server-side credentials and anti-spam/rate limiting; no SMTP credentials in browser code or GitHub.
- Preserve MX/DNS and existing mail configuration; do not modify them without approval.
- Prepare reproducible deployment and rollback steps, with backup, zip artifact, HTTPS/route tests, and verified email-delivery smoke tests.
- Deployment requires explicit owner approval and verified access. If access is unavailable, complete staging/build artifacts and checklist without claiming live deployment.
