# TradeJournal Mockup

## Analytics dashboard

TradeJournal now uses a dark, data-first dashboard. It takes the structure of the supplied reference: a compact metric row, a calendar-led analytics area, a radar summary, and small line charts. The working trade-entry form and trade history remain below the analytics area.

<img width="1358" height="890" alt="demoo_desktop" src="https://github.com/user-attachments/assets/1396129d-fc5d-4334-be05-838c8e4422b3" />
<img width="322" height="710" alt="demo_phone" src="https://github.com/user-attachments/assets/a48da246-a2cf-4aae-95d2-84f4a41fdacf" />
<img width="1244" height="726" alt="jourrnal" src="https://github.com/user-attachments/assets/92a6abd6-f43b-4814-8f0d-215d5ab726b6" />


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
