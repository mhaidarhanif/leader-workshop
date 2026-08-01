import { OpenAPIHono } from '@hono/zod-openapi';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runMigrations } from './modules/shared/db.js';
import { setupOpenApiDocs } from './modules/shared/openapi.js';
import { registerHealthRoutes } from './modules/health/health-route.js';
import { registerSubmissionRoutes } from './modules/submissions/submissions-route.js';
import { registerScoreRoutes } from './modules/scores/scores-route.js';
import { registerJudgeRoutes } from './modules/judge/judge-route.js';
import { registerLeaderboardRoutes } from './modules/leaderboard/leaderboard-route.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticRoot = join(__dirname, '../static');

const app = new OpenAPIHono();

registerHealthRoutes(app);
registerSubmissionRoutes(app);
registerScoreRoutes(app);
registerJudgeRoutes(app);
registerLeaderboardRoutes(app);
setupOpenApiDocs(app);

app.use('/assets/*', serveStatic({ root: staticRoot }));

app.notFound((c) => {
  if (c.req.path.startsWith('/api')) {
    return c.json({ error: 'Not found' }, 404);
  }
  const indexPath = join(staticRoot, 'index.html');
  if (!existsSync(indexPath)) {
    return c.text('Client not built. Run pnpm build.', 503);
  }
  const html = readFileSync(indexPath, 'utf8');
  return c.html(html);
});

const port = Number(process.env.PORT ?? 3000);

async function main() {
  await runMigrations();
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
