import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';

vi.mock('./db.js', () => ({
  getJudgePin: () => {
    const pin = process.env.JUDGE_PIN;
    if (!pin) throw new Error('JUDGE_PIN is required');
    return pin;
  },
}));

import { judgePinMiddleware } from './judge-pin-middleware.js';

describe('judgePinMiddleware', () => {
  beforeEach(() => {
    process.env.JUDGE_PIN = 'test_pin';
  });

  function appWithMiddleware() {
    const app = new Hono();
    app.use('/test', judgePinMiddleware);
    app.get('/test', (c) => c.json({ ok: true }));
    return app;
  }

  it('passes with correct PIN', async () => {
    const res = await appWithMiddleware().request('/test', {
      headers: { 'X-Judge-Pin': 'test_pin' },
    });
    expect(res.status).toBe(200);
  });

  it('passes when PIN has surrounding whitespace', async () => {
    const res = await appWithMiddleware().request('/test', {
      headers: { 'X-Judge-Pin': '  test_pin  ' },
    });
    expect(res.status).toBe(200);
  });

  it('returns 401 for wrong PIN', async () => {
    const res = await appWithMiddleware().request('/test', {
      headers: { 'X-Judge-Pin': 'wrong' },
    });
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthorized' });
  });

  it('returns 401 when PIN header is missing', async () => {
    const res = await appWithMiddleware().request('/test');
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthorized' });
  });
});
