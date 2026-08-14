# AGENTS.md

This file is the single source of truth for guidance for AI coding agents (Claude Code, Codex, Cursor, GitHub Copilot, Gemini, etc.) when working with code in this repository.

> **Note:** Tool-specific entry points such as `CLAUDE.md` inherit from this file. Keep all shared guidance here so every agent stays in sync.

## What is CARE?

CARE is a Digital Public Good building an open source EMR + Hospital Management system. This is the React frontend (React 19 + TypeScript + Vite).

## Documentation Map

Detailed guidance is split into focused files so agents only load what's relevant to the task:

- [`docs/local-development.md`](docs/local-development.md) — Backend + frontend setup, local credentials, dev/build/lint commands.
- [`docs/testing.md`](docs/testing.md) — Playwright E2E setup, commands, DB snapshot workflow, and writing tests.
- [`docs/architecture.md`](docs/architecture.md) — Routing, API layer, state management, UI components, plugins, auth, key directories, and config.
- [`docs/care-apps-architecture-note.md`](docs/care-apps-architecture-note.md), [`docs/care-apps-local-dev.md`](docs/care-apps-local-dev.md), [`docs/care-apps-override-architecture.md`](docs/care-apps-override-architecture.md) — Plugin system deep dives.
- [`tests/PLAYWRIGHT_GUIDE.md`](tests/PLAYWRIGHT_GUIDE.md) — Complete Playwright patterns for form interactions, selectors, assertions, and helpers.

## Quick Commands

- `npm run dev` — Start dev server at http://localhost:4000
- `npm run build` — Production build (takes 2+ minutes, set timeout to 180s+)
- `npm run lint` — Run ESLint (takes 85s+, set timeout to 120s+)
- `npm run lint-fix` — ESLint with auto-fix
- `npm run format` — Prettier formatting

See [`docs/local-development.md`](docs/local-development.md) for the full local setup and [`docs/testing.md`](docs/testing.md) for E2E testing.

## Code Style Guidelines

- **TypeScript**: Strict mode, ES2022 target, path aliases (`@/*` → `src/*`, `@careConfig` → `care.config.ts`)
- **Formatting**: Double quotes, 2-space indent, semicolons required
- **Imports**: Order by 3rd-party → library → CAREUI → UI → components → hooks → utils → relative. Prettier plugin auto-sorts on format.
- **Types**: Use `interface` for objects, avoid `any`, prefer maps over enums
- **Naming**: PascalCase for component files (`AuthWizard.tsx`), camelCase for hooks/utils (`useAuth.ts`), kebab-case for directories
- **Components**: Functional components only, named exports preferred, one component per file
- **i18n**: All user-facing strings must use i18next. English translations go in `public/locale/en.json`. Non-English managed via Crowdin — do not edit directly.

Path-specific rules live in [`.github/instructions/`](.github/instructions/) (auto-applied by matching glob).

## Git Workflow

- Branch naming: `issues/{issue#}/{short-name}`
- Default branch: `develop` (staging auto-deploys)
- Pre-commit hooks via husky run Prettier and ESLint on staged files

## Autonomous AI Workflow

When working autonomously on this codebase, follow this sequence:

1. **Before coding:** Read relevant source files and understand existing patterns
2. **After changes:** Run `npm run lint-fix` and `npm run format` on changed files (pre-commit hooks also run these automatically)
3. **Verify:** Run relevant Playwright tests against the local backend to validate changes (see [`docs/testing.md`](docs/testing.md))
4. **For API changes:** Check corresponding backend endpoint in the care backend repo and update both repos if needed
5. **For new features:** Add Playwright tests in `tests/` following [`tests/PLAYWRIGHT_GUIDE.md`](tests/PLAYWRIGHT_GUIDE.md)
6. **For i18n:** Add English strings to `public/locale/en.json`
7. **For writing tests:** Read [`tests/PLAYWRIGHT_GUIDE.md`](tests/PLAYWRIGHT_GUIDE.md) — it contains complete patterns for all form interactions, selectors, assertions, and helpers

### Quick verification cycle

```bash
# 1. Lint & format (or rely on pre-commit hooks)
npm run lint-fix && npm run format

# 2. Type check
npx tsc --noEmit

# 3. Run related tests (requires backend + build)
npx playwright test tests/path/to/related/
```

## Cursor Cloud specific instructions

This repo is the CARE **frontend only** (React 19 + Vite). The Django backend lives in a separate repo (`ohcnetwork/care`) and is NOT checked out here. Standard scripts live in `package.json`; deeper setup docs are in `README.md` and the [`docs/`](docs/) directory (see the Documentation Map above).

- **Node version**: The app requires Node 24 (`.node-version`). `nvm` has v24 installed and set as the `default` alias, so `tmux`/login shells (`bash -l`) already use Node 24 automatically. The non-login shell may resolve to a system Node 22 on `PATH`; if `node --version` isn't 24, run `. "$NVM_DIR/nvm.sh" && nvm use 24` (or start work inside a `tmux` login shell). Node 22 also runs `npm install` fine.
- **Backend / API URL**: By default the dev server points at the hosted staging backend (`REACT_CARE_API_URL=https://careapi.ohc.network` from `.env`), so `npm run dev` boots and is fully usable with no `.env.local`. To target a local backend, create `.env.local` with `REACT_CARE_API_URL=http://127.0.0.1:9000` (see [`docs/local-development.md`](docs/local-development.md)).
- **Run dev server**: `npm run dev` serves http://localhost:4000 (port hardcoded in `vite.config.mts`).
- **Credential-free smoke test**: Against the staging backend you can log in without any account via the Patient login tab — enter any valid phone number, click Send OTP, then use the hardcoded staging OTP `45612`. This lands on `/patient/home`. Useful to verify the app + API wiring end-to-end.
- **Playwright E2E**: Requires a LOCAL backend on port 9000 plus PostgreSQL + Redis, and a prior `npm run build` (tests run against `npm run preview`). None of that is provisioned in this environment; setting it up requires cloning/running the separate backend repo. See [`docs/testing.md`](docs/testing.md) for the full flow.
- `npm run lint` and `npm run build` each take a couple of minutes; allow generous timeouts.
