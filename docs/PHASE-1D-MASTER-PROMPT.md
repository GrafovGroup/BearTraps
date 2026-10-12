# BearTraps.ca — Phase 1D Codex Master Prompt
## Objective
Implement the next commercial-readiness phase on a NEW branch based on `codex/phase-1c`. Read `docs/PHASE-1C-IMPLEMENTATION.md`, `docs/CONTACT-DELIVERY.md`, `docs/CATALOGUE-PUBLISHING.md`, `docs/WHC-DEPLOYMENT.md` and existing code before editing. Build and test real improvements; do not merely plan them. Do not merge to main or deploy production without owner approval.

## Non-negotiable business model
BearTraps.ca is a Canadian government-grade **product discovery and lead generation** website. Customers browse verified products and technical details, then **contact the team via a simple contact form or call**. No RFQ basket, tender upload, checkout, pricing configurator, equipment package builder or automated bidding. Sales team handles quotations and procurement offline. Primary confirmed inbox: **info@beartraps.ca**. Business phone is not yet confirmed; never fabricate one.

## Priority 1 — Catalogue publication system
- Prioritize: (1) professional bear live-capture/culvert traps and legally eligible mechanical equipment; (2) trap transport trailers, ramps, winches, cradles and tie-downs; (3) bear warning signage; (4) legally approved lures/consumables; (5) bear-resistant waste bins, food lockers, enclosures and park furnishings; (6) monitoring, exclusion and outdoor equipment.
- Keep verified-only publishing: no invented manufacturers, SKUs, models, stock, prices, certifications, images or supplier partnerships. No fake 'available now' claims. If sourcing data is absent, retain polished category-level discovery pages and explicit sourcing contact actions.
- Improve supplier onboarding templates (CSV/JSON), validation and documentation so owner can enter exact manufacturer, model, verified dimensions/specs, freight, lead times, image licensing and regulatory evidence. Support draft/pending-review/publishable/archived status, reviewer notes and change audit where feasible.
- Enhance product detail pages, technical spec tables, model-specific documents, accessory cross-links, filtering/search, structured data and contact prefill for verified publishable records.
- Create a concise supplier outreach checklist and internal product onboarding SOP in `docs/`; do not claim suppliers have been contacted.

## Priority 2 — Contact lead conversion
- Keep simple contact form fields only: name, optional organization/phone, email, product or subject, message, consent. Product detail actions prefill product name/model/link.
- Owner-confirmed recipient: `info@beartraps.ca`. Complete a secure WHC PHP 8.2-compatible contact endpoint only if necessary runtime extensions, safe server-side credentials and authenticated upstream/durable acceptance are available. Never commit secrets or expose tokens to browser. Preserve existing origin, method, size, spam, rate limit and privacy protections; add end-to-end verification steps.
- If service credentials/access are missing, leave real delivery DISABLED and retain truthful mailto fallback. Do not show 'sent' unless server accepted; do not assert inbox receipt until observed.
- Include click-to-call components that become active only after an owner-confirmed number is configured. No placeholder phone presented as real.
- No public RFQ or tender submission flows.

## Priority 3 — WHC production readiness
- WHC.ca confirmed hosting; static Next.js export + WHC/cPanel deployment. The Phase 1C report says WHC document root/PHP 8.2 were verified and Phase 1B is live, but Phase 1C was not deployed.
- Produce tested static deployment ZIP and separately packaged secure contact bridge when appropriate. Document backup, document-root confirmation, upload, rollback, .htaccess/redirect verification, HTTPS, sitemap, robots, mobile and accessibility checks.
- Preserve existing mail/MX/DNS. No live upload, DNS changes, production form activation or secret configuration without explicit authorization.
- Make a release checklist and clear owner approval gate. Confirm staging vs production state honestly.

## Priority 4 — Conversion and SEO
- Product-first homepage, categories, prominent contact CTA, accessible navigation, mobile contact experience, truthful procurement capabilities and FAQs.
- Optimize category titles/descriptions, internal links, breadcrumbs and product structured data based on verified facts only. Avoid thin city pages and unsupported claims of national offices.
- Privacy-conscious analytics/Search Console configuration hooks without invented property IDs or live claims.
- Verify performance and visual responsiveness using existing CI browser tests.

## Compliance
- All bear capture and potentially regulated trapping equipment remains informational/contact-only with human legal and buyer authorization review; unknown legal status blocks any sale. Do not publish instructions for harmful trapping.
- Do not imply bear-resistant certification for furnishings without model-specific evidence. Check provincial restrictions and evidence before publication.
- Lures/attractants require product and jurisdiction review. No unsupported manufacturer or government endorsement.

## Tests and acceptance
- Keep existing Phase 1C routes working and legacy RFQ pages redirected/noindex.
- Run frozen install, lint, typecheck, unit tests, catalogue checks, static build, export checks, browser workflows, accessibility scans, PHP lint/security tests and dependency audit.
- Add tests for product onboarding, contact prefill, contact fallback vs actual accepted delivery, missing phone, and restricted catalogue status.
- No fake success states, fabricated products or unapproved live deployment.
- Record exact commands and actual outcomes; do not claim tests that did not run.

## Deliverables
1. Commit code to a feature branch based on Phase 1C.
2. Write `docs/PHASE-1D-IMPLEMENTATION.md` with code changes, catalogue publishing state and product count, contact delivery state, WHC deployment state, tests, blockers, and concrete launch checklist.
3. Update README, supplier onboarding docs, deployment and operations docs as needed.
4. Open a PR targeting Phase 1C branch when feasible.
5. Identify inputs required from owner: actual business phone, supplier product records and image rights, authenticated mail delivery configuration, and explicit production deployment approval.

Implement now, without overwriting or force-pushing completed branches.