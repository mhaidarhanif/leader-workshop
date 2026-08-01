import type { OpenAPIHono } from '@hono/zod-openapi';
import { Scalar } from '@scalar/hono-api-reference';

export function setupOpenApiDocs(app: OpenAPIHono) {
  app.doc31('/api/openapi.json', {
    openapi: '3.1.0',
    info: {
      title: 'Workshop Judge API',
      version: '1.0.0',
    },
  });

  app.get(
    '/api/docs',
    Scalar({
      url: '/api/openapi.json',
      pageTitle: 'Workshop Judge API',
    }),
  );
}
