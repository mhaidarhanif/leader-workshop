import { db } from '../shared/db.js';
import { submissions, scores } from '../shared/schema.js';
import { rankSubmissions } from './ranking.js';

export async function getLeaderboard() {
  const allSubmissions = await db.select().from(submissions);
  const allScores = await db.select().from(scores);

  const ranked = rankSubmissions(
    allSubmissions.map((s) => ({
      id: s.id,
      teamName: s.teamName,
      createdAt: s.createdAt,
    })),
    allScores.map((s) => ({
      submissionId: s.submissionId,
      prdScore: s.prdScore,
      rfcScore: s.rfcScore,
      codeScore: s.codeScore,
    })),
  );

  return ranked.map((entry) => ({
    rank: entry.rank,
    submission_id: entry.submissionId,
    team_name: entry.teamName,
    avg_prd: entry.avgPrd,
    avg_rfc: entry.avgRfc,
    avg_code: entry.avgCode,
    total: entry.total,
    is_top_five: entry.isTopFive,
    created_at: entry.createdAt,
  }));
}
