import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PIN_KEY = 'judge_pin';

export function PinGate({ onUnlock }: { onUnlock: (pin: string) => void }) {
  const [pin, setPin] = useState(sessionStorage.getItem(PIN_KEY) ?? '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem(PIN_KEY, pin);
    onUnlock(pin);
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
      <Button type="submit">Unlock</Button>
    </form>
  );
}

export function getStoredPin(): string | null {
  return sessionStorage.getItem(PIN_KEY);
}
