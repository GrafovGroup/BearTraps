# WHC release acceptance checklist

The page imagery update is the last verified live release, deployed with owner approval on October 12, 2026. See [deployment evidence](DEPLOYMENT-IMAGERY-2026-10-12.md). Future successful cloud artifacts alone are not proof of production upload. The brief requires explicit owner approval before WHC upload, DNS/MX changes or contact activation. File deployment must preserve existing mail and DNS.

## Review before requesting upload approval

- Record PR/head commit and successful CI run. Require both the production `website` job and isolated `product-fixtures` job. Review audit exceptions in SECURITY.md.
- Download `beartraps-whc`, extract its inner `beartraps-whc.zip` and `release-manifest.json`. Verify SHA-256 against `manifest.package.sha256`. Confirm manifest commit, product count, phone and contact mode. Retain these outside the public document root.
- Review the static ZIP and desktop/tablet/mobile screenshots. No source, private intake/review manifest, credentials or PHP backend belongs in that ZIP. The release manifest lists exported file hashes; it is an audit companion, not a file to publish.
- Confirm supplier records/rights and all product pages if any products are published. Zero products means category sourcing remains available, not that inventory exists.
- Confirm phone `(833) 696-9996` / `tel:+18336969996`, email `info@beartraps.ca`, navigation, enquiries and truthful email-app preparation. No service delivery is enabled in the production build.
- Obtain explicit owner approval for this specific artifact. Do not merge or deploy merely because CI passes.

## Authorized WHC upload

1. Verify cPanel Domains assigns the intended BearTraps.ca root; preserve other sites. Confirm TLS for root/www and existing redirects.
2. Back up the complete current site and hidden `.htaccess` outside public hosting. Record permissions, prior release and rollback location privately. Keep prior hashed assets available for active sessions.
3. Upload/extract only the reviewed inner static ZIP at the document root. Ensure files including `.htaccess` are readable (normally 0644); do not replace mail folders, validation directories or private contact service data. Move uploaded archives outside public hosting.
4. Verify root, seven categories, catalogue, contact, procurement/about/industries/compliance/privacy/terms and every published product via direct URL. Check canonical HTTPS/www, sitemap, robots, assets, security/cache headers and a genuine HTTP 404.
5. Verify the two retired RFQ URLs return Apache 301 to Contact with old query strings removed. Check 320px mobile navigation/call/contact actions, search/filter/empty results, model prefill, form errors and email-app fallback. Never infer inbox delivery from a mailto click.
6. Record observed live commit/date/checks. If checks fail, restore matching prior HTML/assets/.htaccess, verify permissions and repeat smoke tests. Preserve all mail/DNS/private queues during rollback.

## Separate contact-service activation gate

The disabled PHP bridge is a separate artifact. Follow CONTACT-DELIVERY.md for WHC extension/private environment verification, authenticated durable upstream, spam/rate/idempotency/error testing, owner retention policy and authorized real inbox/spam verification. Only after these pass and activation is explicitly approved may the production endpoint be set and rebuilt. Mocked CI acceptance is not actual delivery.

## Remaining external inputs

Verified supplier/model/specification/image-rights records; secured delivery service configuration; lead ownership and retention policy; manual assistive-technology/real-device assessment; approval for future releases. The phone is owner-confirmed and no longer an outstanding input.
