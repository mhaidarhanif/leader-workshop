import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDisplayUrl } from '../shared/format-display-url';
import type { Submission } from '../shared/http';

type ArtifactLink = {
  label: string;
  url: string;
};

function ArtifactLinkRow({ label, url }: ArtifactLink) {
  return (
    <Button
      asChild
      variant="outline"
      className="h-auto min-h-14 w-full justify-between gap-3 px-4 py-3 text-left hover:bg-accent"
    >
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        title={url}
        aria-label={`Open ${label}: ${url}`}
      >
        <span className="shrink-0 font-semibold">{label}</span>
        <span className="min-w-0 flex-1 font-mono text-base break-all">{formatDisplayUrl(url)}</span>
        <ExternalLink className="size-5 shrink-0" aria-hidden />
      </a>
    </Button>
  );
}

export function SubmissionArtifactLinks({ submission }: { submission: Submission }) {
  const fixedLinks: ArtifactLink[] = [
    { label: 'Repo', url: submission.github_url },
    { label: 'PRD', url: submission.prd_url },
    { label: 'RFC', url: submission.rfc_url },
    { label: 'Deploy', url: submission.deploy_url },
  ];

  const screenshotLinks: ArtifactLink[] = submission.screenshot_urls.map((url, index) => ({
    label: `Screenshot ${index + 1}`,
    url,
  }));

  return (
    <section aria-labelledby="submission-artifacts-heading" className="flex flex-col gap-3">
      <h4 id="submission-artifacts-heading" className="text-lg font-semibold">
        Submission artifacts
      </h4>
      <div className="flex flex-col flex-wrap gap-3">
        {fixedLinks.map((link) => (
          <ArtifactLinkRow key={link.label} {...link} />
        ))}
        {screenshotLinks.map((link) => (
          <ArtifactLinkRow key={link.label} {...link} />
        ))}
      </div>
      {submission.screenshot_urls.length === 0 && (
        <p className="text-muted-foreground text-base">No screenshots submitted</p>
      )}
    </section>
  );
}
