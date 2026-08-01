import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PinGate, getStoredPin } from './pin-gate';
import { ScoreForm } from './score-form';
import { useSubmissions } from './use-submissions';

export function JudgePage() {
  const [pin, setPin] = useState<string | null>(getStoredPin());
  const [judgeName, setJudgeName] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: submissions, isLoading, error } = useSubmissions();

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

          {isLoading && <p>Loading submissions…</p>}
          {error && <p className="text-destructive">{error.message}</p>}

          {submissions && (
            <div className="flex flex-col gap-2">
              <Label>Select submission</Label>
              <div className="flex flex-col gap-2">
                {submissions.map((s) => (
                  <Button
                    key={s.id}
                    type="button"
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
            <ScoreForm submission={selected} pin={pin} judgeName={judgeName} />
          )}

          <Button asChild variant="outline">
            <Link to="/">Back home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
