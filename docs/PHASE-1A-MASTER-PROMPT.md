# BearTraps.ca — Phase 1A Codex Master Prompt

## Mission
Build the first production-quality foundation of BearTraps.ca in this repository. BearTraps.ca is a Canadian government-grade commercial supplier of professional bear capture equipment, trap transportation, warning signage, wildlife supplies, bear-resistant site furnishings and related equipment. Buyers include government procurement teams, parks, municipalities, conservation organizations, commercial facilities and authorized wildlife professionals.

**Implement the website; do not merely write a plan.** Inspect repository state first. This is expected to be a fresh repository. At the end, report files changed, routes, test results, remaining blockers and next-phase work.

## Commercial priorities
1. **Bear traps and professional capture equipment**: live-capture cage and culvert traps; mechanical capture devices only when independently verified lawful for the species, jurisdiction and buyer. Never imply unrestricted legality or availability.
2. **Trap transportation**: dedicated trailers, transport cradles, ramps, winches, tie-downs, towing accessories.
3. **Bear warning signage**: permanent and temporary signs, reflective aluminum, bilingual EN/FR, municipal custom orders.
4. **Lures and consumables**: only approved and lawful attractants and related field supplies, with location and buyer restrictions where applicable.
5. **Bear-resistant furniture and infrastructure**: bear-resistant waste/recycling bins, food lockers, waste enclosures, storage cabinets, campground and park furnishings. Never claim a bench or table is bear-resistant without evidence.
6. Wildlife monitoring and detection: trail cameras, remote monitoring, GPS, solar accessories.
7. Wildlife deterrence and outdoor protection: exclusion fencing, approved deterrents, food storage and other outdoor equipment.

Product sales are primary; installation and wildlife management services are secondary and must not be represented as directly staffed or available without verification.

## Brand
Name: BEARTRAPS.CA
Positioning: Professional Wildlife Equipment & Bear Management Solutions
Tagline: Built for the Field. Trusted for the Job.
Colors: forest #192A24, charcoal #202426, amber #E8A13B, steel #A6AFB0, off-white #F5F5F0.
Aesthetic: premium industrial, field-ready, government procurement credibility, spacious technical layout, strong photography and legible specifications. Uppercase navigation and buttons. Original SVG bear/shield mark and wordmark. No fabricated credentials, customers or partnerships.

## Technical architecture
Use Next.js App Router, TypeScript and Tailwind CSS, unless existing configuration warrants an equivalent. Establish reusable components, design tokens, accessible keyboard navigation, mobile-first responsive layouts, metadata, canonical tags, sitemap, robots.txt, breadcrumbs and suitable structured data. Keep dependencies lean. Organize product/category content as typed data, ready for future CMS, ERP or supplier integrations. Include README with local setup and deployment instructions.

## Required routes
- /
- /bear-traps
- /transport-trailers
- /warning-signage
- /lures-supplies
- /bear-resistant-furniture
- /wildlife-equipment
- /government-procurement
- /industries
- /about
- /contact
- /request-quote
- /product-compliance
- /privacy
- /terms
Create SEO-ready category templates and an extensible /products/[slug] template with demonstrative records clearly labeled as examples, not actual sellable inventory.

## Homepage
Include industrial hero with clear H1, View Equipment and Request a Quote CTAs; seven product category tiles; flagship bear traps section; transport and safety accessories; bear-resistant infrastructure; institutional procurement capabilities; industries served; sourcing and technical documentation information; quote CTA and professional footer. Use legitimate imagery only with valid rights/attribution, or clearly identified placeholders; do not invent product photos or brands.

## Product schema
Typed product record with: ID, SKU, slug, title, category, subcategory, manufacturer, model, summary, specifications, dimensions, weight, images, documents, availability state, price visibility, RFQ flag, regulatory classification, buyer eligibility, jurisdiction restrictions, shipping/freight class, certifications/evidence, and related accessories. Do not fabricate certifications, stock, prices or manufacturer affiliations.

## RFQ workflow
Build a multi-product quote basket and an accessible form collecting contact, organization, email, phone, province, items and quantities, delivery destination, desired date, tender reference, closing date, technical requirements and notes. Validate on client and server. In Phase 1A do not claim successful submission without a configured server-side delivery service. If no backend is available, make the disabled/demo state explicit and prepare a documented integration seam. Protect against spam and unsafe uploads; do not store sensitive attachments without a secure configured service.

## Government procurement
Dedicated institutional page with product categories, bulk orders, custom sourcing, technical documents, freight/delivery coordination, tender RFQ intake, bilingual readiness and documentation requirements. Do not assert vendor registration or government approval.

## Compliance and trust
Default regulated products to quote-only with no instant checkout. Add configurable jurisdiction and buyer-eligibility gating; unknown legal status must block purchase. In particular, do not treat traditional mechanical bear traps as generally legal in Canada. Product-specific legality, wildlife capture permissions, lures, shipping and environmental requirements need independent review. Do not publish instructions for harmful trapping. Bear-resistance certifications and humane-performance claims require verifiable evidence. Do not use government logos or imply endorsement.

## SEO and content
Write useful, differentiated English copy for each category, with future French localization architecture. Use truthful Canadian coverage language, without fake local offices or thin city pages. Provide titles, descriptions, Open Graph metadata, breadcrumb links, descriptive alt text, canonical URLs and XML sitemap. Make category pages support specs, related products, accessories and RFQ actions.

## Acceptance tests
- All routes render and link correctly.
- Responsive at phone/tablet/desktop widths.
- Keyboard accessible and contrast-conscious.
- TypeScript, lint and production build pass.
- No fake inventory, pricing, certifications, clients or fulfilled RFQs.
- Regulated products cannot be checked out directly.
- Demonstration data is visibly marked.
- No exposed secrets or unsupported backend claims.

## Deliverable
Implement Phase 1A in this repository. Produce a clear implementation report with: (1) files changed, (2) architecture, (3) routes, (4) data model, (5) RFQ behavior, (6) compliance protections, (7) SEO, (8) commands and tests run with results, (9) blockers and dependencies, (10) detailed Phase 1B recommendations. Do not silently skip requirements.