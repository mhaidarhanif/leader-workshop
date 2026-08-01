import { defineConfig } from 'drizzle-kit';
import { getDatabaseUrl } from './src/modules/shared/database-url.js';

export default defineConfig({
  schema: './src/modules/shared/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: getDatabaseUrl(),
  },
});
