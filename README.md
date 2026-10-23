# Fullstack Vite Template

Opinionated template on how to start a Vite + Bun backend project. Optimized for resource efficiency and security.

## Features

- Full-stack with full BE/FE separation
- Excellent security
- Sub-100MB production Docker image
- Small package count
- Workspaces without third-party tool bloat

## How to use

- This is a template repository. Clone it using the "Use this Template" button on GitHub and pull it locally.

- Rename the repo with the included init script `bun run init.js`.

- Afterwards, you can delete the script `rm init.js`.

- (Recommended) Have [nix](https://nixos.org/download/) and [direnv](https://github.com/direnv/direnv) set up.

## Environment setup

The backend loads two env files during development:

- `packages/backend/.env.defaults` — tracked, non-secret defaults such as `DATABASE_URL`
- `packages/backend/.env.local` — untracked local overrides and secrets

Create the local file once, then fill in your DeepSeek API key:

```sh
cp packages/backend/.env.example packages/backend/.env.local
```

Set `DEEPSEEK_API_KEY` in `packages/backend/.env.local` to use LLM-backed features such as resume import, rendering, and iteration. Those features fail without it; local editing still works.

## Key commands

- **Set up DB** `cd docker && docker compose up`
- **Install packages** `bun install`
- **Run development server** `bun run dev`
- **Run tests** `bun test`

## Project Structure

This template uses a monorepo setup with bun workspaces:

- `packages/backend/`: Bun + Hono.js API server with Drizzle ORM and migrations
- `packages/common/`: Shared TypeScript utilities, DTOs, and Valibot schemas for API contracts
- `packages/web/`: Vite SPA with React, TailwindCSS, and SWR for data fetching

### Abuse protection

Resume import and initial render calls are gated by Cloudflare Turnstile. Render chat messages are not gated.

`VITE_TURNSTILE_SITE_KEY` is shared by development and production:

```sh
# Development: packages/web/.env.local
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA

# Backend: packages/backend/.env.local
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

In development, Vite injects the public sitekey into the HTML config prelude. In production, the backend injects it once at startup and caches the rendered HTML, so the frontend is built once and Docker `-e VITE_TURNSTILE_SITE_KEY=...` works at runtime. The secret never reaches the browser. All `VITE_*` environment variables are injected into the prelude, so never give a secret a `VITE_` prefix.

```sh
docker run -e VITE_TURNSTILE_SITE_KEY=... -e TURNSTILE_SECRET_KEY=... ...
```

Replace both with real Turnstile credentials before deploying; production startup rejects test credentials. Use `3x00000000000000000000FF` as the sitekey in `packages/web/.env.local` if you need to force the interactive challenge locally.
