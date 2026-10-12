# WHC deployment procedure

The repository produces a static Next.js export. GitHub runs the build; WHC serves its HTML/CSS/JavaScript. A Mac server is not required.

1. Use the successful GitHub Actions run for the exact reviewed commit. Download the `beartraps-whc` artifact, then extract its inner `beartraps-whc.zip` and companion `release-manifest.json`. Verify the ZIP hash and exact commit against the manifest. Upload only the website ZIP; retain the manifest privately. Complete RELEASE-CHECKLIST.md and obtain explicit owner approval.
2. Sign into the authorized WHC account. In cPanel > Domains, verify the document root assigned to BearTraps.ca. An addon domain may not use `public_html`.
3. Confirm the domain's DNS resolves to the intended WHC hosting account and its HTTPS certificate is valid. This repository does not alter DNS.
4. Back up the existing target directory and `.htaccess`; preserve mail, validation, and unrelated sites. Review any existing rewrite/security rules before replacing `.htaccess`.
5. Upload and extract the site's inner ZIP into the verified root so that `index.html`, `_next/`, `products/`, `request-quote/` and `.htaccess` sit directly within it. Do not upload source, tests, node_modules or environment files.
6. Check all 18 informational/catalogue routes directly, links, sitemap and robots, a nonexistent URL, response headers, and mobile layouts. Apache's `ErrorDocument 404 /404.html` must retain HTTP 404 status.
7. Verify category search, product enquiry prefill, simple contact validation and truthful email-app fallback. Verify `/request-quote/` and `/equipment-package/` return 301 to `/contact/`. Automated delivery stays disabled until `docs/CONTACT-DELIVERY.md` is fulfilled.
8. Future product records generate static `/products/<slug>/` pages. New records require a rebuild; never copy test fixtures into inventory. Confirm their assets and documents as part of the upload.
9. If verification fails, restore the backup and re-test. Keep a sanitized deployment record with commit, date, document root confirmation and test results.

A GitHub build or package artifact is not evidence of live deployment. No WHC account, document root, DNS change or live delivery is verified by the implementation checks alone. This phase contains no automatic SFTP/FTP deployment or credentials.

Phase 1D adds a release manifest and isolated fixture job; it performs no automated upload or contact activation. The confirmed call number is (833) 696-9996.
