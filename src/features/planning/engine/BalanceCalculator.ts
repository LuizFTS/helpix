import { CashFlow } from '../types';

export type BalanceResult = {
  initialBalance: number;
  totalIncome: number;
  totalExpense: number;
  finalBalance: number;
};

/**
 * Calcula o saldo final de um mês: `saldo inicial + receitas -
 * despesas = saldo final`.
 *
 * Responsabilidade única, deliberadamente simples — não decide de
 * onde vêm `initialBalance`/`cashFlow`, só faz a conta. Quem orquestra
 * o encadeamento entre meses (saldo final de um mês vira saldo
 * inicial do próximo) é o `ProjectionEngine`.
 *
 * Etapa 04: como `CashFlowCalculator` sempre retorna receitas/despesas
 * zeradas, o resultado de todo mês é sempre igual ao saldo inicial
 * informado no cenário — comportamento esperado e documentado nesta
 * etapa (nenhum evento financeiro existe ainda).
 */
export class BalanceCalculator {
  static calculate(initialBalance: number, cashFlow: CashFlow): BalanceResult {
    const finalBalance = initialBalance + cashFlow.income - cashFlow.expense;

    return {
      initialBalance,
      totalIncome: cashFlow.income,
      totalExpense: cashFlow.expense,
      finalBalance,
    };
  }
}
