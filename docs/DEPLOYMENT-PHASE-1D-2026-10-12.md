# Phase 1D WHC deployment — October 12, 2026

Phase 1D is live at https://beartraps.ca/. The owner explicitly authorized this upload with “deploy now.” Upload and verification completed at approximately 14:58 EDT. No pull requests were merged.

## Release and rollback

- Deployed implementation: `37e635f3374aa3930755c56082eb7389edcd8a39` from [passing cloud run 38292869565](https://github.com/GrafovGroup/BearTraps/actions/runs/38292869565).
- Static ZIP SHA-256: `35253e3591c0abd3be17f01405f3450697a25ac20e65fa75afad34383702e9aa`.
- cPanel compressed the existing full document root, including hidden `.htaccess`, into `beartraps-backup-before-1d-20261012.zip` in the private account home before upload. Compression results confirmed completion.
- Extracted only the verified static package into the existing BearTraps document root. Existing ACME and CGI directories and older hashed assets were preserved. `.htaccess` and HTML permissions are 0644; directories are 0755.
- The uploaded archive was renamed `beartraps-phase1d-20261012.zip` and moved into the account home. Neither public archive URL is accessible (both return 404).
- Rollback: restore matching prior HTML, assets and `.htaccess` from the private backup; preserve mail, DNS and unrelated account files; repeat the live checks below.

## Observed production verification

| Check | Result |
| --- | --- |
| Public file integrity | All 115 publicly served manifest files matched SHA-256; `.htaccess` behavior verified separately |
| Content routes | 16 routes returned 200 with the selected logo and confirmed phone |
| Canonical host | HTTP root and HTTPS www return 301 to HTTPS beartraps.ca |
| Retired RFQ routes | `/request-quote/` and `/equipment-package/` return 301 to `/contact/`, dropping old query strings |
| Missing route | Returns 404 |
| Security headers | nosniff, strict-origin-when-cross-origin, DENY frame policy, restricted Permissions-Policy and expected CSP present |
| Caching | HTML max-age=0/must-revalidate; hashed Next assets one-year immutable |
| Contact validation | Empty form displays required-field and consent errors |
| Contact preparation | Synthetic inputs create a correctly addressed mailto link and state that nothing has been submitted; email app was not opened and no email was sent |
| Catalogue search | Searching signage reduces seven sourcing categories to one matching category |
| Phone | Live call links target `tel:+18336969996` |
| Mobile | Menu expands at 320px; document width and scroll width both 320px (no horizontal overflow) |
| Visual | Live desktop homepage inspected; selected shield logo, phone and navigation visible |

The 16 checked routes were home, bear-traps, transport-trailers, warning-signage, lures-supplies, bear-resistant-furniture, wildlife-equipment, deterrence-protection, government-procurement, industries, about, contact, products, product-compliance, privacy and terms.

## Operating state

Contact remains email-app preparation to `info@beartraps.ca`; automatic delivery is disabled and the separate PHP bridge was not deployed. No inbox-delivery claim is made. Zero supplier products are published because verified records have not been supplied. The confirmed phone is (833) 696-9996. DNS, MX and mail settings were not changed. Hosting and builds remain on WHC and GitHub respectively; no Mac web server was started.

This deployment record is a documentation-only follow-up. The deployed implementation and its cloud test evidence remain the exact commit above. Manual screen-reader/real-device assessment and optional automatic-delivery activation remain separate work.
