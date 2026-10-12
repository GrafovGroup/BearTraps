# Formspree implementation and deployment — October 12, 2026

The owner requested connection to https://formspree.io/f/xqpedwyv and explicitly authorized one labelled test enquiry. The React/Next.js static site now submits contact enquiries directly to this endpoint from WHC. The existing React state/validation is tailored to the Formspree JSON interface; no additional dependency or PHP service was introduced.

## Behavior
- Preserves name, email, optional organization/phone, subject/product prefill, message and required consent.
- Sends JSON with Accept: application/json, no credentials or custom idempotency header; maps the honeypot to _gotcha.
- Success requires HTTP success and ok: true. Errors, timeouts and rate limits preserve fields and offer retry/direct-email guidance.
- Blocks concurrent requests and repeated identical confirmed submissions within the mounted form. Unconfirmed network retries can still duplicate a provider submission; no server idempotency claim is made.
- Contact/privacy/terms copy now describes direct submissions through Formspree. Uppercase button labels and accessible validation remain.
- Formspree dashboard recipient, retention, spam controls and quotas remain owner-managed. No credentials, DNS, MX or mail settings changed.

## Test and deployment evidence
- Implementation commit: 3823aa4344c8095397f3f4f93ccd9765ea168aeb.
- Cloud run: https://github.com/GrafovGroup/BearTraps/actions/runs/38297612055. Both website and product-fixtures jobs passed.
- Local TypeScript, focused lint and five contact/provider tests passed. CI additionally ran unit/catalogue/export/image checks, Chromium/Firefox/WebKit interaction checks, accessibility scans and isolated product/contact tests. The existing lint dependency audit exception remains documented.
- Browser tests mock Formspree, verifying field mapping, 429 retry recovery, success and duplicate suppression; these do not send mail.
- Release artifact: 11768959493. ZIP SHA-256: 3e25e3fbfb05b4757f6932181c3fa7ad5c7ac2a716dec94488a907af7708e34b.
- All 139 manifest files verified before WHC upload. Private rollback archive: beartraps-backup-before-formspree-20261012.zip. Deployed archive retained privately as beartraps-formspree-20261012.zip.
- After deployment, all 138 public files matched the manifest. All 16 checked routes returned 200 with the correct logo/phone. HTTPS/www and legacy contact redirects, 404 behavior, security/cache headers passed. Public archive URLs return 404.
- One owner-authorized test was submitted through the live contact page. The form displayed its provider-confirmed success state. No repeat test was sent.
- Actual receipt in the configured recipient inbox still requires owner confirmation; provider acceptance is not proof of inbox delivery.
- Local screenshot: design/page-images-2026-10-12/formspree-live-confirmation.png.

The live integration is https://beartraps.ca/contact/. PR #6 remains stacked on the image update; no PRs were merged.

References: [Formspree React guide](https://github.com/formspree/formspree-js/tree/main/packages/formspree-react), [Formspree AJAX guide](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/).
