import { Transaction } from '../../transactions/types/transaction.types';
import { PaymentMethod } from '../../../shared/types/paymentMethod.types';
import { Period, isSamePeriod } from '../../../shared/utils/date';
import { DashboardSummary, PaymentMethodBreakdown } from '../types/dashboard.types';

/**
 * Toda a matemática de agregação do Dashboard vive aqui, isolada de UI
 * e de Services — facilita testar isso separadamente no futuro.
 */

function sumByType(transactions: Transaction[], type: 'income' | 'expense'): number {
  return transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0);
}

function isBeforePeriod(dateISO: string, period: Period): boolean {
  const date = new Date(dateISO);
  const periodStart = new Date(period.year, period.month, 1);
  return date < periodStart;
}

/**
 * Saldo anterior = saldo acumulado de TODAS as transações antes do
 * início do período selecionado (não é mais um valor fixo mockado —
 * agora reflete o histórico real do Firestore, inclusive quando o
 * usuário navega entre meses com as setas de período).
 */
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
