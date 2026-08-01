import { createRoute, type OpenAPIHono } from '@hono/zod-openapi';
import { LeaderboardSchema } from './leaderboard-schema.js';
import { getLeaderboard } from './leaderboard-service.js';

const leaderboardRoute = createRoute({
  method: 'get',
  path: '/api/leaderboard',
  responses: {
    200: {
      description: 'Ranked leaderboard',
      content: { 'application/json': { schema: LeaderboardSchema } },
    },
  },
});

export function registerLeaderboardRoutes(app: OpenAPIHono) {
  app.openapi(leaderboardRoute, async (c) => {
    const result = await getLeaderboard();
    return c.json(result, 200);
  });
}
