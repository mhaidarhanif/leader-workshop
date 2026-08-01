import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { Submission } from '../shared/http';
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 border-t pt-6">
      <h3 className="text-xl font-bold">Score: {submission.team_name}</h3>
      <div className="flex flex-wrap gap-4 text-base">
        <a className="text-primary underline" href={submission.github_url} target="_blank" rel="noreferrer">
          Repo
        </a>
        <a className="text-primary underline" href={submission.prd_url} target="_blank" rel="noreferrer">
          PRD
        </a>
        <a className="text-primary underline" href={submission.rfc_url} target="_blank" rel="noreferrer">
          RFC
        </a>
        <a className="text-primary underline" href={submission.deploy_url} target="_blank" rel="noreferrer">
          Deploy
        </a>
      </div>
      <div className="flex flex-col gap-2">
        <Label>PRD: {prd}</Label>
        <Slider value={[prd]} min={1} max={10} step={1} onValueChange={(v) => setPrd(v[0] ?? 1)} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>RFC: {rfc}</Label>
        <Slider value={[rfc]} min={1} max={10} step={1} onValueChange={(v) => setRfc(v[0] ?? 1)} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Code: {code}</Label>
        <Slider value={[code]} min={1} max={10} step={1} onValueChange={(v) => setCode(v[0] ?? 1)} />
      </div>
      {score.error && <p className="text-destructive">{score.error.message}</p>}
      {score.isSuccess && <p className="text-lg font-semibold text-primary">Score saved!</p>}
      <Button type="submit" disabled={score.isPending || !judgeName}>
        {score.isPending ? 'Saving…' : 'Save Score'}
      </Button>
    </form>
  );
}
