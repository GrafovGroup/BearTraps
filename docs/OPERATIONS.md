# Site operations

Phase 1C is product discovery and simple contact lead generation. Staff handle quotations, tender documents and orders offline. There is no public basket, package builder, tender portal or checkout. Legacy RFQ URLs redirect to Contact. Until the contact service is verified, the form prepares an email for the visitor's own email app; it never claims a message was sent.

## Release and rollback

- Use the exact successful cloud commit/run; retain the artifact checksum and previous complete ZIP outside public hosting. Review the dependency audit and time-limited exception in SECURITY.md.
- Verify WHC cPanel root, certificate, PHP settings and current files. Back up the root and .htaccess, excluding unrelated domains. Deploy only after owner approval; never modify DNS/MX as part of a file deployment.
- Confirm root/category/catalogue/contact routes, legacy 301 redirects, canonical HTTPS/www behavior, 404, sitemap/robots and security/cache headers. HTML revalidates; hashed Next assets cache immutably. Keep old hashed assets during rollout for open sessions.
- Test category search, product enquiry prefill (once records exist), optional fields, consent/errors, email preparation and mobile contact CTA. Do not click mailto and infer that an email was sent.
- Restore the matching prior HTML/assets/.htaccess if checks fail; ensure files 0644. Preserve private service queues, mail and DNS. Recheck all routes after rollback.

## Lead operations

Confirm the actual business telephone before adding CALL US/tel links; the previous placeholder was removed under the latest project brief. Confirm business identity and a lead owner. Check info@beartraps.ca and spam daily, record incoming enquiries privately and acknowledge manually. Discuss specifications, buyer authorization, jurisdiction, compatibility, freight and supplier availability before quoting. Do not promise tender submission or unapproved response times.

Choose an owner-approved retention period and deletion/access process before online delivery activation. Arrange secure document transfer offline. Complete the external sample/inbox/spam/failure checklist in CONTACT-DELIVERY.md. No attachments are stored by the website.

## Privacy and measurement

Privacy/terms/contact copy reflects email preparation, transient fields and hosting logs. No tracker is installed, and no business identity or phone has been invented. This is an implementation review, not a legal opinion.

Optional GOOGLE_SITE_VERIFICATION inserts the actual owner-supplied public meta token at build time. No property ID is fabricated or Search Console ownership claimed. Bind it in CI only after the owner provides the real token, rebuild and verify ownership separately.

Analytics remains disabled. Before selecting a provider, document residency, retention, disclosures and consent requirements. Prefer aggregate cookieless page counts. Never send message text, contact fields, product-interest query strings or full query-bearing URLs. Potential aggregate events: catalogue visit, contact visit, email preparation and backend acceptance. Do not label any of these inbox delivery.

## Ongoing checks

Review search/indexability, sitemap and redirects after releases. Monitor availability/TLS and failed intake privately once configured. Review supplier evidence and document links regularly. Run keyboard/zoom/reduced-motion/contrast checks plus manual screen-reader and real iOS/Safari checks; automated three-engine/axe results do not replace them. No new images were introduced in Phase 1C and no portfolio-wide visual audit is claimed.
