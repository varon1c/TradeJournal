# TradeJournal Wireframes & Component Breakdown

This document is the low-fidelity plan for TradeJournal. It focuses on boxes, labels, screen flow, and React components only. Visual styling, colours, and typography are documented separately in [03-design-system.md](03-design-system.md).

## Step A: Screen map

The first screen is the **Dashboard**. It is the home base for reviewing performance, changing the calendar month, and moving into the trade-entry and journal sections.

```text
[Dashboard]
  |  click "Add trade" / "Journal"
  v
[Trade Entry]
  |  click "Add to journal" / "Save changes"
  v
[Trade Journal]
  |  click "Edit"
  v
[Edit Trade]
  |  click "Save changes" or "Cancel"
  v
[Trade Journal] ---- click "Performance" ----> [Dashboard]
  |
  +---- click previous / next month ----> [Dashboard: changed calendar month]
```

| Question | Answer |
| --- | --- |
| First screen | Dashboard |
| Main home base | Dashboard; it contains the performance summary and links to journal actions. |
| Screen with no way back | No. The top navigation and form cancel action return the user to a usable dashboard state. |

## Step B: Screen wireframes



| Screen | Desktop layout | Phone layout | Navigates to |
| --- | --- | --- | --- |
| Dashboard | Three metric cards, then calendar and analytics side by side. | Metrics and analytics stack in one column. | Trade entry, trade journal, another calendar month. |
| Trade entry | Two-column input grid within a compact form panel. | All inputs stack as a single column. | Trade journal after save; dashboard state after cancel. |
| Trade journal | Filter beside heading and repeated trade cards below. | Filter appears below the heading; data rows stack. | Edit trade; dashboard navigation. |

## Step C: Component tree

The busiest screen is the dashboard. Repeated cards, metric panels, and controls become reusable components.

```text
App
├── DashboardLayout
│   ├── Header
│   │   ├── Brand
│   │   └── Navigation
│   ├── MetricRow
│   │   ├── WinstreakCard
│   │   ├── WinRateGauge
│   │   └── WinLossRatioCard
│   ├── AnalyticsGrid
│   │   ├── CalendarPanel
│   │   ├── RadarPanel
│   │   └── TrendChartPanel
│   └── PerformanceSummary
├── TradeEntryForm
│   ├── FormField
│   ├── OutcomePicker
│   └── PrimaryButton
└── TradeJournal
    ├── OutcomeFilter
    └── TradeCard
        ├── OutcomeBadge
        └── TextButton
```

| Level | What it is | TradeJournal components |
| --- | --- | --- |
| Atoms | Smallest reusable controls or labels | `PrimaryButton`, `TextButton`, `FormField`, `OutcomeBadge`, `OutcomePicker` |
| Molecules | Small groups of atoms | `TradeCard`, `WinstreakCard`, `WinRateGauge`, `WinLossRatioCard`, `OutcomeFilter` |
| Organisms | Complete, self-contained sections | `Header`, `MetricRow`, `CalendarPanel`, `RadarPanel`, `TrendChartPanel`, `TradeEntryForm`, `TradeJournal` |
| Page / layout | Arranges organisms into a screen | `DashboardLayout`, `App` |

## Step D: Sanity check

The key user task is **recording and reviewing a completed trade**.

1. The user lands on the dashboard and selects **Add trade**.
2. The user completes the trade-entry fields and selects **Add to journal**.
3. `App` creates the trade, updates the journal list, and recalculates dashboard statistics.
4. The user can filter the history, choose **Edit**, then save or cancel changes.
5. The calendar, metric cards, radar score, and trend panels all read the same `trades` state, so they update after a saved change.

`App` owns shared state: `trades`, loading/error status, the active calendar month, and the journal filter. `TradeEntryForm` owns its input values while the user is editing a trade. This gives every proposed piece of state a clear home and avoids screens with no route back.
