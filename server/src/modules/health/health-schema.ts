import { z } from '@hono/zod-openapi';

export const HealthResponseSchema = z.object({
  status: z.enum(['ok', 'error']),
  db: z.enum(['ok', 'error']),
});
