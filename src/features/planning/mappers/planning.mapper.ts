import { Scenario, ScenarioSummary } from '../types';

/**
 * Mapper do módulo de Planejamento Financeiro — traduz `Scenario`
 * (documento completo) pra `ScenarioSummary` (usado na listagem),
 * mesmo padrão de `dashboard.mapper.ts` / `saving.mapper.ts`. Usado
 * por `PlanningService.getScenarios()` ao converter os documentos
 * lidos do Firestore.
 */
export function toScenarioSummary(scenario: Scenario): ScenarioSummary {
  return {
    id: scenario.id,
    name: scenario.name,
    description: scenario.description,
    status: scenario.status,
    projectionMonths: scenario.projectionMonths,
    updatedAt: scenario.updatedAt,
  };
}
