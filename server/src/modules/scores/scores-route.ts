import { createRoute, type OpenAPIHono } from '@hono/zod-openapi';
import { judgePinMiddleware } from '../shared/judge-pin-middleware.js';
import {
  UpsertScoreSchema,
  ScoreSchema,
  ErrorSchema,
  JudgePinHeaderSchema,
} from './scores-schema.js';
import { upsertScore } from './scores-service.js';

const upsertScoreRoute = createRoute({
  method: 'put',
  path: '/api/scores',
  request: {
    headers: JudgePinHeaderSchema,
    body: {
      content: { 'application/json': { schema: UpsertScoreSchema } },
    },
  },
  responses: {
    200: {
      description: 'Score saved',
      content: { 'application/json': { schema: ScoreSchema } },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

export function registerScoreRoutes(app: OpenAPIHono) {
  app.use('/api/scores', judgePinMiddleware);

  app.openapi(upsertScoreRoute, async (c) => {
    const body = c.req.valid('json');
    const result = await upsertScore({
      submissionId: body.submission_id,
      judgeName: body.judge_name,
      prdScore: body.prd_score,
      rfcScore: body.rfc_score,
      codeScore: body.code_score,
    });
    return c.json(result, 200);
  });
}
