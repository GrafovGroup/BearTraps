# Simple contact delivery

## Current status

Recipient **info@beartraps.ca** is owner-confirmed active. No website delivery credentials, authenticated provider, durable queue or actual inbox receipt has been verified. The form therefore validates locally and prepares an explicit **OPEN EMAIL APP** link. The visitor reviews and sends in their own application. No POST or fake submission success occurs. Direct email remains available without JavaScript.

The payload is name, optional organization, email, optional phone, subject/product interest, message, consent and an empty honeypot. It has no basket, quantities, tender deadlines, freight fields or attachments. `lib/contact.ts` is the strict shared validator. `lib/contact-delivery.ts` accepts only HTTPS and a valid receipt. Repeating an unchanged submission retains the same idempotency key for that form session.

## Verified WHC facts

cPanel was inspected October 12, 2026: BearTraps.ca has an independent document root at account home plus `/beartraps.ca` (exact absolute account path retained privately), and inherits **PHP 8.2 (ea-php82)**. Previous deployment verified HTTPS, rewrite support and File Manager ZIP upload. No settings were changed in Phase 1C. cURL/PDO SQLite extensions, environment injection and outbound connectivity still need verification before backend deployment.

## Optional same-origin PHP bridge

`integrations/whc/contact.php` is a separate artifact, excluded from the static ZIP. It fails closed when private configuration is absent. It checks HTTPS, exact production origin, POST/JSON, UUID, bounded request/response size, consent/honeypot and a transactional SQLite rate limit (five requests per ten minutes per salted REMOTE_ADDR). It forwards to one configured HTTPS URL with a private bearer token, TLS verification, timeouts and no redirect following. It relays only validated 202 receipt fields and generic errors; no payload/provider details are logged.

This is **not a standalone mail service**. The upstream must use `handleAuthenticatedContact` from `integrations/contact-handler.ts`, validate the full shared schema, implement durable shared/global rate limits, server-side spam verification and an atomic deduplicating queue. Required dependencies have no permissive production defaults. Only durable acceptance may produce a receipt. The worker delivers to the fixed owner recipient; never accept a recipient from the client. No PHP mail() shortcut or attachment storage is included.

Configure protected server environment, never source, public .htaccess, client code or a committed environment file:

- `CONTACT_UPSTREAM_URL`: the vetted HTTPS service endpoint.
- `CONTACT_UPSTREAM_TOKEN`: random secret of at least 32 characters, checked by the upstream wrapper.
- `CONTACT_RATE_SALT`: separate random secret of at least 32 characters.
- `CONTACT_RATE_DB`: absolute SQLite path inside a private 0700 directory outside **all** hosted domain roots, with no symlink. The process uses umask 0077.

Do not trust arbitrary forwarding headers. If WHC uses a reverse proxy, verify the real-client identity mechanism with the host before activation. The current bridge intentionally uses REMOTE_ADDR. Set private abuse database cleanup for idle periods; expired ten-minute rows are deleted when requests arrive. Define queue/contact retention and deletion separately with the owner.

## Activation and acceptance

1. Select/configure the secured validation/queue/mail service and fixed info@beartraps.ca recipient. Store all credentials privately. Authenticate the bridge upstream and verify least-privilege access.
2. Verify WHC extensions/environment and private directory permissions. Upload the bridge only with owner approval at `/api/contact.php`; preserve DNS/MX and existing mail configuration.
3. In staging test required/optional fields, malformed body, size limits, spam, rate limits, unauthenticated upstream, invalid origin, provider/queue failure and sanitized errors. Same key/same payload must return one receipt/job; same key/different payload must fail.
4. Make an authorized external sample submission and have the owner confirm actual inbox receipt, spam/rejection status and all fields. Backend acceptance alone does not prove delivery. Do not commit private samples or secrets.
5. Approve retention/deletion and update privacy disclosures to match actual operation. Set `NEXT_PUBLIC_CONTACT_ENDPOINT=https://beartraps.ca/api/contact.php` in the cloud build only after those checks; the workflow currently leaves it empty.
6. Rebuild, review and approve deployment. Confirm accepted-for-processing copy, failure/retry behavior and private failure monitoring. Disable by rebuilding with an empty endpoint if reliable receipt cannot be maintained.

No live email delivery tests have run. Unit tests use synthetic data and mocked dependencies; PHP tests cover receipt validation/rate limits, not WHC execution or inbox delivery.
