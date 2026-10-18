# GymMate end-to-end tests

Playwright drives the dashboard in a real (headless) browser against a real backend, and checks
each result in the database. Every test also fails if the browser saw an API 5xx or an uncaught
page error.

## Run

Prerequisites: Docker, Node 20+, Java 21, and the `Backend` repo checked out next to `frontend`
(or set `E2E_BACKEND_DIR`).

```bash
cd frontend/e2e
npm install
npx playwright install chromium
npm run stack:up        # isolated Postgres/Redis/Mailpit + backend (built from Backend) + Vite
npm run test:fresh      # whole suite on fresh accounts
npm run report          # HTML report with screenshots and traces of failures
npm run stack:down      # stop everything and delete the e2e data
```

Single file or test: `npx playwright test 02-` or `npx playwright test -g "GMH-007"`.

The stack never touches `Backend/.env`, shared databases, real email or SMS: mail goes to Mailpit
(http://localhost:18025, where the tests read OTP, invite and reset emails), SNS is off, and the
Stripe key is copied only if `Backend/.env` has a test-mode (`sk_test_`) key. Re-run
`npm run stack:up` after backend changes; it rebuilds and restarts the backend.

## Scenarios

The specs run in order and share accounts through `state.json` (created by `01-`):

| Spec | Covers |
|---|---|
| `01-owner-signup` | Owner sign-up, OTP from email, landing on the dashboard (GMH-001/002/003); login token gym and refresh; wrong password |
| `02-owner-operations` | Bug sheet GMH-004 to 017: currency, Quick Actions, members, plans, classes, challenges, inventory, equipment, leads, POS, analytics |
| `03-team-roles` | Owner invites a Manager, Staff and Trainer from the Team page and each joins through the emailed link; every screen against the permission matrix (`src/auth/permissions.ts`, backend `RolePermissions`), with no 403s on allowed screens; allowed and refused actions per role |
| `04-platform-members-isolation` | Calendar scheduling (GMH-011), Super Admin (including the audited act-as-organisation), member password reset and login, the mobile member API, a second organisation trying to read and change the first one's data, logout |

`03-team-roles` mirrors `SCREEN_PERMISSIONS` from `src/auth/permissions.ts`; update both together.
The Super Admin account is the one the backend's `dev` profile seeds (`application-dev.yml`).

## Known failures

- `04 › Member: API self-service`: the mobile app calls `/members/me/*` endpoints the backend does
  not have yet.

## Configuration

| Variable | Default |
|---|---|
| `E2E_BASE_URL` | `http://localhost:5173` |
| `E2E_API_URL` | `http://localhost:8080/api` |
| `E2E_MAILPIT_URL` | `http://localhost:18025/api/v1` |
| `E2E_PG_CONTAINER` | `gm-e2e-postgres` |
| `E2E_BACKEND_DIR` | `../../Backend` |
