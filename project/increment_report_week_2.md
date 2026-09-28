# Weekly Increment Report

**Week of:** September 21–28, 2026

## What changed this week

- Connected the project to a PostgreSQL database using Neon and organized the frontend and Express server into separate client and server folders.
- Added account registration, sign-in, sign-out, and protected routes so each user can access only their own trade journal.
- Secured passwords with bcrypt hashing and used signed JWT session cookies marked `HttpOnly`.
- Updated trade queries so creating, viewing, editing, and deleting a trade is scoped to the signed-in user.
- Added health and readiness endpoints to check that the API and database are available.
- Configured the client to use the live Express API while keeping mock/demo mode available for development.
- Deployed the React frontend to Vercel and the Express API to Render, then configured CORS and secure cross-site cookies for the production domains.
- Improved API and network error messages, including clear messages for expired sessions, missing trades, invalid JSON, disallowed origins, and temporary database problems.
- Updated the README with setup, environment-variable, API-route, architecture, and deployment instructions.

## Why

These changes move TradeJournal from a browser-only prototype toward a usable full-stack application. Authentication and user-owned database records protect each person's journal, while the live deployment makes the project accessible outside the local development environment. The clearer setup and error messages also make the app easier to test and maintain.

## What broke or what I got stuck on

The most difficult part was configuring authentication across separate frontend and backend domains. Cookies, CORS origins, HTTPS, environment variables, and the database connection all needed to match before sign-in and protected API requests worked correctly in production.

I also had to make sure that every trade query uses the authenticated user's ID. This prevents one account from viewing or changing another account's records, while keeping the existing dashboard and trade-management features working.

## What is left

- Perform a final end-to-end test of registration, sign-in, trade CRUD operations, filters, and dashboard statistics with multiple accounts.
- Check the deployed app on desktop and mobile screen sizes and fix any remaining UI issues.
- Add final security improvements such as rate limiting, CSRF protection, email verification, and password reset if time allows.
- Add exportable reports and more historical performance charts as future enhancements.
