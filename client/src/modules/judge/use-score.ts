import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upsertScore, type UpsertScoreInput } from '../shared/http';
import { queryKeys } from '../shared/query-keys';

export function useScore(pin: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpsertScoreInput) => upsertScore(data, pin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions });
      queryClient.invalidateQueries({ queryKey: queryKeys.leaderboard });
    },
  });
}
