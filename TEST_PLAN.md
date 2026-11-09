# Test Plan

## Milestone 0 gates
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] GitHub Actions workflow succeeds
- [ ] Pages URL opens with repository base path

## Domain unit tests (Milestone 1+)
- Delivery legality: wides/no-balls/byes/leg-byes
- Wicket types and dismissal validity
- Strike rotation and over transitions
- Innings termination and target/result calculation
- Scorecard totals reconcile with innings totals
- Batting/bowling/fielding statistics derived from scorecards
- Seed reproducibility
- Training cost/time/fatigue/skill changes
- Selection eligibility and explainable score factors
- Ledger balance and duplicate transaction prevention
- Save schema migration, invalid backup rejection, and round-trip

## End-to-end career loop
1. Create career/player
2. Save and reload
3. Complete training
4. Play a full T20
5. Verify scorecard, statistics, rewards and assessment
6. Generate an opportunity from performance/eligibility
7. Advance calendar
8. Export and import into another slot
9. Repeat at desktop and mobile viewports

## Negative/edge cases
Insufficient funds; injured/unavailable player; expired contract; duplicate completion/click; interrupted save; abandoned match; malformed import; offline reload.
