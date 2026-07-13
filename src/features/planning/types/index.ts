/**
 * Barrel de re-export — permite `import { Scenario, ScenarioEvent } from
 * '../types'` em vez de apontar pro arquivo específico. Os arquivos
 * continuam separados por domínio (cenário, eventos, projeção,
 * configurações, fluxo de caixa) pra evitar um único arquivo de tipos
 * gigante, conforme pedido nesta etapa.
 */
export * from './scenario.types';
export * from './cashflow.types';
export * from './events.types';
export * from './projection.types';
export * from './settings.types';
