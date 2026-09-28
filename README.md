# TradeJournal

A fast, responsive web application for logging daily trades, tracking performance metrics, and reviewing risk management.

A fast, responsive web application for logging daily trades, tracking performance metrics, and reviewing risk management.

Live site: https://varon1c.github.io/TradeJournal/ Live API (temporary): - Demo video: (link — to be added before finals)
## 1. Overview

TradeJournal is a personal web application for recording completed trades and reviewing trading performance over time. It is designed for a student learning trading who needs one organized place to review trade setups, wins, losses, and mistakes instead of relying on memory or scattered notes.

The app stores trade records with PostgreSQL, serves them through an Express API, and displays them in a React dashboard. It can also run in browser-only demo mode while a real database is being set up.

## Frontend and backend

- Frontend: React 18, Vite, React Router
- Backend: Node.js, Express
- Database: Neon serverless PostgreSQL

## Requirements

- Node.js 20 or newer
- A Neon PostgreSQL database (or a local PostgreSQL database for development)

## Install

```powershell
git clone https://github.com/varon1c/TradeJournal.git
cd TradeJournal

cd server
npm install
cd ..\client
npm install
```

## Configure Neon and authentication

Never commit `.env` files. They contain database credentials and the JWT signing secret.

```powershell
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
```

In `server/.env`, add the Neon connection string copied from the Neon dashboard and a unique JWT secret:

```env
DATABASE_URL=postgresql://USER:PASSWORD@YOUR-ENDPOINT.neon.tech/neondb?sslmode=require
CORS_ORIGINS=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
COOKIE_SAME_SITE=lax
NODE_ENV=development
```

Generate a secure JWT secret:

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Set `client/.env` to use the real API:

```env
VITE_USE_MOCK_API=false
# Leave blank locally: Vite proxies /api to localhost:3000.
VITE_API_BASE_URL=
```

Create the tables in Neon:

```powershell
cd server
npm run db:schema
```

The schema creates `users` and `trades`. Every trade belongs to a user, so one authenticated user cannot read, edit, or delete another user's journal.

## Run locally

Open two terminals.

**API**

```powershell
cd server
npm run dev
```

**Frontend**

```powershell
cd client
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`. Create an account, then sign in to access the journal.

Useful health checks:

```text
http://localhost:3000/healthz  # Express process
http://localhost:3000/readyz   # Neon/PostgreSQL connection
```

## Authentication

- `POST /api/auth/register` creates a user after validating the email and password.
- Passwords are hashed with bcrypt; plaintext passwords are never stored.
- `POST /api/auth/login` verifies the password and sets a signed JWT in an `HttpOnly` cookie.
- `GET /api/auth/me` restores the signed-in user when the page reloads.
- `POST /api/auth/logout` clears the cookie.
- All `/api/trades` routes require a valid session on the server, not just in the React UI.

For production, use HTTPS and set `NODE_ENV=production`. Keep `COOKIE_SAME_SITE=lax` when the frontend and API are same-site. If they are truly cross-site, use `COOKIE_SAME_SITE=none` with HTTPS and add CSRF protection.

## API endpoints

| Method | Path | Authentication | Purpose |
| --- | --- | --- | --- |
| `GET` | `/healthz` | No | Confirms Express is running. |
| `GET` | `/readyz` | No | Confirms PostgreSQL is reachable. |
| `POST` | `/api/auth/register` | No | Creates an account and signs the user in. |
| `POST` | `/api/auth/login` | No | Signs the user in. |
| `GET` | `/api/auth/me` | Yes | Returns the current user. |
| `POST` | `/api/auth/logout` | No | Clears the session cookie. |
| `GET` | `/api/trades` | Yes | Lists the signed-in user's trades. |
| `POST` | `/api/trades` | Yes | Creates a trade for the signed-in user. |
| `GET` | `/api/trades/:id` | Yes | Returns one owned trade. |
| `PUT` | `/api/trades/:id` | Yes | Updates one owned trade. |
| `DELETE` | `/api/trades/:id` | Yes | Deletes one owned trade. |

## Project structure

```text
client/                         React/Vite frontend
  src/App.jsx                   Protected routes and dashboard
  src/components/Login.jsx      Sign-in form
  src/components/SignUp.jsx     Account-creation form
  src/api/                      HTTP and mock API clients
server/                         Express API
  server.js                     Routes, JWT middleware, CORS, validation
  usersRepo.js                  Parameterized users queries
  sightingsRepo.js              Parameterized, user-scoped trade queries
  db/pool.js                    PostgreSQL/Neon connection pool
  db/schema.sql                 Users and trades schema
```

## Deployment

The GitHub Pages workflow builds and deploys the frontend when `main` changes. Configure its public values in GitHub Actions variables:

- `VITE_USE_MOCK_API=false`
- `VITE_API_BASE_URL=https://your-api-host.example`

Deploy the Express server separately and add `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`, `NODE_ENV=production`, and `COOKIE_SAME_SITE` in the server host's secret/environment-variable dashboard. Do not add these server secrets to GitHub Actions variables or frontend environment variables.

## License

MIT. Built by Charles Jansen V. Manusig (@varon1c), HAU 6APSI Final Project.


