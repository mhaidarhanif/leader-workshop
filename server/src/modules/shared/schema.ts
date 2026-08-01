import { pgTable, uuid, text, jsonb, timestamp, integer, uniqueIndex } from 'drizzle-orm/pg-core';

export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamName: text('team_name').notNull().unique(),
  githubUrl: text('github_url').notNull().unique(),
  deployUrl: text('deploy_url').notNull(),
  screenshotUrls: jsonb('screenshot_urls').$type<string[]>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const scores = pgTable(
  'scores',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    submissionId: uuid('submission_id')
      .notNull()
      .references(() => submissions.id, { onDelete: 'cascade' }),
    judgeName: text('judge_name').notNull(),
    prdScore: integer('prd_score').notNull(),
    rfcScore: integer('rfc_score').notNull(),
    codeScore: integer('code_score').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('scores_submission_judge_unique').on(table.submissionId, table.judgeName)],
);

export type Submission = typeof submissions.$inferSelect;
export type Score = typeof scores.$inferSelect;
