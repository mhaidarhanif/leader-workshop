import { Link } from 'react-router-dom';
import { SubmissionCard } from '@/components/submission-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSubmissions } from './use-submissions';

function SubmissionGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl ring-1 ring-border/60">
          <Skeleton className="aspect-[16/10] w-full rounded-none" />
          <div className="flex flex-col gap-3 p-5">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SubmissionGridEmpty() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl bg-card p-12 text-center ring-1 ring-border/60 shadow-card">
      <div
        className="flex size-16 items-center justify-center rounded-2xl bg-primary/15 font-display text-2xl font-bold text-primary"
        aria-hidden
      >
        0
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-display text-xl font-bold">No submissions yet</p>
        <p className="text-muted-foreground">Be the first team to showcase a project.</p>
      </div>
      <Button asChild size="pill">
        <Link to="/submit">Submit a project</Link>
      </Button>
    </div>
  );
}

export function SubmissionGrid() {
  const { data, isLoading, error } = useSubmissions();

  if (isLoading) return <SubmissionGridSkeleton />;
  if (error) return <p className="text-destructive text-lg">{error.message}</p>;
  if (!data?.length) return <SubmissionGridEmpty />;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((submission) => (
        <SubmissionCard key={submission.id} submission={submission} />
      ))}
    </div>
  );
}
