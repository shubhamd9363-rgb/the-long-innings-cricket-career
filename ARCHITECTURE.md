# Architecture

## Stack
- **Vite + React + TypeScript:** fast static build and typed UI/domain boundaries; compatible with GitHub Pages.
- **Vitest:** deterministic unit tests for simulation and calculations.
- **ESLint + TypeScript:** static quality gates.
- **IndexedDB (planned Milestone 1):** robust browser-native persistence without a paid backend.
- **Canvas/2D rendering (planned):** match presentation isolated from simulation rules.

## Boundaries
- `src/domain/player`: player profile, attributes, progression.
- `src/domain/match`: rules, delivery resolution, innings, scorecards.
- `src/domain/career`: calendar, opportunities, selection and assessments.
- `src/domain/economy`: ledger and contracts.
- `src/persistence`: versioned IndexedDB, migrations, backup import/export.
- `src/ui`: screens and reusable components; UI dispatches domain actions and renders state.
- `src/app`: app shell and navigation.

## Rules
1. Domain logic must not depend on React or browser UI.
2. Career state is the single source of truth; UI state is not persisted as gameplay state.
3. Every completed match has a unique ID and completion guard.
4. Scorecards are the source for career statistics; transactions are the source for balances.
5. Random generators accept a seed; tests can reproduce match outcomes.
6. Saves are versioned and migrated explicitly; destructive reset requires confirmation.
7. Keep format-specific rules behind interfaces so T20 can ship first without blocking longer formats.

## State flow
User action → validated domain command → state transition → persisted snapshot/ledger → UI render.
