import { Link } from 'react-router-dom';
import { AppContainer } from '@/components/app-container';
import { PageHeader } from '@/components/page-header';
import { Podium } from '@/components/podium';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useSubmissions } from '@/modules/submissions/use-submissions';
import { useLeaderboard } from './use-leaderboard';

function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

function LeaderboardEmpty() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-card p-8 ring-1 ring-border/60 shadow-card">
      <p className="text-lg font-semibold">No submissions yet.</p>
      <p className="text-muted-foreground text-base">Be the first team to submit a project.</p>
      <Button asChild className="w-fit" size="pill">
        <Link to="/submit">Submit a project</Link>
      </Button>
    </div>
  );
}

export function LeaderboardTable() {
  const { data, isLoading, error, dataUpdatedAt } = useLeaderboard();
  const { data: submissions } = useSubmissions();

  if (isLoading) return <LeaderboardSkeleton />;
  if (error) return <p className="text-destructive text-lg">{error.message}</p>;
  if (!data?.length) return <LeaderboardEmpty />;

  const submissionMap = new Map(submissions?.map((s) => [s.id, s]) ?? []);
  const updatedAt = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      })
    : null;

  const podiumEntries = data
    .filter((e) => e.rank <= 3 && e.total !== null)
    .map((e) => ({
      rank: e.rank,
      teamName: e.team_name,
      total: e.total!,
      deployUrl: submissionMap.get(e.submission_id)?.deploy_url,
    }));

  return (
    <div className="flex flex-col gap-8">
      {updatedAt && (
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Updated {updatedAt}
        </p>
      )}

      {podiumEntries.length > 0 && <Podium entries={podiumEntries} />}

      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>PRD</TableHead>
              <TableHead>RFC</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((entry) => (
              <TableRow
                key={entry.submission_id}
                className={cn(entry.is_top_five && 'bg-accent/40')}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="rank">#{entry.rank}</Badge>
                    {entry.is_top_five && <Badge variant="success">Top 5</Badge>}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{entry.team_name}</TableCell>
                <TableCell className="font-mono tabular-nums">
                  {entry.avg_prd?.toFixed(1) ?? '—'}
                </TableCell>
                <TableCell className="font-mono tabular-nums">
                  {entry.avg_rfc?.toFixed(1) ?? '—'}
                </TableCell>
                <TableCell className="font-mono tabular-nums">
                  {entry.avg_code?.toFixed(1) ?? '—'}
                </TableCell>
                <TableCell className="font-mono font-semibold tabular-nums">
                  {entry.total?.toFixed(2) ?? 'Awaiting scores'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function LeaderboardPage() {
  return (
    <AppContainer as="main" className="py-10">
      <div className="flex flex-col gap-8">
        <PageHeader
          eyebrow="Live rankings"
          title="Leaderboard"
          description="Auto-refreshes every 10 seconds. Top 5 teams highlighted."
        />
        <LeaderboardTable />
      </div>
    </AppContainer>
  );
}
