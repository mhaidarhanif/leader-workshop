import { useEffect, useState } from 'react';
import { KeyRound } from 'lucide-react';
import { AppContainer } from '@/components/app-container';
import { PageHeader } from '@/components/page-header';
import { SubmissionCard } from '@/components/submission-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { verifyJudgePin } from '../shared/http';
import { PinGate, clearStoredPin, getStoredPin } from './pin-gate';
import { ScoreForm } from './score-form';
import { useSubmissions } from '@/modules/submissions/use-submissions';

function SubmissionsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2" aria-busy="true" aria-label="Loading submissions">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-48 rounded-2xl" />
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
      <AppContainer as="main" className="py-10">
        <PageHeader title="Judge portal" description="Verifying judge PIN…" />
      </AppContainer>
    );
  }

  if (!pin) {
    return (
      <AppContainer as="main" className="py-10">
        <div className="flex flex-col gap-8">
          <PageHeader
            eyebrow="Judges only"
            title="Judge portal"
            description="Enter the shared judge PIN to continue."
          />
          <Card className="mx-auto w-full max-w-md shadow-elevated">
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <KeyRound className="size-5" aria-hidden />
                <p className="text-base">PIN is required to score submissions.</p>
              </div>
              <PinGate onUnlock={setPin} />
            </CardContent>
          </Card>
        </div>
      </AppContainer>
    );
  }

  const selected = submissions?.find((s) => s.id === selectedId) ?? null;

  return (
    <AppContainer as="main" className="py-10">
      <div className="flex flex-col gap-8">
        <PageHeader
          eyebrow="Judges only"
          title="Judge portal"
          description="Score PRD, RFC, and Code from 1–10."
        />

        <div className="flex flex-col gap-2">
          <Label htmlFor="judge">Your name</Label>
          <Input
            id="judge"
            value={judgeName}
            onChange={(e) => setJudgeName(e.target.value)}
            required
          />
        </div>

        {isLoading && <SubmissionsSkeleton />}
        {error && <p className="text-destructive">{error.message}</p>}

        {!isLoading && !error && submissions && submissions.length === 0 && (
          <p className="text-lg">No submissions to score yet.</p>
        )}

        {!isLoading && submissions && submissions.length > 0 && (
          <div className="flex flex-col gap-4">
            <Label id="submission-picker-label">Select submission</Label>
            <div
              role="listbox"
              aria-labelledby="submission-picker-label"
              className="grid gap-4 sm:grid-cols-2"
            >
              {submissions.map((s) => (
                <SubmissionCard
                  key={s.id}
                  submission={s}
                  compact
                  selected={selectedId === s.id}
                  onSelect={() => setSelectedId(s.id)}
                />
              ))}
            </div>
          </div>
        )}

        {selected && pin && (
          <Card className="shadow-elevated">
            <CardContent className="p-6">
              <ScoreForm
                submission={selected}
                pin={pin}
                judgeName={judgeName}
                onUnauthorized={handleAuthFailure}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </AppContainer>
  );
}
