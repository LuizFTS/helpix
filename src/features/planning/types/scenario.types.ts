/**
 * Modelo do Cenário — a unidade principal do módulo de Planejamento
 * Financeiro. Representa uma simulação financeira completa (ex:
 * "Comprar carro em 2027").
 *
 * Etapa 02 (modelagem): só a forma dos dados. Nenhum cálculo, nenhuma
 * integração com Firestore — isso é escopo de etapas futuras
 * (Projection Engine e persistência).
 */

export type ScenarioStatus = 'draft' | 'active' | 'archived';

export type Scenario = {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: ScenarioStatus;
  /** Quantos meses o cenário projeta pra frente. Ver `planning.constants.ts` para limites. */
  projectionMonths: number;
  /** Saldo de partida usado como base da projeção (mês 0). */
  initialBalance: number;
  createdAt: string;
  updatedAt: string;
};

/**
 * Versão resumida do `Scenario`, pensada pra listagem (tela
 * `/planning`) sem precisar carregar o cenário inteiro (nem, no
 * futuro, a projeção calculada). Ainda sem nenhum indicador
 * financeiro de propósito — isso é responsabilidade de uma etapa
 * futura, quando o Projection Engine existir.
 */
export type ScenarioSummary = {
  id: string;
  name: string;
  description?: string;
  status: ScenarioStatus;
  projectionMonths: number;
  updatedAt: string;
};

/**
 * Input pra criação de um cenário. Deliberadamente não inclui
 * `id`/`userId`/`createdAt`/`updatedAt`/`status` — esses são
 * responsabilidade do Service no momento da gravação (mesmo padrão
 * de `CreatePaymentMethodInput`, que também omite campos gerados
 * pelo backend).
 */
export type CreateScenarioInput = {
  name: string;
  description?: string;
  projectionMonths: number;
  initialBalance: number;
};

/**
 * Input pra atualização — todos os campos editáveis são opcionais
 * (atualização parcial), mesmo padrão de "PATCH" já implícito nos
 * outros Services do projeto (ex: `TransactionService.update`).
 */
export type UpdateScenarioInput = Partial<
  Pick<Scenario, 'name' | 'description' | 'projectionMonths' | 'initialBalance' | 'status'>
>;
