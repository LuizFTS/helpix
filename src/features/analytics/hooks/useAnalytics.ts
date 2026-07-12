import { useMemo, useCallback } from 'react';
import { useTransactions } from '../../transactions/hooks/useTransactions';
import { usePaymentMethods } from '../../../shared/hooks/usePaymentMethods';
import { buildMonthlyTrend, buildOverallPaymentMethodBreakdown } from '../mappers/analytics.mapper';

export function useAnalytics() {
  const transactionsQuery = useTransactions();
  const paymentMethodsQuery = usePaymentMethods();

  const transactions = transactionsQuery.data ?? [];
  const paymentMethods = paymentMethodsQuery.data ?? [];

  const monthlyTrend = useMemo(() => buildMonthlyTrend(transactions, 6), [transactions]);
  const overallBreakdown = useMemo(
    () => buildOverallPaymentMethodBreakdown(transactions, paymentMethods),
    [transactions, paymentMethods]
  );

  const totalIncome = useMemo(
    () => transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );
  const totalExpenses = useMemo(
    () => transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const refetch = useCallback(async () => {
    await Promise.all([transactionsQuery.refetch(), paymentMethodsQuery.refetch()]);
  }, [transactionsQuery.refetch, paymentMethodsQuery.refetch]);

  return {
    monthlyTrend,
    overallBreakdown,
    totalIncome,
    totalExpenses,
    totalBalance: totalIncome - totalExpenses,
    isLoading: transactionsQuery.isLoading || paymentMethodsQuery.isLoading,
    refetch,
  };
}
