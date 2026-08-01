import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { verifyJudgePin } from '../shared/http';
import { PinGate, clearStoredPin, getStoredPin } from './pin-gate';
import { ScoreForm } from './score-form';
import { useSubmissions } from './use-submissions';

function SubmissionsSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-busy="true" aria-label="Loading submissions">
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function JudgePage() {
  const [pin, setPin] = useState<string | null>(null);
  const [checkingPin, setCheckingPin] = useState(() => !!getStoredPin());
  const [judgeName, setJudgeName] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: submissions, isLoading, error } = useSubmissions();

  useEffect(() => {
    const stored = getStoredPin();
    if (!stored) {
      setCheckingPin(false);
      return;
    }

    verifyJudgePin(stored)
      .then(() => setPin(stored.trim()))
      .catch(() => clearStoredPin())
      .finally(() => setCheckingPin(false));
  }, []);

  const handleAuthFailure = () => {
    clearStoredPin();
    setPin(null);
    setSelectedId(null);
  };

  if (checkingPin) {
    return (
      <main className="mx-auto max-w-md p-8">
        <Card>
          <CardHeader>
            <CardTitle>Judge Portal</CardTitle>
            <CardDescription>Verifying judge PIN…</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  if (!pin) {
    return (
      <main className="mx-auto max-w-md p-8">
        <Card>
          <CardHeader>
            <CardTitle>Judge Portal</CardTitle>
            <CardDescription>Enter the shared judge PIN to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <PinGate onUnlock={setPin} />
          </CardContent>
        </Card>
      </main>
    );
  }

  const selected = submissions?.find((s) => s.id === selectedId) ?? null;

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Card>
        <CardHeader>
          <CardTitle>Judge Portal</CardTitle>
          <CardDescription>Score PRD, RFC, and Code from 1–10.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="judge">Your name</Label>
            <Input id="judge" value={judgeName} onChange={(e) => setJudgeName(e.target.value)} required />
          </div>

          {isLoading && <SubmissionsSkeleton />}
          {error && <p className="text-destructive">{error.message}</p>}

          {!isLoading && !error && submissions && submissions.length === 0 && (
            <p className="text-lg">No submissions to score yet.</p>
          )}

          {!isLoading && submissions && submissions.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label id="submission-picker-label">Select submission</Label>
              <div
                role="listbox"
                aria-labelledby="submission-picker-label"
                className="flex flex-col gap-2"
              >
                {submissions.map((s) => (
                  <Button
                    key={s.id}
                    type="button"
                    role="option"
                    aria-selected={selectedId === s.id}
                    variant={selectedId === s.id ? 'default' : 'outline'}
                    onClick={() => setSelectedId(s.id)}
                  >
                    {s.team_name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selected && pin && (
            <ScoreForm
              submission={selected}
              pin={pin}
              judgeName={judgeName}
              onUnauthorized={handleAuthFailure}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
