-- Sample trades for local development only. This clears the local table.
TRUNCATE TABLE trades RESTART IDENTITY;

INSERT INTO trades (ticker, entry_price, exit_price, position_size, trade_date, outcome, notes) VALUES
  ('AAPL', 210.15, 214.80, 10, '2026-08-28', 'win', 'Breakout above pre-market resistance. Took profit near the next resistance level.'),
  ('BTCUSD', 114200.00, 112950.00, 0.02, '2026-08-30', 'loss', 'Entered too early before confirmation. Wait for the candle close next time.'),
  ('TSLA', 335.40, 342.10, 5, '2026-09-03', 'win', 'Followed the trend after a pullback to support.'),
  ('NVDA', 178.90, 176.20, 8, '2026-09-06', 'loss', 'Stopped out. Risk was managed, but the setup was not strong enough.'),
  ('ETHUSD', 4300.00, 4385.00, 0.15, '2026-09-10', 'win', 'Clean bounce from a key support zone.'),
  ('MSFT', 502.30, 499.60, 6, '2026-09-13', 'loss', 'Chased the move after the entry signal had already passed.');
