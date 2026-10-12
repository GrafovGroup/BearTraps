# Website operations and acceptance

## Current facts

WHC hosts the live Phase 1B static site. Phase 1C is a review branch until an authorized deployment. `info@beartraps.ca` is owner-confirmed active; no website delivery provider or actual email receipt has been verified. The instructed phone `(833) 696-9996` remains a placeholder and must be confirmed by the owner. No verified products, prices, stock, affiliations or certifications are claimed.

The privacy page accurately describes local basket storage and RFQ downloads, hosting logs and contact for privacy enquiries. Terms distinguish enquiries from orders. These are implementation checks, not a legal opinion or completed business identity review.

## Measurement and Search Console

No analytics scripts, advertising cookies, invented property IDs or automatic personal-data events are installed. Optional `GOOGLE_SITE_VERIFICATION` adds only the owner-supplied public verification meta tag at build time. It does not submit a sitemap or prove property ownership. Bind the value in the cloud workflow only after obtaining the actual token; rebuild and verify ownership in Search Console.

Before analytics activation, document the chosen provider, data residency, retention and privacy disclosures. Prefer aggregate, cookieless page counts. Never send contact fields, line specifications, tender references, full URLs with queries or downloaded RFQs. Suggested aggregate events are catalogue visit, add-to-RFQ, download and backend acceptance; acceptance must never be labelled inbox delivery. No provider has been selected or activated.

## Release checklist

- Record the exact commit and successful CI run, artifact checksum and expiry. Review dependency audit output; high/critical advisories fail CI, lower severity findings need triage.
- Inspect mobile/desktop screenshots and axe report; perform keyboard navigation, zoom, reduced motion and manual screen-reader checks. Three engine automation is not real iOS/Safari testing.
- Back up the current WHC document root and `.htaccess` outside public hosting; exclude unrelated domains. Follow WHC-DEPLOYMENT.md. Never restore or change MX/DNS as part of a file rollback.
- Deploy only with owner approval. Verify root/category/catalogue/RFQ routes, canonical HTTPS and www redirects, 404, robots/sitemap and correct MIME/cache/security headers. HTML revalidates; content-addressed Next assets cache immutably. Keep old hashed assets during the rollout to support open sessions, then remove only through a separately reviewed cleanup.
- Confirm the disabled online button and functioning download until delivery verification is complete. With an activated backend, test actual acceptance, failure and inbox delivery independently.
- Review contact/business details, privacy wording and product evidence before publishing updated content. No images added in Phase 1C; no portfolio-wide visual audit claimed.

## Lead handling

Check the designated inbox and spam folder each business day. Assign an owner, record receipt time and tender deadline/time zone, acknowledge manually, and request missing specifications. Verify buyer authorization, province restrictions, compatibility, freight and supplier availability before quoting. Do not promise tender submission or a response SLA that the operator has not agreed to.

Set an owner-approved retention period for enquiries and delivery records before activating online intake. Define deletion/access procedures, queue failure alerts and backup handling. The PHP bridge keeps only salted abuse identifiers/counts, removes expired rate rows on traffic after ten minutes, and should have a daily database cleanup during idle periods. No procurement attachments are accepted.

## Mail activation evidence

Use a non-sensitive sample request and record timestamp/reference privately:

1. Submit from an external browser/network with consent; confirm accepted-for-processing wording.
2. Owner confirms actual receipt at info@beartraps.ca; check sender authentication, reply-to, all RFQ fields, line quantities/SKUs, tender time zone and text encoding.
3. Check spam/rejection reports and intentionally fail the queue/provider in staging. No success may appear before durable acceptance.
4. Retry identical key/payload: same receipt, one queued job. Same key/different payload must fail. Verify rate limit, oversized body, malformed data, spam and origin checks.
5. Verify retention/deletion and failure alerting without logging contact content. Record tested provider and recipient; never commit credentials or private message contents.

## Rollback

Keep the previous complete artifact and configuration outside the public root. Restore the matching HTML/asset set and `.htaccess` with file mode 0644, then repeat health checks. Preserve mail/DNS and separately deployed private RFQ storage. To disable intake, rebuild with an empty endpoint and remove the public bridge after pending requests have been accounted for. Do not delete queues or receipts to roll back a frontend.
