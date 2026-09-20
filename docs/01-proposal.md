# TradeJournal Proposal

## Overview

TradeJournal is a personal website for logging completed trades and reviewing performance over time. It is for me as a student learning trading, so I can record both wins and losses, review my setup notes, and identify repeated mistakes instead of relying on memory.

## Problem it solves

Trading notes can easily become scattered across paper, phone notes, or memory. This makes it difficult to review why a trade was taken or learn from a loss. TradeJournal keeps each trade in one place and turns the history into useful statistics, including total trades, wins, losses, win rate, and estimated profit/loss.

## Main user flow

1. Open the TradeJournal dashboard.
2. Enter the ticker or asset, entry price, exit price, position size, trade date, outcome, and setup notes.
3. Select **Add to journal** to save the trade.
4. Review the trade list and use the filter to view all trades, wins, or losses.
5. Review the statistics and notes to learn from each result.

## Current features

- Log a completed trade.
- View trades from newest to oldest.
- Edit and delete trade entries.
- Filter entries by wins and losses.
- Switch to a monthly calendar view that marks winning days green and losing days red.
- Show total trades, wins, losses, win rate, and estimated profit/loss.
- Save demo entries in browser local storage.
- Provide a PostgreSQL schema and Express API for permanent storage.
- Use a responsive layout for desktop and mobile.

## Database design

The main database item is a **trade**. PostgreSQL stores these records so data remains available after closing the browser and can be sorted, updated, deleted, and summarized.

| Field | Purpose |
| --- | --- |
| `id` | Unique ID for each trade |
| `ticker` | Stock, cryptocurrency, forex pair, or other asset |
| `entry_price` | Price when the trade opened |
| `exit_price` | Price when the trade closed |
| `position_size` | Shares, units, or contracts traded |
| `trade_date` | Date of the trade |
| `outcome` | `win` or `loss` |
| `notes` | Setup, reason, mistake, or lesson |
| `created_at` | Date and time the journal entry was saved |

## Technology

- **Frontend:** React and Vite
- **Backend:** Node.js and Express
- **Database:** PostgreSQL
- **Local demo mode:** browser local storage
- **Deployment plan:** GitHub Pages for the frontend and separate hosting for the API and PostgreSQL database

## Next steps

- Install and connect PostgreSQL locally.
- Test all create, read, update, and delete API actions with the real database.
- Add filtering by ticker and date.
- Add charts for win rate and performance over time.
- Add support for trade direction and fees so profit/loss is more accurate.
