import type { Context, Next } from 'hono';
import { getJudgePin } from './db.js';

export async function judgePinMiddleware(c: Context, next: Next) {
  const pin = c.req.header('X-Judge-Pin');
  if (!pin || pin !== getJudgePin()) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
}
