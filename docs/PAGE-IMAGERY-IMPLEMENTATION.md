# Page imagery implementation — October 12, 2026

This update enriches 11 pages with 12 unique images: a new homepage equipment hero and wildlife feature, all seven equipment categories, and About, Industries and Government Procurement introductions. Each image appears once. The catalogue remains sourcing-led with zero product inventory records.

Eight public-domain photographs and four owner-approved generated scenes are recorded in `content/page-images.json`. Sources, usage rights, hashes, dimensions, page and placement are retained. Neutral descriptive alt text accompanies each image. No supplier affiliation, completed company project, model certification or stock claim is added. The approved logo is preserved.

Responsive WebP exports total approximately 3.55 MiB across the entire set and all variants; a page loads only its own selected responsive files. Intro/hero images are eager; the lower homepage image is lazy. Intrinsic dimensions reserve image space. Portrait equipment and fence photographs retain their full subject rather than cropping away relevant details. No third-party image host is contacted by visitors.

## Uniqueness review

All 12 selected originals and their contact sheet were visually inspected. SHA-256 and perceptual difference-hash screening found no exact or near-duplicate candidates within the set or among 332 accessible local image files from other ChatGPT projects. Available inventory contact sheets were reviewed for visual overlap. Remote-only, archived and inaccessible prior-site inventories were not covered; this is not a portfolio-wide verification claim. Local audit output is retained outside the public site.

## Verification

- Focused ESLint and TypeScript checks passed locally. No Mac web server was started.
- The cloud workflow checks original/source uniqueness, output hashes, and exactly one placement per image in exported HTML.
- Browser verification loads each image on all 11 pages at 1440px and 320px, checks alt text, decoding and horizontal overflow, and captures screenshots.
- Existing browser, accessibility, unit and synthetic product/contact checks remain enabled.
- Both jobs passed in [cloud run 38296058442](https://github.com/GrafovGroup/BearTraps/actions/runs/38296058442) for implementation commit `bfbce257f4356c099548228f7e14a92832c05317`: install, audit under the existing time-limited lint exception, lint, TypeScript, unit tests, PHP checks, catalogue validation, export, image checks, Chromium/Firefox/WebKit workflows, axe scans and the isolated product/contact job.
- All 12 images decoded on their assigned pages at 1440px and 320px; no horizontal overflow. Desktop/mobile contact sheets and the full homepage screenshot were visually inspected. The dedicated homepage imagery snapshot catches the lower wildlife section while the normal desktop screenshot verifies the hero.
- The downloaded static ZIP and all 139 manifest file hashes matched. ZIP SHA-256: `156b38bf928d679ca07f6d79bc7d7b8ff49e011ffd60971f6ade8f6914b37960`.
- [WHC package and manifest](https://github.com/GrafovGroup/BearTraps/actions/runs/38296058442/artifacts/11767868173); [browser evidence](https://github.com/GrafovGroup/BearTraps/actions/runs/38296058442/artifacts/11768077951). Artifacts expire October 26, 2026. Subsequent documentation-only commits do not change the tested deployment package.

## Operating state

The image update is live on WHC after explicit owner approval on October 12, 2026. See [deployment verification](DEPLOYMENT-IMAGERY-2026-10-12.md). Contact remains email-app preparation to info@beartraps.ca. Phone remains (833) 696-9996. The image update does not alter DNS, mail, supplier records or contact delivery.
