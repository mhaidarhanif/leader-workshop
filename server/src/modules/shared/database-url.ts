export function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const host = process.env.POSTGRES_HOST ?? 'localhost';
  const password = process.env.POSTGRES_PASSWORD;
  const db = process.env.POSTGRES_DB ?? 'workshop_judge';
  const user = process.env.POSTGRES_USER ?? 'postgres';
  const port = '5432';

  if (!password) {
    throw new Error('POSTGRES_PASSWORD or DATABASE_URL is required');
  }

  return `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${db}`;
}
