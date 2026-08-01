# AGENTS.md

Read [PRD.md](./PRD.md) for product context and [RFC.md](./RFC.md) for technical design.

## Layout

- `client/` — React build input (`@leader-workshop/client`)
- `server/` — single deploy target (`@leader-workshop/server`); API + static SPA

## Stack

pnpm, React, TanStack Query, Tailwind, shadcn, Hono, Drizzle ORM, Postgres, Vitest

## Conventions

- All source filenames: lowercase kebab-case
- Client pages use hooks from `client/src/modules/<feature>/` — no raw fetch in components
- Server DB access only in `*-service.ts` via Drizzle — no raw SQL
- `*-schema.ts` (Zod) ≠ `shared/schema.ts` (Drizzle)
- `github_url` must be repo root; PRD/RFC via `shared/github-docs.ts`
- Ranking in `server/src/modules/leaderboard/ranking.ts` — run `pnpm test` before ship
- Theme: lime green, large accessible type

## Do not add

File uploads, full auth, second deploy target, scattered useEffect fetch
