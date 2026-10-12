# Simple contact delivery

## Current status

The owner supplied and authorized Formspree endpoint `https://formspree.io/f/xqpedwyv`. The React contact form posts validated name, organization, email, phone, subject, message and consent directly to Formspree using JSON and `Accept: application/json`. No secret belongs in the browser. Formspree handles provider-side spam filtering and delivery; no WHC PHP bridge is needed for this provider.

The existing React state and accessible validation are retained rather than introducing a second form-state SDK. `lib/formspree.ts` handles the Formspree response contract separately from the optional custom 202 receipt service. Success requires a successful HTTP response with `ok: true`. Timeouts, network errors, malformed responses and provider rejection retain entered fields and display retry/direct-email guidance. Repeated clicks during a request are blocked; an identical confirmed submission is not sent twice in the same mounted form. This is not provider-side idempotency: retrying an unconfirmed timeout may duplicate a submission.

The public endpoint defaults to the owner-provided Formspree URL; `NEXT_PUBLIC_CONTACT_ENDPOINT` remains a build-time override for isolated tests or an explicitly configured alternative. An explicit empty string restores email-app mode. Formspree submissions send no custom idempotency header. The local honeypot is validated and mapped to Formspree `_gotcha`. Visitors consent before submitting and the privacy page describes the processor. CAPTCHA/domain restrictions, quotas, recipient settings and retention are controlled in the owner's Formspree account; those account settings and actual inbox receipt have not been independently verified.

Unit tests exercise the request and reject invalid/failure responses. Cloud browser tests intercept Formspree in each browser and check rate-limit recovery, all fields, success and duplicate suppression without sending mail. Deployment and actual inbox verification are recorded separately; mocked tests alone do not establish delivery to info@beartraps.ca.

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

## Optional custom PHP service activation (not used by Formspree)

1. Select/configure the secured validation/queue/mail service and fixed info@beartraps.ca recipient. Store all credentials privately. Authenticate the bridge upstream and verify least-privilege access.
2. Verify WHC extensions/environment and private directory permissions. Upload the bridge only with owner approval at `/api/contact.php`; preserve DNS/MX and existing mail configuration.
3. In staging test required/optional fields, malformed body, size limits, spam, rate limits, unauthenticated upstream, invalid origin, provider/queue failure and sanitized errors. Same key/same payload must return one receipt/job; same key/different payload must fail.
4. Make an authorized external sample submission and have the owner confirm actual inbox receipt, spam/rejection status and all fields. Backend acceptance alone does not prove delivery. Do not commit private samples or secrets.
5. Approve retention/deletion and update privacy disclosures to match actual operation. Set `NEXT_PUBLIC_CONTACT_ENDPOINT=https://beartraps.ca/api/contact.php` in the cloud build only after those checks; the workflow currently leaves it empty.
6. Rebuild, review and approve deployment. Confirm accepted-for-processing copy, failure/retry behavior and private failure monitoring. Disable by rebuilding with an empty endpoint if reliable receipt cannot be maintained.

No live email delivery tests have run. Unit tests use synthetic data and mocked dependencies; PHP tests cover receipt validation/rate limits, not WHC execution or inbox delivery.

## Phase 1D verification additions

The confirmed business number is (833) 696-9996. Phone configuration is independent of email delivery. Isolated CI now builds with a reserved test endpoint and intercepts requests to verify malformed 202 receipts remain failures, valid receipts show acceptance only, unchanged retries reuse a key and changed payloads use a new key. The historical Phase 1D production build left the endpoint unset; the Formspree update changes that default. These tests never contact a provider or prove inbox delivery.
