# Workshop Judge Platform

Live workshop submission and judging platform. One Railway deploy serves the React app and Hono API.

## Participant requirement

Add `PRD.md` and `RFC.md` at your repo root on `main`. Submit your GitHub repo URL only — the platform links to your docs automatically.

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL (local) or Railway Postgres (prod)

## Commands

```bash
pnpm install
pnpm dev          # client :5173 + server :3000
pnpm build
pnpm start
pnpm test
pnpm --filter @leader-workshop/server db:generate
```

Copy `.env.example` to `.env` and set `DATABASE_URL`, `JUDGE_PIN`, `PORT`.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Home |
| `/submit` | Participant submission |
| `/judge` | Judge scoring (PIN required) |
| `/leaderboard` | Public rankings |
| `/api/docs` | Scalar API reference |
| `/api/openapi.json` | OpenAPI 3.1 spec |

## Deploy (Railway)

1. Root directory: `leader-workshop/`
2. Build: `pnpm install && pnpm run build`
3. Start: `pnpm run start`
4. Add Postgres plugin, set `JUDGE_PIN`

See [RFC.md](./RFC.md) for architecture details.
