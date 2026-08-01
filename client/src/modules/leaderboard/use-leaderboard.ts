import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboard } from '../shared/http';
import { queryKeys } from '../shared/query-keys';

export function useLeaderboard() {
  return useQuery({
    queryKey: queryKeys.leaderboard,
    queryFn: fetchLeaderboard,
    refetchInterval: 10_000,
  });
}
