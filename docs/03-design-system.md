# TradeJournal Design System

TradeJournal uses a dark trading-terminal style with blue analytical highlights and red loss states. Panels stay calm and dense so live trade data remains the focus.

## Colour

| Name | Hex value | Used for |
| --- | --- | --- |
| Night | `#070A1B` | Page background |
| Panel | `#141827` | Cards and surfaces |
| Panel dark | `#101423` | Inputs and secondary panels |
| Line | `#252C42` | Borders and chart baselines |
| Ink | `#EDF0FF` | Main text |
| Muted | `#99A3C1` | Labels and supporting text |
| Signal blue | `#2097F6` | Primary actions, wins, charts, and focus |
| Signal red | `#FA4E59` | Losses, delete actions, and the ratio bar |
| Green | `#32C993` | Winning calendar marks |
| Gold | `#F6B44C` | Demo notice |

## Typography

| Style | Font | Use |
| --- | --- | --- |
| Display | Manrope, 800 | Dashboard heading and key values |
| Heading | Manrope, 700–800 | Panel, form, and journal headings |
| Body | Manrope | Descriptions and controls |
| Data label | DM Mono | Dates, labels, badges, and chart metadata |

## Layout

The desktop dashboard starts with three metric cards. The analysis area then uses a two-column layout: the calendar and performance summary sit on the left; radar, trade-count, and balance panels sit on the right. The entry form and history list form a separate two-column workspace below.

At 820px, the page becomes a single analysis column. At 540px, all cards, form fields, and trade values stack without horizontal scrolling.

## Components

| Component | Purpose |
| --- | --- |
| Metric cards | Winstreak, win rate gauge, and average win/loss ratio |
| Calendar | Monthly visual index of wins, losses, mixed days, and trade count |
| Radar | Data-derived summary score for trade behaviour |
| Trend panels | Cumulative monthly P/L and monthly trade activity lines |
| Trade form | Existing create/edit trade workflow in the dark visual language |
| Trade card | Trade details, outcome badge, P/L, notes, edit, and delete actions |

## In code

The dashboard structure and derived metrics are in [App.jsx](../src/App.jsx). The responsive dark interface rules are in [styles.css](../src/styles.css).
