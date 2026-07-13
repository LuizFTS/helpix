import {
  useScenarios,
  useCreateScenario,
  useUpdateScenario,
  useDeleteScenario,
  useDuplicateScenario,
} from './usePlanningQueries';
import { CreateScenarioInput, UpdateScenarioInput } from '../types';

/**
 * Hook principal da tela `/planning` (lista de cenários) — a
 * interface pensada nas etapas anteriores (`{ loading, scenarios,
 * createScenario, updateScenario, deleteScenario, duplicateScenario
 * }`) agora é atendida de verdade, com React Query por baixo (ver
 * `usePlanningQueries.ts`, mesmo padrão de `useTransactions.ts`).
 *
 * Este hook é o único ponto de entrada que a UI deve usar pra
 * interagir com cenários na tela de lista — nenhuma tela deve chamar
 * `PlanningService` diretamente. Telas de formulário (criar/editar)
 * usam `useScenarioForm`, que por sua vez também passa pelos hooks de
 * `usePlanningQueries.ts`, nunca pelo Service cru.
 */
export function usePlanning() {
  const scenariosQuery = useScenarios();
  const createMutation = useCreateScenario();
  const updateMutation = useUpdateScenario();
  const deleteMutation = useDeleteScenario();
  const duplicateMutation = useDuplicateScenario();

  const createScenario = async (input: CreateScenarioInput) => {
    await createMutation.mutateAsync(input);
  };

  const updateScenario = async (id: string, input: UpdateScenarioInput) => {
    await updateMutation.mutateAsync({ id, input });
  };

  const deleteScenario = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const duplicateScenario = async (id: string) => {
    await duplicateMutation.mutateAsync(id);
  };

  return {
    scenarios: scenariosQuery.data ?? [],
    loading: scenariosQuery.isLoading,
    createScenario,
    updateScenario,
    deleteScenario,
    duplicateScenario,
  };
}
