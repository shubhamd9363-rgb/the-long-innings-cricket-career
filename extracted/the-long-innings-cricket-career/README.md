# The Long Innings: A Cricketer's Career

A browser-based cricket career simulation. This repository is independent of `cricket-career-game` / Maidan.

## Milestone 0 — foundation
- Vite + React + TypeScript
- Vitest, ESLint, TypeScript checks
- GitHub Pages deployment workflow
- Documented domain boundaries and test plan

## Local development
```bash
npm install
npm run dev
npm run check
npm run test
npm run build
```

## Deployment
Enable **GitHub Pages → GitHub Actions** in repository settings. The workflow deploys `dist/` and derives the correct repository base path from the GitHub Actions environment.

## Save data
Milestone 1 will introduce IndexedDB, versioned saves, multiple career slots, and import/export. No account or backend is required.
