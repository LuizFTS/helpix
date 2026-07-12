import { Transaction } from '../../transactions/types/transaction.types';
import { PaymentMethod } from '../../../shared/types/paymentMethod.types';
import { Period, isSamePeriod, getPreviousPeriod, getCurrentPeriod } from '../../../shared/utils/date';
import { MonthlyTrendPoint, OverallPaymentMethodBreakdown } from '../types/analytics.types';

function sumByType(transactions: Transaction[], type: 'income' | 'expense'): number {
  return transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Últimos N meses (incluindo o atual), em ordem cronológica (mais
 * antigo primeiro) — bom pra renderizar de cima pra baixo ou da
 * esquerda pra direita num gráfico.
 */
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
 * Breakdown por método de pagamento considerando TODO o histórico
 * (diferente do breakdown do Dashboard, que é só do período
 * selecionado) — dá uma visão geral de "onde o dinheiro se move mais".
 */
export function buildOverallPaymentMethodBreakdown(
  transactions: Transaction[],
  paymentMethods: PaymentMethod[]
): OverallPaymentMethodBreakdown[] {
  const totalMoved = transactions.reduce((sum, t) => sum + t.amount, 0);

  return paymentMethods
    .map((paymentMethod) => {
      const total = transactions
        .filter((t) => t.paymentMethodId === paymentMethod.id)
        .reduce((sum, t) => sum + t.amount, 0);
      const percentage = totalMoved > 0 ? Math.round((total / totalMoved) * 100) : 0;
      return { paymentMethod, total, percentage };
    })
    .filter((breakdown) => breakdown.total > 0)
    .sort((a, b) => b.total - a.total);
}
