const REPO_ROOT = /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/;

export function isValidGithubRepoRoot(url: string): boolean {
  return REPO_ROOT.test(url);
}

export function deriveDocUrls(githubUrl: string): { prdUrl: string; rfcUrl: string } {
  const base = githubUrl.replace(/\/$/, '');
  return {
    prdUrl: `${base}/blob/main/PRD.md`,
    rfcUrl: `${base}/blob/main/RFC.md`,
  };
}

export function enrichSubmission<T extends { githubUrl: string }>(
  row: T,
): T & { prdUrl: string; rfcUrl: string } {
  const docs = deriveDocUrls(row.githubUrl);
  return { ...row, prdUrl: docs.prdUrl, rfcUrl: docs.rfcUrl };
}

export function toApiSubmission(row: {
  id: string;
  teamName: string;
  githubUrl: string;
  deployUrl: string;
  screenshotUrls: string[];
  createdAt: Date;
}) {
  const docs = deriveDocUrls(row.githubUrl);
  return {
    id: row.id,
    team_name: row.teamName,
    github_url: row.githubUrl,
    deploy_url: row.deployUrl,
    screenshot_urls: row.screenshotUrls,
    prd_url: docs.prdUrl,
    rfc_url: docs.rfcUrl,
    created_at: row.createdAt.toISOString(),
  };
}
