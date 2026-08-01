import { ExternalLink, Github } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { isStaticImageUrl } from "@/modules/shared/image-helper";
import type { Submission } from "@/modules/shared/http";
import { teamGradientStyle } from "@/modules/shared/team-gradient";

type SubmissionCardProps = {
  submission: Submission;
  selected?: boolean;
  onSelect?: () => void;
  rank?: number;
  total?: number | null;
  className?: string;
};

export function SubmissionCard({
  submission,
  selected,
  onSelect,
  rank,
  total,
  className,
}: SubmissionCardProps) {
  const thumbnail = submission.screenshot_urls[0];
  const [imageFailed, setImageFailed] = useState(false);
  const showThumbnail =
    thumbnail && isStaticImageUrl(thumbnail) && !imageFailed;
  const interactive = onSelect !== undefined;

  const content = (
    <>
      <div className="relative aspect-video overflow-hidden bg-muted">
        {showThumbnail ? (
          <img
            src={thumbnail}
            alt={`Screenshot for ${submission.team_name}`}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="flex size-full items-center justify-center"
            style={teamGradientStyle(submission.team_name)}
            aria-hidden
          ></div>
        )}
        {(rank !== undefined || total !== undefined) && (
          <div className="absolute left-3 top-3 flex gap-2">
            {rank !== undefined && <Badge variant="rank">#{rank}</Badge>}
            {total !== null && total !== undefined && (
              <Badge variant="success">{Number(total).toFixed(2)}</Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-xl font-bold tracking-tight">
            {submission.team_name}
          </h3>
          <p className="text-base text-muted-foreground">
            by {submission.team_name}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={submission.github_url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            onClick={(e) => interactive && e.stopPropagation()}
          >
            <Github className="size-4" aria-hidden />
            GitHub
          </a>
          <a
            href={submission.deploy_url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            onClick={(e) => interactive && e.stopPropagation()}
          >
            <ExternalLink className="size-4" aria-hidden />
            Live site
          </a>
        </div>
      </div>
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={cn(
          "group w-full overflow-hidden rounded-2xl bg-card text-left shadow-card transition-[ring-color,shadow] duration-200 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          selected && "ring-2 ring-primary",
          className,
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl bg-card ring-1 ring-border/60 shadow-card transition-shadow duration-200 hover:shadow-elevated",
        className,
      )}
    >
      {content}
    </article>
  );
}
