-- The complete shape of the database. Safe to run against an empty database,
-- and safe to run twice.
--
-- This file is committed on purpose. Your schema is a fact about your
-- application, not a runtime concern: it should be readable by opening a file
-- rather than by connecting to a server. It is also what lets you move to a
-- hosted database in one command.

CREATE TABLE IF NOT EXISTS trades (
  id            SERIAL PRIMARY KEY,
  ticker        VARCHAR(20)    NOT NULL,
  entry_price   NUMERIC(14, 4) NOT NULL CHECK (entry_price >= 0),
  exit_price    NUMERIC(14, 4) NOT NULL CHECK (exit_price >= 0),
  position_size NUMERIC(14, 4) NOT NULL CHECK (position_size > 0),
  trade_date    DATE           NOT NULL,
  outcome       VARCHAR(4)     NOT NULL CHECK (outcome IN ('win', 'loss')),
  notes         TEXT           NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ    NOT NULL DEFAULT now()
);

-- The list page always sorts newest first. Without this the database reads
-- every row and sorts it on each request.
CREATE INDEX IF NOT EXISTS trades_trade_date_idx
  ON trades (trade_date DESC, created_at DESC);
