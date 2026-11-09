# Testing & Running The Long Innings

## What is currently covered
- Automated domain tests are included in `src/domain/match.test.ts` for innings boundaries, legal-ball counting, deterministic ball resolution, innings transitions and match results.
- These tests have **not been executed in this workspace** because package installation could not complete (npm registry/network request timed out). No successful build, lint or browser test is claimed.

## Run checks on your computer (Windows)
1. Install Node.js **LTS** from https://nodejs.org (npm is included).
2. Extract `the-long-innings-playable-prototype.zip` to a folder you can find, e.g. Desktop\TheLongInnings.
3. Open that folder in VS Code (or File Explorer).
4. In VS Code choose **Terminal → New Terminal**.
5. Run these commands one at a time:
   ```powershell
   npm install
   npm run test
   npm run typecheck
   npm run lint
   npm run build
   ```
6. If all checks pass, run:
   ```powershell
   npm run dev
   ```
7. Open the local URL printed in the terminal (usually `http://localhost:5173`) in Chrome/Edge.
8. Test manually: create a player; navigate each screen; train (confirm money/skill/fatigue); play through both innings; verify match result and career stats; export save; refresh and verify career persists; delete career and confirm it clears.

## Expected check result
- `npm run test`: Vitest reports all domain tests passing.
- `npm run typecheck`: no TypeScript errors.
- `npm run lint`: no ESLint errors (warnings, if any, should be reviewed).
- `npm run build`: Vite creates `dist/` successfully.

## Troubleshooting
- If `npm install` hangs/fails, check internet access, VPN/proxy, and firewall; retry from a normal home/work connection.
- Do not deploy until `test`, `typecheck`, `lint`, and `build` complete successfully.
