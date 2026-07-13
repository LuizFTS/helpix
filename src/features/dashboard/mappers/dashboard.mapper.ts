import { Transaction } from '../../transactions/types/transaction.types';
import { PaymentMethod } from '../../../shared/types/paymentMethod.types';
import { Period, isSamePeriod } from '../../../shared/utils/date';
import { DashboardSummary, PaymentMethodBreakdown } from '../types/dashboard.types';

function sumByType(transactions: Transaction[], type: 'income' | 'expense'): number {
  return transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0);
}

function isBeforePeriod(dateISO: string, period: Period): boolean {
  const date = new Date(dateISO);
  const periodStart = new Date(period.year, period.month, 1);
  return date < periodStart;
}

function computePreviousBalance(transactions: Transaction[], period: Period): number {
  const priorTransactions = transactions.filter((t) => isBeforePeriod(t.date, period));
  const income = sumByType(priorTransactions, 'income');
  const expenses = sumByType(priorTransactions, 'expense');
  return income - expenses;
}

export function buildDashboardSummary(transactions: Transaction[], period: Period): DashboardSummary {
  const periodTransactions = transactions.filter((t) => isSamePeriod(t.date, period));
  const income = sumByType(periodTransactions, 'income');
  const expenses = sumByType(periodTransactions, 'expense');
  const previousBalance = computePreviousBalance(transactions, period);

  return {
    income,
    expenses,
    previousBalance,
    balance: previousBalance + income - expenses,
  };
}

/**
 * Percentual de cada método é relativo ao total DO MESMO TIPO no
 * período — não ao total geral movimentado. Um método de "Entrada"
 * (ex: Entradas/Recebimentos) mostra sua fatia do total de RECEITAS;
 * um método de "Saída" (Nubank, PIX, etc.) mostra sua fatia do total
 * de DESPESAS. Misturar os dois num único denominador (como era antes)
 * produzia percentuais sem sentido — ex: um método de receita único
 * apareceria como "100% de gastos".
 */
export function buildPaymentMethodBreakdown(
  transactions: Transaction[],
  paymentMethods: PaymentMethod[],
  period: Period
): PaymentMethodBreakdown[] {
  const periodTransactions = transactions.filter((t) => isSamePeriod(t.date, period));
  const totalIncome = sumByType(periodTransactions, 'income');
  const totalExpenses = sumByType(periodTransactions, 'expense');

  return paymentMethods
    .map((paymentMethod) => {
      const relevantTransactions = periodTransactions.filter(
        (t) => t.paymentMethodId === paymentMethod.id
      );
      const total = relevantTransactions.reduce((sum, t) => sum + t.amount, 0);

      const denominator = paymentMethod.type === 'income' ? totalIncome : totalExpenses;
      const percentage = denominator > 0 ? Math.round((total / denominator) * 100) : 0;

      return { paymentMethod, total, percentage };
    })
    .filter((breakdown) => breakdown.total > 0);
}
