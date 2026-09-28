# AI usage

This project was built with AI assistance. This record describes the assistance used for TradeJournal and the decisions made while integrating it.

## 1. How I used AI

### 2026-09-22 - PostgreSQL data layer

- **Tool:** OpenAI Codex
- **What I asked for:** Help identify the frontend and backend, then connect the Express API to PostgreSQL using the existing project structure.
- **What it gave back:** A review of the React/Vite client and Express server, plus parameterized repository queries and database setup guidance.
- **What I kept, what I changed, and why:** I kept the separation between the React client, Express routes, repository functions, and SQL schema because it makes the project easier to test and maintain.
- **Commit:** https://github.com/varon1c/TradeJournal/commit/e79c871

### 2026-09-28 - Neon database connection

- **Tool:** OpenAI Codex
- **What I asked for:** Update the database configuration so the backend could use Neon serverless PostgreSQL instead of only a local Docker database.
- **What it gave back:** A Neon-compatible `DATABASE_URL` setup and SSL-aware PostgreSQL pool configuration.
- **What I kept, what I changed, and why:** I kept environment-based configuration so the Neon URL is never stored in source code. I used local `.env` files and Render environment variables for secrets.
- **Commit:** https://github.com/varon1c/TradeJournal/commit/271c688

### 2026-09-28 - Secure user authentication

- **Tool:** OpenAI Codex
- **What I asked for:** Add sign-up, login, JWT cookies, bcrypt password hashing, and protected user-owned trades.
- **What it gave back:** Authentication endpoints, a users repository, a users database table, JWT middleware, and ownership checks for every trade query.
- **What I kept, what I changed, and why:** I kept the HttpOnly-cookie approach so the browser does not expose the token to client-side JavaScript. I also kept the user ID filter on trade queries because protecting only the React page would not secure the API itself.
- **Commit:** https://github.com/varon1c/TradeJournal/commit/271c688

### 2026-09-28 - React authentication screens

- **Tool:** OpenAI Codex
- **What I asked for:** Create login and sign-up screens and redirect unauthenticated users away from the dashboard.
- **What it gave back:** React Router setup, `Login.jsx`, `SignUp.jsx`, session restoration through `/api/auth/me`, and protected dashboard routing.
- **What I kept, what I changed, and why:** I kept the client-side route guard for usability, while relying on the server-side middleware as the actual security boundary.
- **Commit:** https://github.com/varon1c/TradeJournal/commit/271c688

### 2026-09-28 - Deployment documentation

- **Tool:** OpenAI Codex
- **What I asked for:** Improve the README using the organization of a reference project while keeping the content specific to TradeJournal.
- **What it gave back:** A clearer README with features, environment variables, API routes, architecture, and Vercel/Render deployment instructions.
- **What I kept, what I changed, and why:** I kept the structure but replaced inventory-specific details with TradeJournal's real frontend, API, Neon, Vercel, and Render setup.
- **Commit:** https://github.com/varon1c/TradeJournal/commit/a062802

### 2026-09-28 - Error handling and deployment cleanup

- **Tool:** OpenAI Codex
- **What I asked for:** Replace vague errors with useful user messages and remove unused ngrok support after moving to Render.
- **What it gave back:** Clear messages for unavailable network/API, expired sessions, database outages, invalid requests, missing trades, and rejected origins; it also removed ngrok-only request code.
- **What I kept, what I changed, and why:** I kept safe public messages while leaving technical details in server logs, so users receive help without exposing database or server internals.
- **Commit:** https://github.com/varon1c/TradeJournal/commit/c482892

## 2. Where the AI got it wrong

### Case 1 - Placeholder backend domain

- **What it gave me:** An example Render API domain, `https://tradejournal-api.onrender.com`, while explaining Vercel configuration.
- **What was wrong with it:** This was only an example, not my real service. Using it caused the frontend to call a different API and display validation errors from unrelated code.
- **What I did instead:** I used the actual Render service URL, `https://tradejournal-b21j.onrender.com`, after deployment completed.
- **Commit:** https://github.com/varon1c/TradeJournal/commit/271c688

### Case 2 - Incorrect CORS origin during deployment

- **What it gave me:** Initial configuration advice before the final Vercel domain was known.
- **What was wrong with it:** The API initially allowed the Render API URL or an older Vercel domain instead of the domain that the browser actually used. This caused browser requests to fail because CORS origins must match exactly.
- **What I did instead:** I set Render's `CORS_ORIGINS` to `https://tradejournalvaron1c.vercel.app`, without a trailing slash, and redeployed the API.
- **Commit:** https://github.com/varon1c/TradeJournal/commit/c482892

### Case 3 - Generic error messages were not helpful

- **What it gave me:** A generic `500 Internal Server Error` response for unexpected backend failures and the browser's raw `Failed to fetch` message for unreachable APIs.
- **What was wrong with it:** These messages did not tell a user whether to sign in, retry later, or check their connection.
- **What I did instead:** I added clear messages for session, network, CORS, database, request-validation, route, and trade-not-found cases, while keeping sensitive stack traces out of responses.
- **Commit:** https://github.com/varon1c/TradeJournal/commit/c482892

## 3. Who wrote what

### Written by me (varon1c)

- **File:** docs/01-proposal.md , docs/02-mockup.md, docs/03-design-system.md , docs/04-wireframes-component-breakdown.md
- **What it does and why it is built this way:** I created these md files which represent the start of the system foundation. i created the wireframes and the color codes myself to ensure the accuracy of the website to ensure that it is not painful in eyes of the users.

### The AI-written part I understand best

- **File:** `server/server.js`
- **Commit:** https://github.com/varon1c/TradeJournal/commit/c482892
- **What it does and why we kept it:** This file starts Express, parses JSON and cookies, controls CORS, handles authentication, validates inputs, and exposes the trade routes. The `requireAuth` middleware checks the JWT from the HttpOnly cookie before a trade route runs. The route passes the authenticated user's ID to the repository query, which is why each user sees only their own data. The final error middleware returns safe user-facing messages while logging details on the server.
