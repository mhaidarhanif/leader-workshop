import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type PodiumEntry = {
  rank: number;
  teamName: string;
  total: number;
  deployUrl?: string;
};

const podiumStyles: Record<number, string> = {
  1: 'bg-primary/15 ring-primary/30',
  2: 'bg-accent/60 ring-border',
  3: 'bg-secondary/80 ring-border',
};

const podiumOrder = [2, 1, 3];

export function Podium({ entries }: { entries: PodiumEntry[] }) {
  const sorted = podiumOrder
    .map((rank) => entries.find((e) => e.rank === rank))
    .filter((e): e is PodiumEntry => e !== undefined);

  if (sorted.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {sorted.map((entry) => {
        const isFirst = entry.rank === 1;
        return (
          <div
            key={entry.rank}
            className={cn(
              'flex flex-col items-center gap-3 rounded-2xl p-6 ring-1 shadow-card',
              podiumStyles[entry.rank],
              isFirst && 'sm:-translate-y-2 sm:shadow-elevated',
            )}
          >
            <Badge variant="rank" className="text-base">#{entry.rank}</Badge>
            <p className="font-display text-center text-xl font-bold tracking-tight">
              {entry.teamName}
            </p>
            <p className="font-mono text-3xl font-bold tabular-nums text-primary">
              {entry.total.toFixed(2)}
            </p>
            {entry.deployUrl && (
              <a
                href={entry.deployUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <ExternalLink className="size-4" aria-hidden />
                Live site
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
