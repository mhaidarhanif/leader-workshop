import { createRoute, type OpenAPIHono } from '@hono/zod-openapi';
import {
  CreateSubmissionSchema,
  SubmissionSchema,
  SubmissionListSchema,
  SubmissionIdParamSchema,
  ErrorSchema,
} from './submissions-schema.js';
import {
  createSubmission,
  listSubmissions,
  getSubmissionById,
  ValidationError,
  ConflictError,
} from './submissions-service.js';

const createSubmissionRoute = createRoute({
  method: 'post',
  path: '/api/submissions',
  request: {
    body: {
      content: { 'application/json': { schema: CreateSubmissionSchema } },
    },
  },
  responses: {
    201: {
      description: 'Created',
      content: { 'application/json': { schema: SubmissionSchema } },
    },
    400: {
      description: 'Validation error',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    409: {
      description: 'Duplicate submission',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

const listSubmissionsRoute = createRoute({
  method: 'get',
  path: '/api/submissions',
  responses: {
    200: {
      description: 'List submissions',
      content: { 'application/json': { schema: SubmissionListSchema } },
    },
  },
});

const getSubmissionRoute = createRoute({
  method: 'get',
  path: '/api/submissions/{id}',
  request: { params: SubmissionIdParamSchema },
  responses: {
    200: {
      description: 'Submission detail',
      content: { 'application/json': { schema: SubmissionSchema } },
    },
    404: {
      description: 'Not found',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

export function registerSubmissionRoutes(app: OpenAPIHono) {
  app.openapi(createSubmissionRoute, async (c) => {
    const body = c.req.valid('json');
    try {
      const result = await createSubmission({
        teamName: body.team_name,
        githubUrl: body.github_url,
        deployUrl: body.deploy_url,
        screenshotUrls: body.screenshot_urls,
      });
      return c.json(result, 201);
    } catch (err) {
      if (err instanceof ValidationError) return c.json({ error: err.message }, 400);
      if (err instanceof ConflictError) return c.json({ error: err.message }, 409);
      throw err;
    }
  });

  app.openapi(listSubmissionsRoute, async (c) => {
    const result = await listSubmissions();
    return c.json(result, 200);
  });

  app.openapi(getSubmissionRoute, async (c) => {
    const { id } = c.req.valid('param');
    const result = await getSubmissionById(id);
    if (!result) return c.json({ error: 'Not found' }, 404);
    return c.json(result, 200);
  });
}
