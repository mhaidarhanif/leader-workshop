import { createRoute, type OpenAPIHono } from '@hono/zod-openapi';
import { sql } from 'drizzle-orm';
import { db } from '../shared/db.js';
import { HealthResponseSchema } from './health-schema.js';

const healthRoute = createRoute({
  method: 'get',
  path: '/api/health',
  responses: {
    200: {
      description: 'Healthy',
      content: { 'application/json': { schema: HealthResponseSchema } },
    },
    503: {
      description: 'Database unavailable',
      content: { 'application/json': { schema: HealthResponseSchema } },
    },
  },
});

export function registerHealthRoutes(app: OpenAPIHono) {
  app.openapi(healthRoute, async (c) => {
    try {
      await db.execute(sql`SELECT 1`);
      return c.json({ status: 'ok' as const, db: 'ok' as const }, 200);
    } catch {
      return c.json({ status: 'error' as const, db: 'error' as const }, 503);
    }
  });
}
