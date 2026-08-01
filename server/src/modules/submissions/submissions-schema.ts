import { z } from '@hono/zod-openapi';

export const CreateSubmissionSchema = z.object({
  team_name: z.string().min(1).max(100),
  github_url: z.string().url(),
  deploy_url: z.string().url(),
  screenshot_urls: z.array(z.string().url()).min(1),
});

export const SubmissionSchema = z.object({
  id: z.string().uuid(),
  team_name: z.string(),
  github_url: z.string().url(),
  deploy_url: z.string().url(),
  screenshot_urls: z.array(z.string().url()),
  prd_url: z.string().url(),
  rfc_url: z.string().url(),
  created_at: z.string().datetime(),
});

export const SubmissionListSchema = z.array(SubmissionSchema);

export const SubmissionIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const ErrorSchema = z.object({
  error: z.string(),
});
