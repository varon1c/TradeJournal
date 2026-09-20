# Weekly Increment Report

**Week of:** September 14, 2026

## What changed this week

- Planned the TradeJournal app and defined its main purpose: helping me record trades, review losses, and identify trading patterns.
- Built the main TradeJournal dashboard.
- Added a trade form for entering the ticker or asset, entry price, exit price, position size, trade date, outcome, and setup notes.
- Added a trade journal that displays saved trades and their details.
- Added the ability to edit and delete trade entries.
- Added filters for viewing all trades, wins only, or losses only.
- Added statistics for total trades, wins, losses, win rate, and estimated profit/loss.
- Added browser local storage for demo mode so trade records can remain saved after refreshing the page.
- Created a PostgreSQL database schema for the `trades` table.
- Created Express API routes for adding, viewing, editing, and deleting trades.
- Made the layout responsive for desktop and mobile screen sizes.

## Why

These changes were made to create the main functions of TradeJournal. The goal is to have one place where I can record trades and review my performance instead of keeping information in separate notes or trying to remember past trades. The statistics and notes are especially useful for reviewing losses and learning from mistakes.

## What broke or what I got stuck on

I had some difficulty deciding how the trade data should be structured so it could work in both the browser demo mode and the PostgreSQL database version. I also needed to make sure the statistics update correctly whenever a trade is added, edited, or deleted.

Another challenge was connecting the frontend, Express API, and PostgreSQL database correctly. The app needs the correct environment variables and database connection before the live version can be tested.

## What is left

- Set up and run the PostgreSQL database locally.
- Connect the client to the real Express API instead of demo/local-storage mode.
- Test adding, editing, deleting, and filtering trades using the real database.
- Test that statistics update correctly with database records.
- Deploy the frontend, API, and database.
- Check the app on both desktop and mobile.
- Fix any remaining bugs and polish the UI before final submission.