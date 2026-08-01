import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './schema.js';
import { getDatabaseUrl } from './database-url.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsFolder = join(__dirname, '../../../drizzle');

const client = postgres(getDatabaseUrl());
export const db = drizzle(client, { schema });

export async function runMigrations(): Promise<void> {
  const migrationClient = postgres(getDatabaseUrl(), { max: 1 });
  const migrationDb = drizzle(migrationClient);
  await migrate(migrationDb, { migrationsFolder });
  await migrationClient.end();
}

export function getJudgePin(): string {
  const pin = process.env.JUDGE_PIN;
  if (!pin) throw new Error('JUDGE_PIN is required');
  return pin;
}
