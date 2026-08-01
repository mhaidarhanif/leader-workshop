import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import type { Submission } from '../shared/http';
import { SubmissionArtifactLinks } from './submission-artifact-links';
import { useScore } from './use-score';

export function ScoreForm({
  submission,
  pin,
  judgeName,
  onUnauthorized,
}: {
  submission: Submission;
  pin: string;
  judgeName: string;
  onUnauthorized?: () => void;
}) {
  const score = useScore(pin, { onUnauthorized });
  const [prd, setPrd] = useState(5);
  const [rfc, setRfc] = useState(5);
  const [code, setCode] = useState(5);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    score.mutate({
      submission_id: submission.id,
      judge_name: judgeName,
      prd_score: prd,
      rfc_score: rfc,
      code_score: code,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h3 className="font-display text-2xl font-bold tracking-tight">
        Score: {submission.team_name}
      </h3>
      <SubmissionArtifactLinks submission={submission} />
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="flex flex-col gap-3 rounded-xl bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <Label id="prd-score-label">PRD</Label>
            <Badge variant="success" className="font-mono text-base tabular-nums">{prd}</Badge>
          </div>
          <Slider
            value={[prd]}
            min={1}
            max={10}
            step={1}
            aria-labelledby="prd-score-label"
            onValueChange={(v) => setPrd(v[0] ?? 1)}
          />
        </div>
        <div className="flex flex-col gap-3 rounded-xl bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <Label id="rfc-score-label">RFC</Label>
            <Badge variant="success" className="font-mono text-base tabular-nums">{rfc}</Badge>
          </div>
          <Slider
            value={[rfc]}
            min={1}
            max={10}
            step={1}
            aria-labelledby="rfc-score-label"
            onValueChange={(v) => setRfc(v[0] ?? 1)}
          />
        </div>
        <div className="flex flex-col gap-3 rounded-xl bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <Label id="code-score-label">Code</Label>
            <Badge variant="success" className="font-mono text-base tabular-nums">{code}</Badge>
          </div>
          <Slider
            value={[code]}
            min={1}
            max={10}
            step={1}
            aria-labelledby="code-score-label"
            onValueChange={(v) => setCode(v[0] ?? 1)}
          />
        </div>
      </div>
      {score.error && <p className="text-destructive">{score.error.message}</p>}
      {score.isSuccess && (
        <p className="text-lg font-semibold text-primary">Score saved</p>
      )}
      <Button type="submit" disabled={score.isPending || !judgeName} size="pill-lg" className="w-fit">
        {score.isPending ? 'Saving…' : 'Save score'}
      </Button>
    </form>
  );
}
