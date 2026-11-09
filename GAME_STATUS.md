# Game Status — The Long Innings

## Current milestone: prototype + initial automated tests authored

- React + Vite + TypeScript application scaffold and career UI.
- Player creation, career dashboard, player profile, training, match day, journal and localStorage career autosave.
- Batting delivery resolution and a simplified opposition innings/bowling phase.
- Innings boundaries (10 wickets / 120 legal balls), phase transition and match result calculation.
- Career match updates, ₹500 match fee, confidence adjustment and journal entry.
- JSON save export.
- Added Vitest domain tests in `src/domain/match.test.ts` for innings behavior, deterministic outcomes and match flow.
- Added `TESTING_GUIDE.md` with exact Windows instructions.

## Verification status — transparent

- `npm install` was attempted multiple times and timed out in this environment (npm registry/network access unavailable or stalled).
- Automated tests, TypeScript typecheck, ESLint, production build and browser QA **have not run successfully yet**.
- The test suite is written but unverified; do not interpret it as passed.

## Important gameplay limitations still present

- No second-innings target chase (currently compares innings totals).
- Opposition is a simplified aggregate simulation, not a batter-by-batter lineup.
- Bowling lacks player-controlled line/length/variation.
- No extras, wides/no-balls, run-outs, partnerships, strike rotation, over summaries or detailed batting/bowling scorecards.
- Match state is not persisted on refresh; career state is.
- Some UI/React lint and accessibility concerns may surface when dependencies are installed.

## Gate before deployment

Run `npm install`, `npm run test`, `npm run typecheck`, `npm run lint`, and `npm run build`; then complete the manual checklist in `TESTING_GUIDE.md`. Fix every error before publishing.
