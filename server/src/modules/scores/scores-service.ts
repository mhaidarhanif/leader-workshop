import { db } from '../shared/db.js';
import { scores } from '../shared/schema.js';

export type UpsertScoreInput = {
  submissionId: string;
  judgeName: string;
  prdScore: number;
  rfcScore: number;
  codeScore: number;
};

export async function upsertScore(input: UpsertScoreInput) {
  const [row] = await db
    .insert(scores)
    .values({
      submissionId: input.submissionId,
      judgeName: input.judgeName,
      prdScore: input.prdScore,
      rfcScore: input.rfcScore,
      codeScore: input.codeScore,
    })
    .onConflictDoUpdate({
      target: [scores.submissionId, scores.judgeName],
      set: {
        prdScore: input.prdScore,
        rfcScore: input.rfcScore,
        codeScore: input.codeScore,
      },
    })
    .returning();

  return {
    id: row.id,
    submission_id: row.submissionId,
    judge_name: row.judgeName,
    prd_score: row.prdScore,
    rfc_score: row.rfcScore,
    code_score: row.codeScore,
    created_at: row.createdAt.toISOString(),
  };
}
