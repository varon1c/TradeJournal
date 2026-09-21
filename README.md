# TradeJournal

A fast, responsive web application for logging daily trades, tracking performance metrics, and reviewing risk management.
Live site: https://varon1c.github.io/TradeJournal/ Live API (temporary): - Demo video: (link — to be added before finals)
## 1. Overview

TradeJournal is a personal web application for recording completed trades and reviewing trading performance over time. It is designed for a student learning trading who needs one organized place to review trade setups, wins, losses, and mistakes instead of relying on memory or scattered notes.

The app stores trade records with PostgreSQL, serves them through an Express API, and displays them in a React dashboard. It can also run in browser-only demo mode while a real database is being set up.

## 2. Setup and installation

### Requirements

- [Node.js](https://nodejs.org/) 20 or newer
- PostgreSQL 17 or newer for the full database version
- Git
- A terminal such as PowerShell or the VS Code integrated terminal

### Get the code

```powershell
git clone https://github.com/varon1c/TradeJournal.git
cd TradeJournal
```

### Install dependencies

Install the server and client dependencies separately:

```powershell
cd server
npm install
cd ../client
npm install
cd ..
```

### Environment and configuration

Never commit real passwords or connection strings. Create the local `.env` files from the supplied examples.

**Server:** copy `server/.env.example` to `server/.env`.

| Variable | Example value | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `postgres://postgres:your_password@localhost:5432/tradejournal` | PostgreSQL connection string. |
| `CORS_ORIGINS` | `http://localhost:5173` | Frontend origin allowed to call the API. |
| `NODE_ENV` | `development` | Server environment. |
| `PORT` | `3000` | Optional local API port; deployment hosts normally provide this automatically. |

**Client:** copy `client/.env.example` to `client/.env`.

| Variable | Example value | Purpose |
| --- | --- | --- |
| `VITE_USE_MOCK_API` | `false` | Set to `false` for PostgreSQL/API mode; set to `true` for browser-only demo mode. |
| `VITE_API_BASE_URL` | `http://localhost:3000` | Public base URL for the Express API. |

On Windows PowerShell, create the files with:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

### Set up and seed the database

1. Create a PostgreSQL database named `tradejournal`:

   ```powershell
   createdb tradejournal
   ```

2. Add the database connection string to `server/.env`.

3. Create the `trades` table and load the sample entries:

   ```powershell
   cd server
   npm run db:reset
   ```

`db:reset` runs [server/db/schema.sql](server/db/schema.sql) and [server/db/seed.sql](server/db/seed.sql). The seed script clears existing local trade records, so only use it for development data.

## 3. How to run it

### Full version: React, Express, and PostgreSQL

With PostgreSQL running and the setup above completed, open two terminals.

**Terminal 1 — API**

```powershell
cd server
npm run dev
```

The API should start at `http://localhost:3000`. Visiting `http://localhost:3000/healthz` should return `{"ok":true}`.

**Terminal 2 — client**

Make sure `client/.env` includes:

```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:3000
```

Then run:

```powershell
cd client
npm run dev
```

Open `http://localhost:5173`. You should see the TradeJournal dashboard with trade statistics, a **Log a trade** form, and the trade journal list.

### Demo mode: no PostgreSQL required

To run only the interface, set this in `client/.env`:

```env
VITE_USE_MOCK_API=true
```

Then run `npm run dev` in `client`. This mode saves trades in that browser's local storage; data is not shared and is deleted if browser storage is cleared.

## 4. Features and usage

1. Open the dashboard at `http://localhost:5173`.
2. In **Log a trade**, enter a ticker or asset, entry price, exit price, position size, date, outcome, and optional setup notes.
3. Select **Add to journal**. The new entry appears in the journal and the statistics update.
4. Use the journal filter to show all trades, wins, or losses.
5. Select **Edit** to correct a trade, or **Delete** to remove an entry.

The dashboard opens with an analytics view: a winstreak card, win-rate gauge, average win/loss ratio, monthly calendar, WaveScore radar, trade-count trend, and balance trend. These values are calculated from saved trades. Estimated profit/loss is calculated as `(exit price − entry price) × position size`.

### API endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/healthz` | Confirms the Express process is running. |
| `GET` | `/readyz` | Confirms PostgreSQL is reachable. |
| `GET` | `/api/trades` | Returns all trades, newest first. |
| `GET` | `/api/trades/:id` | Returns one trade. |
| `POST` | `/api/trades` | Creates a trade. |
| `PUT` | `/api/trades/:id` | Updates a trade. |
| `DELETE` | `/api/trades/:id` | Deletes a trade. |

## 5. Project structure

```text
client/                  React and Vite frontend
  src/App.jsx            Dashboard, trade form, statistics, and journal UI
  src/api/               API clients for demo mode and the Express API
  src/styles.css         Responsive styles
server/                  Express API
  server.js              Routes, validation, CORS, and server startup
  sightingsRepo.js       Parameterized PostgreSQL queries for trades
  db/schema.sql          PostgreSQL trades table and index
  db/seed.sql            Sample development trades
docs/                    Proposal, design, weekly reports, and other coursework docs
compose.yml              Optional Docker Compose setup for PostgreSQL and the API
```

## 6. Screenshots

<img width="1358" height="890" alt="demoo_desktop" src="https://github.com/user-attachments/assets/494c111f-ab57-4e21-8eb5-5bf414365f38" />
<img width="322" height="710" alt="demo_phone" src="https://github.com/user-attachments/assets/b25d4642-d7f8-49d3-97c5-cbc33c9b4299" />
<img width="1244" height="726" alt="jourrnal" src="https://github.com/user-attachments/assets/90774672-e207-43c7-bbda-cf82b567f650" />

## 7. Architecture
TradeJournal follows a three-tier client-server architecture. The React and Vite frontend provides the dashboard, journal form, charts, and trade history interface. It communicates with the Node.js and Express backend through REST API requests to create, view, update, and delete trade records. The Express server validates requests and passes data operations to a separate repository layer, which uses parameterized SQL queries to securely read and write trade data in PostgreSQL. For demonstration without a database, the frontend can switch to a mock API that stores entries in the browser’s local storage.

## 8. Known issues and next steps

- The PostgreSQL schema and API are complete, but the database still needs to be installed, configured, and tested locally on the development computer.
- Demo mode uses local storage only; it is not shared between browsers or users.
- The estimated profit/loss calculation assumes a long position. A future version should support long/short trade direction and fees.
- Add search or filtering by ticker and date.
- Add charts to show performance and win rate over time.
- Capture and add a real screenshot after running the app.

## Presentation

- Video: Pending
- Slides: Pending
- Square image: Pending

Author & Licence
Built by Charles Jansen V. Manusig (@varon1c) — HAU · 6APSI Final Project. MIT License.



