/**
 * Representa o fluxo financeiro de um mês dentro de uma projeção —
 * bloco reutilizável entre `MonthlyProjection` e qualquer cálculo
 * futuro que precise só do "resumo" income/expense/balance sem o
 * resto do contexto do mês (eventos, datas, etc.).
 *
 * Etapa 02 (modelagem): ainda sem implementação — nenhum valor é
 * calculado nesta etapa.
 */
export type CashFlow = {
  income: number;
  expense: number;
  balance: number;
};
