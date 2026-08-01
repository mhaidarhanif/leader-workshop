import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useLeaderboard } from './use-leaderboard';

function LeaderboardSkeleton() {
  return (
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
          {Array.from({ length: 5 }, (_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-6 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-10" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-10" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-10" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function LeaderboardEmpty() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <p className="text-lg">No submissions yet.</p>
      <p className="text-muted-foreground text-base">Be the first team to submit a project.</p>
      <Button asChild className="w-fit">
        <Link to="/submit">Submit a project</Link>
      </Button>
    </div>
  );
}

export function LeaderboardTable() {
  const { data, isLoading, error, dataUpdatedAt } = useLeaderboard();

  if (isLoading) return <LeaderboardSkeleton />;
  if (error) return <p className="text-destructive text-lg">{error.message}</p>;
  if (!data?.length) return <LeaderboardEmpty />;

  const updatedAt = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })
    : null;

  return (
    <div className="flex flex-col gap-4">
      {updatedAt && (
        <p className="text-muted-foreground text-sm">Updated {updatedAt}</p>
      )}
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
                className={cn(entry.is_top_five && 'border-l-4 border-l-primary bg-accent/40')}
              >
                <TableCell>
                  #{entry.rank}
                  {entry.is_top_five && (
                    <Badge className="ml-2" variant="default">
                      Top 5
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-semibold">{entry.team_name}</TableCell>
                <TableCell className="tabular-nums">{entry.avg_prd?.toFixed(1) ?? '—'}</TableCell>
                <TableCell className="tabular-nums">{entry.avg_rfc?.toFixed(1) ?? '—'}</TableCell>
                <TableCell className="tabular-nums">{entry.avg_code?.toFixed(1) ?? '—'}</TableCell>
                <TableCell className="tabular-nums">{entry.total?.toFixed(2) ?? 'Awaiting scores'}</TableCell>
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
    <main className="mx-auto max-w-5xl p-8">
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>Auto-refreshes every 10 seconds. Top 5 highlighted.</CardDescription>
        </CardHeader>
        <CardContent>
          <LeaderboardTable />
        </CardContent>
      </Card>
    </main>
  );
}
