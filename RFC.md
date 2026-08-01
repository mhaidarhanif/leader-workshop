# RFC — Workshop Judge Platform

## Architecture

pnpm monorepo with two packages:

- `client/` — Vite + React build input (not deployed alone)
- `server/` — Hono API + serves built client from `server/static/`

Single Railway service. Postgres via Railway plugin.

```
client/dist  →  server/static  →  Hono serves SPA + /api/*
```

## Stack

| Layer | Tech |
|-------|------|
| Client | React, TanStack Query, Tailwind, shadcn/ui, react-router |
| Server | Hono, @hono/zod-openapi, Scalar, Drizzle ORM, postgres.js |
| DB | PostgreSQL |
| Tests | Vitest (ranking logic only) |

## Key decisions

- **Judge PIN** — `JUDGE_PIN` env var; `X-Judge-Pin` header on `PUT /api/scores`
- **PRD/RFC URLs** — derived from `github_url` + `/blob/main/PRD.md|RFC.md`; not stored in DB
- **Ranking** — pure function in `server/src/modules/leaderboard/ranking.ts`
- **API docs** — OpenAPI 3.1 at `/api/openapi.json`, Scalar UI at `/api/docs`

## Data model (Drizzle)

**submissions:** id, team_name, github_url, deploy_url, screenshot_urls, created_at

**scores:** id, submission_id, judge_name, prd_score, rfc_score, code_score, created_at

Unique: `(submission_id, judge_name)` — upsert on re-score.

## API

| Method | Path | Auth |
|--------|------|------|
| POST | /api/submissions | none |
| GET | /api/submissions | none |
| GET | /api/submissions/:id | none |
| PUT | /api/scores | X-Judge-Pin |
| GET | /api/leaderboard | none |
| GET | /api/health | none |
| GET | /api/openapi.json | none |
| GET | /api/docs | none |

## Env vars

- `DATABASE_URL` — Postgres connection string
- `JUDGE_PIN` — shared judge gate (required)
- `PORT` — listen port (Railway injects)

## Module layout

Both client and server use `src/modules/<feature>/` with lowercase kebab-case filenames.

- `*-schema.ts` (Zod) = API validation / OpenAPI
- `shared/schema.ts` (Drizzle) = DB tables — do not merge

## Deploy

Railway root: `leader-workshop/`. Migrations run on boot via Drizzle migrator.
