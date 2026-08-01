import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVerifyPin } from './use-verify-pin';

const PIN_KEY = 'judge_pin';

export function PinGate({ onUnlock }: { onUnlock: (pin: string) => void }) {
  const [pin, setPin] = useState(sessionStorage.getItem(PIN_KEY) ?? '');
  const [error, setError] = useState<string | null>(null);
  const verify = useVerifyPin();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = pin.trim();
    verify.mutate(trimmed, {
      onSuccess: () => {
        sessionStorage.setItem(PIN_KEY, trimmed);
        onUnlock(trimmed);
      },
      onError: (err) => {
        setError(
          err.message === 'Unauthorized'
            ? 'Invalid judge PIN. If you recently changed JUDGE_PIN, restart pnpm dev.'
            : err.message,
        );
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="pin">Judge PIN</Label>
        <Input
          id="pin"
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-destructive">{error}</p>}
      <Button type="submit" disabled={verify.isPending}>
        {verify.isPending ? 'Verifying…' : 'Unlock'}
      </Button>
    </form>
  );
}

export function getStoredPin(): string | null {
  return sessionStorage.getItem(PIN_KEY);
}

export function clearStoredPin(): void {
  sessionStorage.removeItem(PIN_KEY);
}
