import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSubmission, type CreateSubmissionInput } from '../shared/http';
import { queryKeys } from '../shared/query-keys';

export function useSubmit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubmissionInput) => createSubmission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions });
      queryClient.invalidateQueries({ queryKey: queryKeys.leaderboard });
    },
  });
}
