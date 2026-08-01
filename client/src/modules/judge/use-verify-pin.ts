import { useMutation } from '@tanstack/react-query';
import { verifyJudgePin } from '../shared/http';

export function useVerifyPin() {
  return useMutation({
    mutationFn: (pin: string) => verifyJudgePin(pin),
  });
}
