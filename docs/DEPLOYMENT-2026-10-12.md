# BearTraps.ca deployment — October 12, 2026

The owner authorized connecting BearTraps.ca to the existing WHC account. Deployment completed on October 12, 2026 (America/Toronto).

## Release

- Phase 1B static artifact from tested commit `c6155a29e4957a83348fa70f1600f9e2189bfd3f`, GitHub Actions run [38282706739](https://github.com/GrafovGroup/BearTraps/actions/runs/38282706739).
- Existing WHC Web Hosting Pro plan used. BearTraps.ca was added with its own document root, `~/beartraps.ca`, separate from the primary site's files. The new root contained only the standard cgi-bin directory before upload; no prior website was overwritten.
- Static files extracted directly into the domain root. Release ZIP moved to the account home outside the public root.
- A small subsequent `.htaccess` configuration enables HTTP and www redirects to `https://beartraps.ca`, preserving paths and queries, and permits HTTP certificate validation paths. Set `.htaccess` to `0644` after extraction: the server ignored the initial configuration at `0600`. The source file is included with this deployment record.

## DNS and HTTPS

- Changed only the root A record from `149.56.225.6` to the cPanel-confirmed website IP `51.161.57.68`; TTL now 300 seconds.
- Kept `www` as a CNAME to `beartraps.ca`.
- Kept existing WHC nameservers and both Forward Email MX records, SPF and verification TXT records unchanged.
- Both authoritative WHC DNS servers returned the new A record.
- Requested a free Let's Encrypt certificate through WHC cPanel. TLS validation succeeded for both `beartraps.ca` and `www.beartraps.ca`, without ignoring certificate errors.
- Old DNS answers can remain cached for the prior TTL of 14,440 seconds (about four hours). One HTTP resolver still returned the parking page during verification while HTTPS and the browser loaded the new site.

## Verified

- All 18 HTML routes plus robots.txt and sitemap.xml matched the tested artifact byte-for-byte at the WHC origin.
- HTTPS homepage and catalogue returned 200 with the configured security headers.
- Origin HTTP and public HTTPS www catalogue URLs returned 301 to the canonical HTTPS URL.
- An unknown route returned HTTP 404. Both deployment ZIPs were removed from the public root; the original ZIP URL returned 404.
- Browser loaded the live HTTPS homepage, navigated to the catalogue, filtered signage to one result, added a requirement, opened the RFQ and retained the selection on reload. The test selection was then removed.
- Online submission remained disabled. No RFQ or email was sent; live inbox delivery remains unconfigured.

## Operations and rollback

Keep `.htaccess` at 0644 and directories readable by the web server. Future releases must include the committed HTTPS rules. The original build ZIP is retained outside the public root; the HTTPS configuration is tracked in Git. Restoring the prior A value would return visitors to the WHC parking page after cache expiry; do not alter MX/TXT records as part of a website rollback.

No PR was merged, no subscription was purchased, and the primary site's files were not changed. Verified supplier records and a configured/tested mail delivery service remain separate work.
