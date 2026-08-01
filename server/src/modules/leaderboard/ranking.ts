export type ScoreRow = {
  submissionId: string;
  prdScore: number;
  rfcScore: number;
  codeScore: number;
};

export type SubmissionRow = {
  id: string;
  teamName: string;
  createdAt: Date;
};

export type RankedEntry = {
  rank: number;
  submissionId: string;
  teamName: string;
  avgPrd: number | null;
  avgRfc: number | null;
  avgCode: number | null;
  total: number | null;
  isTopFive: boolean;
  createdAt: string;
};

function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function rankSubmissions(
  submissions: SubmissionRow[],
  scores: ScoreRow[],
): RankedEntry[] {
  const scoresBySubmission = new Map<string, ScoreRow[]>();
  for (const score of scores) {
    const list = scoresBySubmission.get(score.submissionId) ?? [];
    list.push(score);
    scoresBySubmission.set(score.submissionId, list);
  }

  const entries = submissions.map((sub) => {
    const subScores = scoresBySubmission.get(sub.id) ?? [];
    if (subScores.length === 0) {
      return {
        submissionId: sub.id,
        teamName: sub.teamName,
        avgPrd: null,
        avgRfc: null,
        avgCode: null,
        total: null as number | null,
        createdAt: sub.createdAt,
      };
    }

    const avgPrd = mean(subScores.map((s) => s.prdScore));
    const avgRfc = mean(subScores.map((s) => s.rfcScore));
    const avgCode = mean(subScores.map((s) => s.codeScore));
    const total = (avgPrd + avgRfc + avgCode) / 3;

    return {
      submissionId: sub.id,
      teamName: sub.teamName,
      avgPrd,
      avgRfc,
      avgCode,
      total,
      createdAt: sub.createdAt,
    };
  });

  entries.sort((a, b) => {
    if (a.total === null && b.total === null) {
      return a.createdAt.getTime() - b.createdAt.getTime();
    }
    if (a.total === null) return 1;
    if (b.total === null) return -1;
    if (b.total !== a.total) return b.total - a.total;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  return entries.map((entry, index) => ({
    rank: index + 1,
    submissionId: entry.submissionId,
    teamName: entry.teamName,
    avgPrd: entry.avgPrd,
    avgRfc: entry.avgRfc,
    avgCode: entry.avgCode,
    total: entry.total,
    isTopFive: entry.total !== null && index < 5,
    createdAt: entry.createdAt.toISOString(),
  }));
}
