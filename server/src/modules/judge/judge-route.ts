import { createRoute, type OpenAPIHono, z } from '@hono/zod-openapi';
import { judgePinMiddleware } from '../shared/judge-pin-middleware.js';
import { ErrorSchema, JudgePinHeaderSchema } from '../scores/scores-schema.js';

const VerifyOkSchema = z.object({
  ok: z.literal(true),
});

const verifyPinRoute = createRoute({
  method: 'post',
  path: '/api/judge/verify',
  middleware: [judgePinMiddleware],
  request: {
    headers: JudgePinHeaderSchema,
  },
  responses: {
    200: {
      description: 'PIN valid',
      content: { 'application/json': { schema: VerifyOkSchema } },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

export function registerJudgeRoutes(app: OpenAPIHono) {
  app.openapi(verifyPinRoute, (c) => c.json({ ok: true as const }, 200));
}
