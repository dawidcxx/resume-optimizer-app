# AGENTS.md

## Product & domain

Turns structured resume data into rendered resumes. The structured resume is the canonical source of truth; render configuration and output are derived layers.

- **Local editing, LLM rendering**: resume data is stored in the browser, but rendering and iteration make extensive use of third-party LLM providers. Render requests send snapshots to the backend and model provider, and render chats are persisted server-side. Do not describe the product as offline-first or privacy-first.
- **Optimization**: the same data can be re-presented for a target role/job description (re-emphasize relevant experience, keep facts intact). Keep base data separate from render configuration and output.
- **AI is a presentation layer**, not a source of truth: it reshapes existing data rather than adding new experience or credentials. Future versions may let users control how aggressively facts are re-framed; canonical data stays untouched. Prefer small increments over speculative pipeline work.

## Dev server

Assume a dev server is already running at `http://localhost:5173` (Vite HMR) and the backend at `http://localhost:8080`. Prompt the user to run `bun run dev` if not.

Running `bun run dev` concurrently starts:

- `bun run dev:backend` — Hono API server on `:8080`
- `bun run dev:web` — Vite dev server (TSX served directly, HMR)
- `bun run dev:common` — watch-mode rebuild of `packages/common`

The Vite dev server proxies `/api` → `http://localhost:8080`.

## Adding a feature

If a brand new feature is requested, start by modeling the domain first (see `docs/domain-modeling-playbook.md`), then follow `docs/backend-feature-playbook.md` for wiring it into the backend.

## Multi-page (SPA-per-route) routing

This project serves multiple SPAs from a single Vite dev server:

- `/` → `index.html` (static marketing landing page)
- `/resumes` → `resumes.html` (main app SPA)
- `/resumes/:id/edit` → `resumes.html` (individual resume editor)
- `/resume` → `resumes.html` (legacy alias, redirected in the app)
- `/design` → `design.html` (UI library sandbox SPA)

Both dev (Vite) and production (backend `serveStaticAssets`) serve the correct page HTML for sub-routes. For example, `/resumes/de8cbab9-9aa9-4722-88ff-340d53d743a1/edit` correctly serves `resumes.html`, and `/design/components` correctly serves `design.html`.

Dev-mode routing is handled by the `mpa-subroute-fallback` Vite plugin in `packages/web/vite.config.ts`.
Production routing is handled by prefix matching in `packages/backend/src/lib/serveStaticAssets.ts`.

When adding new SPAs:

1. Add the URL→HTML mapping to `packages/common/src/consts/pages.ts`
2. This automatically configures both Vite dev routing and production static asset serving

## Landing screenshots

The landing page is static: `packages/web/index.html` plus `packages/web/src/landing.css`. Product images live in `packages/web/public/landing/`:

- `preview.png` — 1952×1536; Preview card after one mocked chat turn.
- `editor.png` — 2880×2000; Details step with fictional data.

Regenerate them with Playwright against the dev server and a mocked `/api` layer. Do not call the real LLM or use real resume data.

1. Start `bun run dev:web`.
2. In a fresh browser context, intercept `/api/**`:
   - `POST /api/resumes/import` → fictional imported resume.
   - `POST /api/renders` → `{ chatId, reply: null, markup, usage }`.
   - `GET /api/renders/:chatId` → `{ chat, messages }`.
   - `POST /api/renders/:chatId/messages` → the same turn shape with revised markup.
3. Use a 1440×1000 viewport at `deviceScaleFactor: 2` and a fictional resume such as the Maya Chen fixture.
4. Capture `editor.png` on the Details step after import. Hide the floating step indicator (`.fixed.bottom-6`) first.
5. Continue to Preview, generate, send one suggestion, then screenshot the Preview card element (`div.rounded-ui...` containing “Generate a rendered version”) as `preview.png`.
6. Use the same approach for any new screenshots, keep the browser console clean, and update image `width`/`height` and OG metrics in `index.html` if dimensions change.
