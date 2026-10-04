# Cumulative Increment Report — TradeJournal

**Reporting period:** Project start to 4 October 2026

This report records the progress of TradeJournal from the original idea through the current deployed, authenticated full-stack version. Supporting evidence is linked to the project documentation below.

## 1. Planning: defining the problem and core flow

The project began as a personal journal for student traders. The goal was to make it easy to record completed trades, review wins and losses, and use the results to improve future decisions. The initial scope identified four connected areas: a performance dashboard, monthly calendar, trade-entry form, and trade-history journal.

The initial plan also identified the important application state: trades, form values, the selected calendar month, outcome filter, editing state, and loading/error feedback. Analytics are calculated from saved trades rather than stored separately, keeping the data model simpler and reducing the risk of inconsistent dashboard values.

Evidence: [proposal](01-proposal.md).

## 2. Interface planning: wireframes and components

Next, the interface was mapped before visual styling. The dashboard was chosen as the home screen, with a visible route to add, edit, filter, and review trades. The wireframes documented desktop and phone layouts, then broke the screen into reusable React components such as the header, metric cards, calendar, trade form, and trade cards.

The component plan established that shared state belongs in the app-level dashboard flow, so a saved trade immediately updates the journal list, calendar, charts, and summary metrics.

Evidence: [wireframes and component breakdown](04-wireframes-component-breakdown.md).

## 3. Visual design and responsive dashboard

The planned layout was implemented as a dark, data-first trading dashboard. The design system uses a night background, layered panels, blue analytical accents, red loss states, green win indicators, and Manrope/DM Mono typography. The completed dashboard includes a win streak, win-rate gauge, average win/loss ratio, calendar activity, WaveScore radar, monthly trade-count and balance charts, a trade-entry form, and trade history.

Responsive rules were added so the analytics and journal workspaces stack at tablet and phone sizes, while inputs and trade values remain readable without horizontal scrolling. Loading, empty, error, editing, and demo-mode states were also documented.

Evidence: [mockup](02-mockup.md) and [design system](03-design-system.md).

## 4. Full-stack development and deployment

TradeJournal progressed from a browser-focused prototype to a React and Vite client with an Express API and Neon PostgreSQL database. The project now supports account registration, sign-in, sign-out, protected routes, and user-specific trade creation, viewing, editing, and deletion. A mock/demo API remains available for development and presentation fallback.

The frontend was deployed to Vercel and the API to Render. Health and readiness endpoints were added to distinguish whether the web process or database is unavailable. Setup, environment variables, API routes, architecture, and deployment details were recorded in the main repository README.

Evidence: [main project README](../README.md).

## 5. Security and privacy review

The current review confirmed server-side input validation, parameterized SQL queries, bcrypt password hashing, signed JWTs in `HttpOnly` cookies, CORS origin allowlisting, user ownership checks in trade queries, JSON request-size limits, and generic public error responses. Environment templates use placeholders and real `.env` files are ignored by Git.

The review also records remaining production hardening: add Helmet, rate limiting, and CSRF protection for cross-site cookies; run dependency audits; add an in-app privacy notice; and remove all real user/tester data from screenshots, demos, and the public submission.

Evidence: [security and privacy review](06-security-and-privacy.md).

## 6. Demo and submission preparation

The demonstration plan is for a three-to-five-minute recording of the deployed app. It will show the purpose of TradeJournal, complete a prepared end-to-end trade-journal flow, explain one technical decision, and name one honest improvement. Before recording, the deployed app should be warmed up, realistic invented data prepared, and any personal information or unrelated browser content removed.

Evidence: [demo video plan](05-demo-video.md).

## Current status

TradeJournal is now a responsive, full-stack personal trading journal with authentication, user-owned records, dashboard analytics, CRUD trade management, and a documented deployment process. The documentation set covers the proposal, interface plan, visual design, demo plan, security/privacy review, and documentation index.

## Remaining work

- Perform a final end-to-end test using multiple accounts: registration, sign-in, CRUD actions, filters, dashboard calculations, and sign-out.
- Test the deployed site on desktop and mobile sizes and correct any remaining visual issues.
- Complete the documented security follow-ups: Helmet, rate limiting, CSRF protection, and dependency audits.
- Add an in-app privacy notice and ensure all demo and screenshot data is fictional.
- Record the deployed-site demo video and add its link to [05-demo-video.md](05-demo-video.md) and the main README.
