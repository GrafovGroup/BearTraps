# RFQ delivery integration

## Current state

The owner selected **info@beartraps.ca** on October 12, 2026. The owner confirms that this mailbox is active. That confirmation does not establish an outbound delivery service or end-to-end website delivery. No credentials, approved endpoint or delivered message were provided. The static deployment therefore has a visibly disabled online submission button and working local download/print actions. Clicking the mailto link opens the user's mail application; it does not send mail.

## Shared contract

`lib/quote.ts` validates contact, buyer, line items and tender fields. `lib/rfq-delivery.ts` is the client adapter. `integrations/rfq-handler.ts` is a framework-neutral server handler for an independently deployed Node-compatible service; it does not run in the WHC static website.

The interface also permits a WHC PHP bridge forwarding to that vetted validation/delivery service. Do not expose a public PHP `mail()` script or substitute client-only validation. If implementing a wholly PHP backend, implement and test equivalent server validation from the same contract; do not claim the TypeScript handler executes under PHP.

POST JSON to the configured HTTPS endpoint, with `Content-Type: application/json` and a UUID `Idempotency-Key`. The validated payload contains contact/project details and up to 50 category, published-product/variant or custom sourcing lines. No attachments are accepted.

Only a durable successful acceptance may return HTTP 202:

```json
{"status":"accepted","reference":"service-generated-reference","acceptedAt":"2026-10-12T12:00:00Z"}
```

A 2xx status with any other body is not treated as confirmed success. Client errors/timeouts mean receipt is unknown, not proof of non-delivery. Retrying unchanged data reuses the same key. The service must deduplicate that key and payload, return the same receipt for a repeat, and reject reuse for a different payload. The client's key persists for the current form session only.

## Required server dependencies

The handler intentionally requires injected implementations rather than permissive production defaults:

- `allowedOrigins`: exact production origin(s).
- `allowRequest`: durable, shared rate limiting, keyed to a trusted client identity/IP; never trust arbitrary forwarding headers. Use hashed identifiers and short retention.
- `verifySpam`: server-side bot/spam verification appropriate to the chosen provider, in addition to the honeypot.
- `acceptDurably`: atomically persist to a secure queue and deduplicate, create an opaque receipt, then deliver asynchronously to the configured owner mailbox. Verify the destination server-side and never accept a recipient from the visitor.

The handler enforces origin, POST/JSON, a request-size limit of 128,000 bytes, Zod validation and positive acceptance. Operational exceptions return a generic failure without leaking personal data/provider errors. This contract does not itself provision a queue, database, mail provider, retention policy or rate-limit store.

## Activation checklist

1. Use the owner-confirmed active mailbox info@beartraps.ca and configure an authorized outbound delivery provider.
2. Store provider secrets and `RFQ_RECIPIENT=info@beartraps.ca` in server-only environment configuration. No credentials go in source or `NEXT_PUBLIC_*` values.
3. Deploy the independently secured service and configure exact CORS origins/preflight if it is cross-origin. Do not use wildcard credentialed CORS. Enforce all origin checks on the server.
4. Test invalid input, body limits, missing consent, spam, rate limits, provider outage, queue failure, duplicate retries and receipt semantics. Never log contact bodies, document references or email content.
5. Set retention/deletion rules for queued requests, receipts and abuse identifiers. Update privacy disclosures to describe the actual operator, service and retention.
6. Perform an authorized end-to-end test and confirm actual receipt in the intended mailbox. Do not infer delivery from an HTTP response alone.
7. Set `NEXT_PUBLIC_RFQ_ENDPOINT` to the verified HTTPS service during the cloud build. Rebuild and deploy to WHC. No secret is needed in browser code.
8. Monitor failed deliveries privately using sanitized reference IDs. Disable online submission by rebuilding with an empty endpoint if reliable acceptance cannot be maintained.

The current GitHub workflow deliberately leaves the endpoint empty. Activation requires an explicit workflow environment binding after the above configuration is complete.

## Phase 1C WHC bridge

cPanel MultiPHP Manager was inspected on 2026-10-12: BearTraps.ca inherits **PHP 8.2 (ea-php82)**. No hosting settings were changed. Document root was confirmed in cPanel as the account home plus `/beartraps.ca` (absolute account path retained privately). HTTPS/rewrite and File Manager ZIP upload were verified during the previous deployment. PHP cURL/PDO SQLite extension availability and outbound connectivity are not yet verified on WHC.

`integrations/whc/rfq.php` is an optional same-origin PHP 8.2 bridge, distributed as a **separate artifact**, never automatically copied into the static export. It fails closed without server environment configuration. It checks HTTPS, exact origin, method/content type, UUID, bounded JSON, consent/honeypot and an atomic SQLite rate limit (five attempts per ten minutes per salted REMOTE_ADDR). It forwards only to a fixed HTTPS upstream with a private bearer token, no redirect following, bounded responses and TLS verification. It returns only an upstream 202 with a valid receipt, and never relays provider error bodies.

This bridge is not a standalone mail backend. The upstream must run the shared full Zod validator, authenticated bridge wrapper, spam verification, durable idempotent queue and verified mail delivery provider. Neither the bridge nor the static website calls PHP `mail()`. The bridge's basic shape checks do not replace full upstream product/buyer/tender validation.

Configure through protected server environment, never public `.htaccess`, JavaScript, source or GitHub variables committed to source:

- `RFQ_UPSTREAM_URL`: vetted HTTPS endpoint hosting `handleAuthenticatedRfq`.
- `RFQ_UPSTREAM_TOKEN`: at least 32 characters, matched privately by the upstream.
- `RFQ_RATE_SALT`: independent random secret, at least 32 characters.
- `RFQ_RATE_DB`: absolute SQLite path in a private 0700 directory outside **all** domain roots. The process uses umask 0077. Do not configure a shared public path or symlink.

Verify cURL/PDO SQLite and environment injection with WHC before upload. Confirm reverse-proxy topology: this adapter intentionally trusts only REMOTE_ADDR. If WHC puts all clients behind one proxy, configure an operator-verified identity mechanism before activation rather than accepting arbitrary forwarded headers. Add upstream/global abuse limits and monitoring; per-IP throttling alone is not bot prevention.

For a future deployment, place the bridge at `/api/rfq.php`, enable the tested backend and privately verify inbox delivery before rebuilding with `NEXT_PUBLIC_RFQ_ENDPOINT=https://beartraps.ca/api/rfq.php`. Update privacy disclosures first. DNS/MX changes are not required or authorized by this integration. The current workflow does not set the endpoint. No email has been sent or received by this implementation.
