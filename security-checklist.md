# Security Checklist — TradeJournal

Reviewed: 4 October 2026. Statuses are based on the repository contents reviewed locally. Checks that require GitHub, Neon, Vercel, or Render dashboard access are deliberately marked **No** until verified there.

## Secrets and credentials

| # | Check | Status | Evidence |
| --- | --- | --- | --- |
| 1 | `.env` is gitignored and is not in the repository | Yes | `.gitignore` ignores `.env` and `git check-ignore -v .env` confirmed it; no tracked `.env`, PEM, or `id_rsa` file was found. |
| 2 | A `.env.example` with placeholder values only is committed | Yes | `server/.env.example` and `client/.env.example` are committed and contain setup placeholders. |
| 3 | No connection string, key, token, or password is hardcoded in source | Yes | The server reads `DATABASE_URL` and `JWT_SECRET` from environment variables; reviewed examples contain placeholders only. |
| 4 | Git history has been audited for leaked secrets | No | This must still be checked with `git log -p` and a secret scan before the next public push. |
| 5 | Any credential ever committed has been rotated | N/A | No committed credential is known; complete the history audit in check 4 to confirm. |
| 6 | Production credentials live only in hosting-provider environment settings | No | The repository documents this requirement, but the provider dashboards must still be verified manually. |

## GitHub Actions

| # | Check | Status | Evidence |
| --- | --- | --- | --- |
| 7 | No secret value is written literally in workflow YAML | Yes | `.github/workflows/deploy-pages.yml` uses public `VITE_` repository variables and warns against secrets. |
| 8 | Workflow secrets are stored and read safely | N/A | The workflow does not use secrets; its Vite settings are public build-time values. |
| 9 | Workflow logs have been checked for secrets | N/A | The workflow receives no secrets. |
| 10 | Uploaded build artifacts contain no secret file or generated secret config | No | Inspect the next successful GitHub Actions artifact before marking complete. |
| 11 | Third-party actions are pinned to commit SHAs | No | The workflow uses version tags such as `actions/checkout@v4`, not immutable commit SHAs. |
| 12 | Secret scanning and push protection are enabled | No | Verify and enable these GitHub repository settings. |

## Database

| # | Check | Status | Evidence |
| --- | --- | --- | --- |
| 13 | Every query taking user input uses parameters | Yes | `usersRepo.js` and `sightingsRepo.js` use PostgreSQL placeholders and value arrays. |
| 14 | The database is reachable only by the app or approved clients | No | Confirm Neon IP/network access settings and database credentials in the provider dashboard. |
| 15 | The database user has only necessary permissions | No | Review the Neon role and permissions before production release. |
| 16 | Seed and sample data is invented | Yes | `server/db/seed.sql` contains sample market tickers and trade notes, not personal records. |
| 17 | Debug, seed, and reset routes are not public API routes | Yes | The Express API exposes health, auth, and trade routes only; database scripts are local commands. |

## Access control

| # | Check | Status | Evidence |
| --- | --- | --- | --- |
| 18 | The app has real login-based access control | Yes | Registration, login, JWT verification, and protected client routes are implemented. |
| 19 | Supabase/Firebase row-level controls are enabled | N/A | TradeJournal uses PostgreSQL through Express, not Supabase or Firebase. |
| 20 | An external access-gate policy is configured | N/A | The app uses its own account authentication instead of an external access gate. |
| 21 | Data routes enforce ownership | Yes | Trade queries include the authenticated `user_id`; reads, updates, and deletes are owner-scoped. |
| 22 | Authentication credentials are environment variables, not source code | Yes | JWT signing uses `process.env.JWT_SECRET`; database access uses `process.env.DATABASE_URL`. |

## Input and output

| # | Check | Status | Evidence |
| --- | --- | --- | --- |
| 23 | User input is validated on the server | Yes | `server.js` validates credentials and all trade fields, including lengths and values. |
| 24 | User text is safely rendered | Yes | React renders trade notes as text; no `dangerouslySetInnerHTML` or direct `innerHTML` use was found. |
| 25 | Error responses avoid implementation details | Yes | The final Express error handler returns generic messages while details go to server logs. |
| 26 | CORS is not a wildcard for data-changing routes | Yes | `CORS_ORIGINS` is parsed into an explicit allowlist and credentials are enabled only for approved origins. |

## Repository and privacy

| # | Check | Status | Evidence |
| --- | --- | --- | --- |
| 27 | No personal contact details, student number, or home address are in the repository | Yes | The unfilled template's unrelated email example was removed; the reviewed project files contain no student number, phone number, or address. |
| 28 | No classmate's personal data is in the repository | Yes | Seed data and documentation use fictional trading examples; no classmate data was found in the reviewed files. |
| 29 | Dependencies are from official registries and `node_modules` is ignored | Yes | NPM lock files are present and `.gitignore` ignores `node_modules/`. |
| 30 | Images, fonts, and assets are owned, licensed, or credited | No | Verify image sources and Google Fonts licensing/attribution before submission. |
| 31 | Repository visibility has been deliberately checked after the last push | No | Confirm the repository visibility in GitHub before submission. |

## Findings and actions

The review confirmed that TradeJournal already has strong application-level foundations: server-side validation, parameterized queries, authenticated owner-scoped records, explicit CORS, and safe session-cookie handling. It also found an unrelated personal-email example in the original checklist template; that example has been removed. The remaining items require provider-dashboard verification or further hardening, especially secret-history review, database access restrictions, dependency auditing, rate limiting, Helmet, and CSRF protection for cross-site cookies.
