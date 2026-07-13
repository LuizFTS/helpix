import { Transaction } from '../../transactions/types/transaction.types';
import { PaymentMethod } from '../../../shared/types/paymentMethod.types';
import { Period, isSamePeriod, getPreviousPeriod, getCurrentPeriod } from '../../../shared/utils/date';
import { MonthlyTrendPoint, OverallPaymentMethodBreakdown } from '../types/analytics.types';

function sumByType(transactions: Transaction[], type: 'income' | 'expense'): number {
  return transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0);
}

export function buildMonthlyTrend(transactions: Transaction[], monthsCount = 6): MonthlyTrendPoint[] {
  const points: MonthlyTrendPoint[] = [];
  let period: Period = getCurrentPeriod();

  for (let i = 0; i < monthsCount; i++) {
    const periodTransactions = transactions.filter((t) => isSamePeriod(t.date, period));
    points.unshift({
      period,
      income: sumByType(periodTransactions, 'income'),
      expenses: sumByType(periodTransactions, 'expense'),
    });
    period = getPreviousPeriod(period);
  }

  return points;
}

/**
 * Mesma correção do breakdown do Dashboard: percentual relativo ao
 * total de receitas (métodos de Entrada) ou ao total de despesas
 * (métodos de Saída), considerando TODO o histórico — não um
 * denominador único misturando os dois tipos.
 */
export function buildOverallPaymentMethodBreakdown(
  transactions: Transaction[],
  paymentMethods: PaymentMethod[]
): OverallPaymentMethodBreakdown[] {
  const totalIncome = sumByType(transactions, 'income');
  const totalExpenses = sumByType(transactions, 'expense');

  return paymentMethods
    .map((paymentMethod) => {
      const total = transactions
        .filter((t) => t.paymentMethodId === paymentMethod.id)
        .reduce((sum, t) => sum + t.amount, 0);

      const denominator = paymentMethod.type === 'income' ? totalIncome : totalExpenses;
      const percentage = denominator > 0 ? Math.round((total / denominator) * 100) : 0;

      return { paymentMethod, total, percentage };
    })
    .filter((breakdown) => breakdown.total > 0)
    .sort((a, b) => b.total - a.total);
}
