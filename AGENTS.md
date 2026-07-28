# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint/Test Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production 
- `npm run lint`: Run ESLint
- `npm run lint-fix`: Run ESLint with auto-fix
- `npm run format`: Format code with Prettier
- `npm run playwright:test`: Run Playwright tests in headless mode
- `npm run playwright:test:ui`: Run Playwright tests in interactive UI mode

## Code Style Guidelines
- **TypeScript**: Strict mode, ES2022 target, path aliases (`@/*` for src)
- **Formatting**: Double quotes, 2-space indent, semicolons required
- **Imports**: Order by 3rd-party → library → CAREUI → UI → components → hooks → utils → relative
- **Types**: Use `interface` for objects, avoid explicit `any`, proper nullability
- **Naming**: PascalCase for components/classes, camelCase for variables/functions
- **Components**: Organized by feature, maintain separation of concerns
- **Error Handling**: Use dedicated error handlers, TypeScript strict null checks

## Cursor Cloud specific instructions

This repo is the CARE **frontend only** (React 19 + Vite). The Django backend lives in a separate repo (`ohcnetwork/care`) and is NOT checked out here. Standard scripts live in `package.json`; deeper docs are in `README.md` and `CLAUDE.md`.

- **Node version**: The app requires Node 24 (`.node-version`). `nvm` has v24 installed and set as the `default` alias, so `tmux`/login shells (`bash -l`) already use Node 24 automatically. The non-login shell may resolve to a system Node 22 on `PATH`; if `node --version` isn't 24, run `. "$NVM_DIR/nvm.sh" && nvm use 24` (or start work inside a `tmux` login shell). Node 22 also runs `npm install` fine.
- **Backend / API URL**: By default the dev server points at the hosted staging backend (`REACT_CARE_API_URL=https://careapi.ohc.network` from `.env`), so `npm run dev` boots and is fully usable with no `.env.local`. To target a local backend, create `.env.local` with `REACT_CARE_API_URL=http://127.0.0.1:9000` (see `README.md`).
- **Run dev server**: `npm run dev` serves http://localhost:4000 (port hardcoded in `vite.config.mts`).
- **Credential-free smoke test**: Against the staging backend you can log in without any account via the Patient login tab — enter any valid phone number, click Send OTP, then use the hardcoded staging OTP `45612`. This lands on `/patient/home`. Useful to verify the app + API wiring end-to-end.
- **Playwright E2E**: Requires a LOCAL backend on port 9000 plus PostgreSQL + Redis, and a prior `npm run build` (tests run against `npm run preview`). None of that is provisioned in this environment; setting it up requires cloning/running the separate backend repo. See `CLAUDE.md` for the full flow.
- `npm run lint` and `npm run build` each take a couple of minutes; allow generous timeouts.