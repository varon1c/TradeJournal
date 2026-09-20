# TradeJournal Mockup

## Analytics dashboard

TradeJournal now uses a dark, data-first dashboard. It takes the structure of the supplied reference: a compact metric row, a calendar-led analytics area, a radar summary, and small line charts. The working trade-entry form and trade history remain below the analytics area.

```text
┌───────────────────────────────────────────────────────────────────┐
│ TradeJournal                         Performance  Journal  + Trade │
├───────────────────────┬──────────────────┬────────────────────────┤
│ Winstreak             │ Winrate          │ Avg win / avg loss     │
│ Current run, wins/loss│ Donut gauge      │ Blue/red ratio bar     │
├───────────────────────┴──────────────────┼────────────────────────┤
│ Month calendar                            │ WaveScore Radar        │
│ Day colour: win, loss, or mixed           │ Trade Count line       │
│ Monthly trade, win, and P/L totals        │ Balance line            │
├───────────────────────────────────────────┴────────────────────────┤
│ Performance summary                                                │
├──────────────────────────────┬─────────────────────────────────────┤
│ Trade entry form             │ Trade journal and outcome filter    │
└──────────────────────────────┴─────────────────────────────────────┘
```

## Important screen states

| State | What the user sees |
| --- | --- |
| Loading | “Loading your journal…” below the journal heading. |
| Empty | A dashed dark panel inviting the user to add a trade. |
| Error | A red-tinted alert with a **Try again** action. |
| Editing | The form changes to “Edit trade” and shows **Cancel**. |
| Demo mode | A gold notice explains that data is local to this browser. |

## Responsive layout

At tablet width the metric cards form a two-column grid and the calendar, radar, and journal sections stack. On phones every panel uses one column, the calendar remains a seven-day grid, and form fields become one column.
