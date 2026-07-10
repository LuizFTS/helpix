import { PaymentMethod } from '../../../shared/types/paymentMethod.types';
import { Period, isSamePeriod } from '../../../shared/utils/date';
import { Transaction } from '../../transactions/types/transaction.types';
import { DashboardSummary, PaymentMethodBreakdown } from '../types/dashboard.types';

/**
 * Toda a matemática de agregação do Dashboard vive aqui, isolada de UI
 * e de Services — facilita testar isso separadamente no futuro.
 */

export function buildDashboardSummary(
  transactions: Transaction[],
  period: Period,
  previousBalance: number
): DashboardSummary {
  const periodTransactions = transactions.filter((t) => isSamePeriod(t.date, period));
  const income = sumByType(periodTransactions, 'income');
  const expenses = sumByType(periodTransactions, 'expense');

  return {
    income,
    expenses,
    previousBalance,
    balance: previousBalance + income - expenses,
  };
}

export function buildPaymentMethodBreakdown(
  transactions: Transaction[],
  paymentMethods: PaymentMethod[],
  period: Period
): PaymentMethodBreakdown[] {
  const periodTransactions = transactions.filter((t) => isSamePeriod(t.date, period));
  const totalMoved = periodTransactions.reduce((sum, t) => sum + t.amount, 0);

  return paymentMethods
    .map((paymentMethod) => {
      const total = periodTransactions
        .filter((t) => t.paymentMethodId === paymentMethod.id)
        .reduce((sum, t) => sum + t.amount, 0);
      const percentage = totalMoved > 0 ? Math.round((total / totalMoved) * 100) : 0;
      return { paymentMethod, total, percentage };
    })
    .filter((breakdown) => breakdown.total > 0);
}

function sumByType(transactions: Transaction[], type: 'income' | 'expense'): number {
  return transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0);
}
