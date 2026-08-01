CREATE TABLE "scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"judge_name" text NOT NULL,
	"prd_score" integer NOT NULL,
	"rfc_score" integer NOT NULL,
	"code_score" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_name" text NOT NULL,
	"github_url" text NOT NULL,
	"deploy_url" text NOT NULL,
	"screenshot_urls" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "submissions_team_name_unique" UNIQUE("team_name"),
	CONSTRAINT "submissions_github_url_unique" UNIQUE("github_url")
);
--> statement-breakpoint
ALTER TABLE "scores" ADD CONSTRAINT "scores_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "scores_submission_judge_unique" ON "scores" USING btree ("submission_id","judge_name");