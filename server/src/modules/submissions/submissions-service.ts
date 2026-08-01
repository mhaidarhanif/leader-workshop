import { eq } from 'drizzle-orm';
import { db } from '../shared/db.js';
import { submissions } from '../shared/schema.js';
import { isValidGithubRepoRoot, toApiSubmission } from '../shared/github-docs.js';

export type CreateSubmissionInput = {
  teamName: string;
  githubUrl: string;
  deployUrl: string;
  screenshotUrls: string[];
};

export async function createSubmission(input: CreateSubmissionInput) {
  if (!isValidGithubRepoRoot(input.githubUrl)) {
    throw new ValidationError('github_url must be a GitHub repo root URL');
  }

  try {
    const [row] = await db
      .insert(submissions)
      .values({
        teamName: input.teamName,
        githubUrl: input.githubUrl.replace(/\/$/, ''),
        deployUrl: input.deployUrl,
        screenshotUrls: input.screenshotUrls,
      })
      .returning();

    return toApiSubmission(row);
  } catch (err: unknown) {
    if (isPostgresUniqueViolation(err)) {
      throw new ConflictError('Team name or GitHub URL already submitted');
    }
    throw err;
  }
}

export async function listSubmissions() {
  const rows = await db.select().from(submissions).orderBy(submissions.createdAt);
  return rows.map(toApiSubmission);
}

export async function getSubmissionById(id: string) {
  const [row] = await db.select().from(submissions).where(eq(submissions.id, id));
  if (!row) return null;
  return toApiSubmission(row);
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

function isPostgresUniqueViolation(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && (err as { code: string }).code === '23505';
}
