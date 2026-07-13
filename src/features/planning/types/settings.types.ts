/**
 * Configurações que controlam como uma projeção é calculada.
 *
 * Etapa 02 (modelagem): só a forma dos dados — o Projection Engine
 * (etapa futura) é quem vai efetivamente respeitar essas flags.
 */
export type ProjectionSettings = {
  projectionMonths: number;
  currency: string;
  /** Se `true`, a projeção parte também das transações já lançadas no app (feature `transactions`), não só dos eventos do cenário. */
  includeCurrentTransactions: boolean;
  /** Se `true`, a projeção considera as metas de economia existentes (feature `savings`) ao calcular o fluxo de caixa. */
  includeSavingGoals: boolean;
};
