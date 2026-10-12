# Dependency and deployment security

The first Phase 1C cloud audit found Next.js advisories GHSA-vcvr-r3jv-pc5j and GHSA-cjq9-62q9-8jv4. Next.js and its ESLint configuration are upgraded from 16.3.4 to **16.3.8** with a regenerated lockfile. The deployed WHC site serves static files; it does not run the vulnerable Next image/OG server endpoints. This does not justify retaining outdated build dependencies.

References: [Next OG advisory](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j), [image optimization advisory](https://github.com/advisories/GHSA-cjq9-62q9-8jv4).

## Time-limited lint dependency exception

[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) affects braces <=3.0.3 with no published fix at review. The dependency is used through eslint-config-next → ESLint plugin → fast-glob → micromatch in development linting. It is not shipped as an executable server on WHC or used to process visitor-provided glob patterns. Repository-controlled lint patterns are the relevant input. Untrusted code in a PR must not receive secrets.

Only this GHSA is excluded from the high/critical gate in pnpm-workspace.yaml. The exception expires **October 26, 2026**; CI fails after that date until the dependency is fixed or a new explicit assessment is recorded. Other high/critical findings and audit service failures block CI. Lower-severity findings remain visible for triage. This is a scoped exposure assessment, not a claim of zero vulnerabilities.

The PHP contact bridge is excluded from the static ZIP and must not be deployed until credentials, private storage, full upstream validation/spam/queue, privacy retention and actual inbox delivery have been verified. Its own per-IP limit alone is not sufficient spam protection.
