import type { Context, Next } from 'hono';
import { getJudgePin } from './db.js';

export async function judgePinMiddleware(c: Context, next: Next) {
  const pin = c.req.header('X-Judge-Pin')?.trim();
  const expected = getJudgePin().trim();
  if (!pin || pin !== expected) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
}
