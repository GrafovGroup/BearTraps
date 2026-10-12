# Image update deployment — October 12, 2026

The owner explicitly approved “Deploy now” for the tested 12-image package in PR #5. It was uploaded and extracted into the existing WHC BearTraps.ca document root. The live site is https://beartraps.ca/.

## Release evidence

- Implementation commit: `bfbce257f4356c099548228f7e14a92832c05317`.
- Successful cloud run: https://github.com/GrafovGroup/BearTraps/actions/runs/38296058442 (website and product-fixtures jobs).
- Static artifact: `11767868173`; screenshot evidence: `11768077951`.
- ZIP SHA-256: `156b38bf928d679ca07f6d79bc7d7b8ff49e011ffd60971f6ade8f6914b37960`.
- All 139 archive entries matched the companion manifest before upload. Subsequent commits change documentation only.

## Backup and installation

A complete prior-site ZIP, including hidden configuration, was created outside the public document root as `beartraps-backup-before-imagery-20261012.zip`. cPanel reported completed compression and extraction. The uploaded release archive was renamed `beartraps-imagery-20261012.zip` and moved outside public hosting. Existing validation directories and earlier hashed assets were preserved. Rollback uses the private backup to restore matching HTML, assets and configuration, then repeats the live checks.

## Live verification

- All 138 public manifest files returned matching SHA-256 hashes, including all 23 responsive WebP files. No mismatches.
- All 16 checked page routes returned HTTP 200 with the correct logo and telephone link.
- HTTP and www redirect to canonical HTTPS with 301; both retired request URLs redirect to Contact and discard the old query string.
- A missing URL and both public archive paths return HTTP 404.
- CSP, nosniff, frame, referrer and permissions headers are present. HTML revalidates; hashed JavaScript has immutable caching.
- Browser inspection confirmed the new homepage hero and capture category photograph decode. The 320px category view has no horizontal overflow and its mobile menu opens and closes.
- Full cloud image checks previously verified all 12 placements on all 11 pages at 1440px and 320px. Live files match those tested bytes.
- A live homepage screenshot was saved in the local project design evidence directory as `page-images-2026-10-12/homepage-live.png`.

## Operating state

Twelve distinct images now enrich 11 pages: eight public-domain photographs and four generated scenes. The asset register retains provenance and uniqueness review scope. Contact remains email-app preparation for info@beartraps.ca; no email was sent and no automatic delivery service or PHP bridge was deployed. Phone remains (833) 696-9996. Supplier inventory remains zero. DNS, MX and mail settings were not changed. PR #5 and its stacked predecessors were not merged.
