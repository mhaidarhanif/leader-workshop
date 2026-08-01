import { z } from '@hono/zod-openapi';

export const UpsertScoreSchema = z.object({
  submission_id: z.string().uuid(),
  judge_name: z.string().min(1).max(100),
  prd_score: z.number().int().min(1).max(10),
  rfc_score: z.number().int().min(1).max(10),
  code_score: z.number().int().min(1).max(10),
});

export const ScoreSchema = z.object({
  id: z.string().uuid(),
  submission_id: z.string().uuid(),
  judge_name: z.string(),
  prd_score: z.number().int(),
  rfc_score: z.number().int(),
  code_score: z.number().int(),
  created_at: z.string().datetime(),
});

export const ErrorSchema = z.object({
  error: z.string(),
});

export const JudgePinHeaderSchema = z.object({
  'X-Judge-Pin': z.string(),
});
