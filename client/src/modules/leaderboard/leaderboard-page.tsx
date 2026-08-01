import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

export function LeaderboardTable() {
  const { data, isLoading, error } = useLeaderboard();

  if (isLoading) return <p className="text-lg">Loading leaderboard…</p>;
  if (error) return <p className="text-destructive text-lg">{error.message}</p>;
  if (!data?.length) return <p className="text-lg">No submissions yet.</p>;

  return (
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
            <TableCell>{entry.avg_prd?.toFixed(1) ?? '—'}</TableCell>
            <TableCell>{entry.avg_rfc?.toFixed(1) ?? '—'}</TableCell>
            <TableCell>{entry.avg_code?.toFixed(1) ?? '—'}</TableCell>
            <TableCell>{entry.total?.toFixed(2) ?? 'Awaiting scores'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
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
          <Button asChild variant="outline" className="mt-6">
            <Link to="/">Back home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
