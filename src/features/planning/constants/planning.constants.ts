/**
 * Constantes do módulo de Planejamento Financeiro.
 *
 * Etapa 01 (fundação): valores que já sabemos que existirão (limites
 * de horizonte de projeção), pra não ficar mágico/hardcoded quando a
 * lógica de simulação for implementada nas próximas etapas.
 */

/** Horizonte padrão sugerido ao criar um novo cenário. */
export const DEFAULT_PROJECTION_MONTHS = 24;

/** Menor horizonte de projeção permitido. */
export const MIN_PROJECTION_MONTHS = 1;

/** Maior horizonte de projeção permitido (10 anos). */
export const MAX_PROJECTION_MONTHS = 120;
