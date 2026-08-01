export type Submission = {
  id: string;
  team_name: string;
  github_url: string;
  deploy_url: string;
  screenshot_urls: string[];
  prd_url: string;
  rfc_url: string;
  created_at: string;
};

export type LeaderboardEntry = {
  rank: number;
  submission_id: string;
  team_name: string;
  avg_prd: number | null;
  avg_rfc: number | null;
  avg_code: number | null;
  total: number | null;
  is_top_five: boolean;
  created_at: string;
};

export type CreateSubmissionInput = {
  team_name: string;
  github_url: string;
  deploy_url: string;
  screenshot_urls: string[];
};

export type UpsertScoreInput = {
  submission_id: string;
  judge_name: string;
  prd_score: number;
  rfc_score: number;
  code_score: number;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((body as { error?: string }).error ?? 'Request failed');
  }
  return res.json() as Promise<T>;
}

export function fetchSubmissions() {
  return request<Submission[]>('/api/submissions');
}

export function fetchLeaderboard() {
  return request<LeaderboardEntry[]>('/api/leaderboard');
}

export function createSubmission(data: CreateSubmissionInput) {
  return request<Submission>('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function upsertScore(data: UpsertScoreInput, pin: string) {
  return request('/api/scores', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Judge-Pin': pin,
    },
    body: JSON.stringify(data),
  });
}

export function parseScreenshotUrls(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
