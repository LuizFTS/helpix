import { useMemo } from 'react';
import { useScenario } from './usePlanningQueries';
import { ProjectionEngine } from '../engine/ProjectionEngine';
import { Scenario, ScenarioProjection } from '../types';

type UseScenarioProjectionResult = {
  scenario: Scenario | undefined;
  projection: ScenarioProjection | undefined;
  isLoading: boolean;
  error: string | undefined;
};

/**
 * Carrega um cenário (via React Query, mesmo padrão de
 * `useTransaction`/`useSavingGoal`) e executa o `ProjectionEngine`
 * sobre ele **em memória** — a projeção nunca é persistida no
 * Firestore e é recalculada toda vez que a tela de detalhe é aberta
 * (`useMemo` recalcula quando o `scenario` muda, não a cada render).
 *
 * Única fonte de erro tratada aqui é "cenário não encontrado" (`id`
 * inválido ou removido por outra sessão) — qualquer erro que o
 * `ProjectionEngine` viesse a lançar (não deveria, ele é
 * determinístico) também é capturado, pra nunca derrubar a tela com
 * uma exceção não tratada.
 */
export function useScenarioProjection(id: string | undefined): UseScenarioProjectionResult {
  const { data: scenario, isLoading, isError } = useScenario(id);

  const { projection, engineError } = useMemo(() => {
    if (!scenario) return { projection: undefined, engineError: undefined };
    try {
      return { projection: ProjectionEngine.generate(scenario), engineError: undefined };
    } catch (err) {
      return { projection: undefined, engineError: 'Não foi possível gerar a projeção.' };
    }
  }, [scenario]);

  const error = isError
    ? 'Não foi possível carregar o cenário.'
    : engineError;

  return { scenario, projection, isLoading, error };
}
