import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PlanningService } from '../services/PlanningService';
import { CreateScenarioInput, UpdateScenarioInput } from '../types';

export const planningScenariosQueryKey = ['planning-scenarios'] as const;

export function useScenarios() {
  return useQuery({
    queryKey: planningScenariosQueryKey,
    queryFn: () => PlanningService.getScenarios(),
  });
}

export function useScenario(id: string | undefined) {
  const query = useQuery({
    queryKey: [...planningScenariosQueryKey, id],
    queryFn: async () => (await PlanningService.getScenario(id as string)) ?? null,
    enabled: !!id,
  });

  return { ...query, data: query.data ?? undefined };
}

export function useCreateScenario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateScenarioInput) => PlanningService.createScenario(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: planningScenariosQueryKey }),
  });
}

export function useUpdateScenario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateScenarioInput }) =>
      PlanningService.updateScenario(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: planningScenariosQueryKey }),
  });
}

export function useDeleteScenario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PlanningService.deleteScenario(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: [...planningScenariosQueryKey, id] });
      queryClient.invalidateQueries({ queryKey: planningScenariosQueryKey });
    },
  });
}

export function useDuplicateScenario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PlanningService.duplicateScenario(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: planningScenariosQueryKey }),
  });
}
