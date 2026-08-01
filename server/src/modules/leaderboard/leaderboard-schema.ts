import { z } from '@hono/zod-openapi';

export const LeaderboardEntrySchema = z.object({
  rank: z.number().int(),
  submission_id: z.string().uuid(),
  team_name: z.string(),
  avg_prd: z.number().nullable(),
  avg_rfc: z.number().nullable(),
  avg_code: z.number().nullable(),
  total: z.number().nullable(),
  is_top_five: z.boolean(),
  created_at: z.string().datetime(),
});

export const LeaderboardSchema = z.array(LeaderboardEntrySchema);
