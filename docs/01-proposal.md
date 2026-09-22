# App Proposal: TradeJournal

## App name

TradeJournal

## What the app is for, in one sentence

TradeJournal helps a student trader record completed trades, review the reasons behind their wins and losses, and use performance data to improve future trading decisions.

## Who is it for

TradeJournal is for a student who is learning how to trade stocks, cryptocurrency, forex, or other assets. When the student opens the app, they want to quickly log a completed trade or review previous trades to find patterns in their results and mistakes.

## Sections or routes this app needs

TradeJournal is a single-page React application with these main sections:

| # | Section | What it is for |
| --- | --- | --- |
| 1 | Dashboard / performance overview | Shows the trader's win rate, win streak, average win-to-loss ratio, net profit or loss, and charts that summarize performance. |
| 2 | Monthly calendar | Shows the selected month's trading activity and makes winning, losing, and mixed-result days easy to spot. |
| 3 | Trade entry | Lets the user add a new completed trade or edit an existing one with its prices, size, result, date, and notes. |
| 4 | Trade journal | Displays saved trade entries, lets the user filter them by all trades, wins, or losses, and provides edit and delete controls. |

## State: what data does the app hold?

The most important screen is the dashboard because it combines the saved trade data with the journal and performance summaries.

| Data | Shape (rough) | Who owns it (which component) | Changes when... |
| --- | --- | --- | --- |
| Trades | `[{ id, ticker, entry_price, exit_price, position_size, trade_date, outcome, notes }]` | `App` | the app loads, or the user adds, edits, or deletes a trade. |
| Trade form | `{ ticker, entryPrice, exitPrice, positionSize, tradeDate, outcome, notes }` | `App` | the user types into the trade-entry form or selects an outcome. |
| Editing trade ID | `number \| null` | `App` | the user selects Edit, saves changes, or cancels editing. |
| Journal filter | `'all' \| 'win' \| 'loss'` | `App` | the user chooses which trade results to view. |
| Calendar month | `Date` | `App` | the user selects the previous or next month. |
| Loading, saving, and error status | strings, booleans, and `Error \| null` | `App` | trade data is loading, a form is submitting, or an API request fails. |

The calculated statistics, charts, and calendar summaries are derived from the `trades` state, so they do not need to be stored separately.

## What each screen contains

- Screen: Dashboard / performance overview
  - Block 1: A top navigation bar with the TradeJournal name, links to the dashboard sections, and an Add Trade button.
  - Block 2: Summary cards for the current win streak, win rate, and average win-to-loss ratio.
  - Block 3: A monthly calendar that marks days containing wins, losses, or both.
  - Block 4: A WaveScore radar summary and small charts for monthly trade count and balance.
  - Block 5: A performance summary with net profit/loss and total wins versus losses.

## Content you need to gather

- Sample trade records with realistic tickers, dates, entry and exit prices, position sizes, outcomes, and notes.
- Clear labels and short helper text for the trade-entry form and performance statistics.
- A TradeJournal wordmark or simple logo treatment for the header.
- A PostgreSQL database connection for the full version, plus seeded sample data for testing.
- Screenshots of the finished desktop and mobile layouts for the documentation.

## One risk

The part I am least sure about is making the calculated analytics accurate and understandable, especially the running balance chart, win-to-loss ratio, and calendar results when there are multiple trades on the same day. I will test these calculations with known sample trades before relying on the displayed values.
