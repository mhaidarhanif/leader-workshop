import { useQuery } from '@tanstack/react-query';
import { fetchSubmissions } from '../shared/http';
import { queryKeys } from '../shared/query-keys';

export function useSubmissions() {
  return useQuery({
    queryKey: queryKeys.submissions,
    queryFn: fetchSubmissions,
  });
}
