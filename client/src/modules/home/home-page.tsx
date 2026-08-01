import { Link } from "react-router-dom";
import { AppContainer } from "@/components/app-container";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubmissionGrid } from "@/modules/submissions/submission-grid";
import { useSubmissions } from "@/modules/submissions/use-submissions";

export function HomePage() {
  const { data, dataUpdatedAt } = useSubmissions();
  const count = data?.length ?? 0;
  const updatedAt = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <AppContainer as="main" className="flex flex-1 flex-col gap-12 py-10">
      <section className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-2xl flex-col gap-6">
          <PageHeader
            eyebrow="Workshop showcase"
            title="Browse every attendee project"
            description="Submit without an account. Judges score live. The leaderboard refreshes every 10 seconds."
          />
          <Button asChild size="pill-lg" className="w-fit">
            <Link to="/submit">Submit project</Link>
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Badge variant="secondary" className="px-4 py-2 text-base">
            {count} submission{count === 1 ? "" : "s"}
          </Badge>
          {updatedAt && (
            <Badge variant="muted" className="px-4 py-2 text-base">
              Updated {updatedAt}
            </Badge>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-2xl font-bold tracking-tight">Submissions</h2>
        <SubmissionGrid />
      </section>
    </AppContainer>
  );
}
