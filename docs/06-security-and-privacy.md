# Security and privacy — TradeJournal

Reviewed: 4 October 2026

TradeJournal is a personal trading journal. It stores an account email and password hash, plus the trade entries created by that account: ticker, prices, position size, date, outcome, and optional notes. It is not intended to collect real classmates' data or financial-account credentials.

## Repository and secrets

- [x] `.gitignore` ignores `.env` and `.env.*`, while retaining `.env.example`.
- [x] Server and client environment templates are committed with placeholder values only.
- [x] No tracked `.env`, PEM, or `id_rsa` file was found during the review.
- [x] Database URLs and JWT secrets are documented as server-only values. `VITE_` variables are explicitly identified as public browser-build values.
- [ ] Before each public push, run `git check-ignore -v .env` and inspect Git history for accidentally committed secrets. A leaked credential must be rotated at its provider before history cleanup.

## Application controls checked

- [x] Passwords are validated server-side and hashed with bcrypt (cost factor 12). Plaintext passwords are not stored or returned.
- [x] Authentication uses a signed JWT in an `HttpOnly` cookie. Cookies are marked `Secure` in production and have a seven-day expiry.
- [x] The API validates credentials and trade input on the server, including email format, password length, ticker length, numeric values, valid dates, permitted outcomes, and a 2,000-character notes limit.
- [x] JSON request bodies are limited to 100 KB.
- [x] Database queries use PostgreSQL parameter placeholders and value arrays.
- [x] Trade reads, updates, and deletes include the authenticated `user_id` in the query, preventing one signed-in user from accessing another user's entries.
- [x] CORS uses the `CORS_ORIGINS` allowlist and enables credentials only for approved origins.
- [x] Error responses are generic; stack traces and database details are written to server logs rather than returned to visitors.
- [ ] Add `helmet` before production release to set standard security headers.
- [ ] Add rate limiting to sign-up, login, and other expensive endpoints to reduce password-guessing and abuse.
- [ ] Add CSRF protection before deploying with `COOKIE_SAME_SITE=none`, because the frontend and API may be on different sites.
- [ ] Run `npm audit` in both `server/` and `client/`, review the results, and apply safe dependency updates before submission.

## Privacy commitments

- [x] The checked seed file uses fictional, market-style sample trades rather than names, emails, photos, or real account data.
- [x] The app should collect only the information required for an account and its private trade journal.
- [x] Users' journal records are isolated by account at the API and database-query layers.
- [ ] Before recording a demo video or publishing screenshots, remove real email addresses, trade notes, account balances, classmates' information, and any other personal data.
- [ ] Add a short in-app privacy notice explaining what data is collected, why it is needed, and how a user can request deletion.
- [ ] Delete all real tester data before the public submission. Use invented data for screenshots, seed files, and demos.

## Known trade-offs and next steps

The main risk is that trade notes can reveal personal financial behaviour or sensitive strategy details if a user shares screenshots or uses a shared device. TradeJournal reduces the risk by requiring sign-in, using `HttpOnly` session cookies, and scoping every trade query to its owner. The current project does not yet include rate limiting, Helmet, or CSRF protection for cross-site cookies; those controls should be added before treating the deployment as production-ready. Users should avoid entering brokerage credentials, account numbers, or other unnecessary personal information in trade notes.
