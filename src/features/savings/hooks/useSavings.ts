import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SavingService } from '../services/SavingService';
import { withProgress } from '../mappers/saving.mapper';
import { AddContributionInput, CreateSavingGoalInput } from '../types/saving.types';

export const savingGoalsQueryKey = ['saving-goals'] as const;

export function useSavingGoals() {
  const query = useQuery({
    queryKey: savingGoalsQueryKey,
    queryFn: () => SavingService.getAll(),
  });

  const goalsWithProgress = useMemo(() => (query.data ?? []).map(withProgress), [query.data]);

  return { ...query, data: goalsWithProgress };
}

export function useSavingGoal(id: string | undefined) {
  const query = useQuery({
    queryKey: [...savingGoalsQueryKey, id],
    queryFn: () => SavingService.getById(id as string),
    enabled: !!id,
  });

  const goalWithProgress = query.data ? withProgress(query.data) : undefined;

  return { ...query, data: goalWithProgress };
}

export function useSavingContributions(savingGoalId: string | undefined) {
  return useQuery({
    queryKey: ['saving-contributions', savingGoalId],
    queryFn: () => SavingService.getContributions(savingGoalId as string),
    enabled: !!savingGoalId,
  });
}

export function useCreateSavingGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSavingGoalInput) => SavingService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: savingGoalsQueryKey }),
  });
}

export function useDeleteSavingGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => SavingService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: savingGoalsQueryKey }),
  });
}

export function useAddContribution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddContributionInput) => SavingService.addContribution(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: savingGoalsQueryKey });
      queryClient.invalidateQueries({ queryKey: ['saving-contributions', variables.savingGoalId] });
    },
  });
}
