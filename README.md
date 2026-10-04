<img width="354" height="352" alt="Untitled" src="https://github.com/user-attachments/assets/d8884f31-02ad-4331-bd44-1a75ebec824e" />

# TradeJournal

TradeJournal is a responsive personal trading journal for recording completed trades, reviewing performance, and learning from wins and losses.

**Live site:** https://tradejournalvaron1c.vercel.app
**Live API health check:** https://tradejournal-b21j.onrender.com/healthz
**AI usage** [AI-USAGE.md](https://github.com/varon1c/TradeJournal/blob/main/AI-USAGE.md)

## What it does

- **Private trade journals:** Users create an account and sign in before accessing their own trades.
- **Trade management:** Add, edit, delete, and review trade entries with ticker, price, size, date, result, and notes.
- **Performance dashboard:** View win rate, streaks, average win/loss ratio, net profit/loss, calendar activity, and monthly trends.
- **Secure authentication:** Passwords are hashed with bcrypt. A signed JWT is stored in an `HttpOnly` cookie, so JavaScript cannot read it.
- **User-owned data:** The API scopes every trade query to the authenticated user, preventing one user from accessing another user's trades.

## Built with

- **Frontend:** React 18, Vite, React Router, vanilla CSS
- **Backend:** Node.js, Express, CORS, cookie-parser
- **Database:** Neon serverless PostgreSQL
- **Security:** bcrypt, JSON Web Tokens, HttpOnly cookies, parameterized SQL queries
- **Deployment:** Vercel (frontend) and Render (Express API)

## Run it locally

### Requirements

- Node.js 20 or newer
- A Neon PostgreSQL database, or local PostgreSQL for local-only development
- Git and PowerShell/terminal

### Install dependencies

```powershell
git clone https://github.com/varon1c/TradeJournal.git
cd TradeJournal

cd server
npm install

cd ..\client
npm install
```

### Configure environment files

Create local files from the committed templates. Never commit real `.env` files.

```powershell
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
```

Set `server/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@YOUR-ENDPOINT.neon.tech/neondb?sslmode=require
CORS_ORIGINS=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
COOKIE_SAME_SITE=lax
NODE_ENV=development
```

Generate a new JWT secret:

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Set `client/.env` for local API use:

```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=
```

Leave `VITE_API_BASE_URL` blank locally because Vite proxies `/api` to `http://localhost:3000`.

### Create database tables

```powershell
cd server
npm run db:schema
```

This creates the `users` and `trades` tables in the configured PostgreSQL database.

### Start the full stack

Open two terminals.

**Terminal 1 — Express API**

```powershell
cd server
npm run dev
```

**Terminal 2 — React frontend**

```powershell
cd client
npm run dev
```

Open `http://localhost:5173`, create an account, and begin logging trades.

## Environment variables

| Variable | Location | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Server | Neon/PostgreSQL connection string. Keep secret. |
| `JWT_SECRET` | Server | Secret used to sign login tokens. Keep secret. |
| `JWT_EXPIRES_IN` | Server | Login-session duration, for example `7d`. |
| `CORS_ORIGINS` | Server | Allowed frontend URL, without a trailing slash. |
| `COOKIE_SAME_SITE` | Server | `lax` locally; `none` when frontend and API use different production domains. |
| `NODE_ENV` | Server | `development` locally; `production` on the deployed API. |
| `VITE_USE_MOCK_API` | Client | Set to `false` to use the secured Express API. |
| `VITE_API_BASE_URL` | Client | Deployed API URL; leave blank for local Vite proxying. |

Variables beginning with `VITE_` are embedded in the browser build. Never put database URLs, passwords, or JWT secrets in them.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/healthz` | Confirms the Express process is alive. |
| `GET` | `/readyz` | Confirms PostgreSQL is reachable. |
| `POST` | `/api/auth/register` | Creates an account and starts a session. |
| `POST` | `/api/auth/login` | Verifies credentials and starts a session. |
| `GET` | `/api/auth/me` | Returns the current signed-in user. |
| `POST` | `/api/auth/logout` | Clears the session cookie. |
| `GET` | `/api/trades` | Lists the signed-in user's trades. |
| `POST` | `/api/trades` | Creates a trade for the signed-in user. |
| `GET` | `/api/trades/:id` | Gets a single owned trade. |
| `PUT` | `/api/trades/:id` | Updates a single owned trade. |
| `DELETE` | `/api/trades/:id` | Deletes a single owned trade. |

## Deployment

### Frontend — Vercel

The Vercel project uses the `client/` directory as its root directory. Its public build variables are:

```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://tradejournal-b21j.onrender.com
```

### Backend — Render

The Render web service deploys the `server/` directory. Its production variables are:

```env
DATABASE_URL=your-neon-connection-string
JWT_SECRET=your-unique-secret
JWT_EXPIRES_IN=7d
CORS_ORIGINS=https://tradejournalvaron1c.vercel.app
COOKIE_SAME_SITE=none
NODE_ENV=production
```

The production frontend and API use different domains, so the API requires `COOKIE_SAME_SITE=none` and HTTPS. Do not store these server secrets in GitHub or Vercel.

## Project structure

```text
TradeJournal/
├── client/                         # React + Vite frontend
│   ├── src/
│   │   ├── api/                    # HTTP and mock API clients
│   │   ├── components/             # Login, SignUp, and UI components
│   │   ├── App.jsx                 # Protected routes and dashboard
│   │   └── styles.css              # Responsive styles
│   └── vite.config.js
├── server/                         # Express API
│   ├── db/                         # Connection pool, schema, and seed scripts
│   ├── server.js                   # API routes and JWT middleware
│   ├── usersRepo.js                # Users table queries
│   └── sightingsRepo.js            # User-scoped trade queries
├── docs/                           # Project documentation
└── compose.yml                     # Optional local Docker/PostgreSQL setup
```

## Architecture

The React client handles UI state, forms, protected routes, and dashboard calculations. It calls the Express API with cookies enabled. Express validates all incoming data, verifies the JWT cookie, and runs parameterized PostgreSQL queries against Neon. The API applies the authenticated user ID to every trade operation before returning data.

## What I would do next

- Add email verification, password reset, rate limiting, and CSRF protection.
- Add exportable reports and more historical performance charts.

## License

MIT. Built by Charles Jansen V. Manusig (@varon1c), HAU 6APSI Final Project.
