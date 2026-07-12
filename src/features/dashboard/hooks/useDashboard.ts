import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '../services/DashboardService';
import { useTransactions } from '../../transactions/hooks/useTransactions';
import { usePaymentMethods } from '../../../shared/hooks/usePaymentMethods';
import { useFilterStore } from '../../../core/providers/useFilterStore';
import { isSamePeriod } from '../../../shared/utils/date';

export function useDashboard() {
  const period = useFilterStore((state) => state.period);
  const activePaymentMethodIds = useFilterStore((state) => state.activePaymentMethodIds);
  const goToPreviousPeriod = useFilterStore((state) => state.goToPreviousPeriod);
  const goToNextPeriod = useFilterStore((state) => state.goToNextPeriod);
  const togglePaymentMethodFilter = useFilterStore((state) => state.togglePaymentMethodFilter);

  const summaryQuery = useQuery({
    queryKey: ['dashboard-summary', period],
    queryFn: () => DashboardService.getSummary(period),
  });

  const breakdownQuery = useQuery({
    queryKey: ['dashboard-breakdown', period],
    queryFn: () => DashboardService.getPaymentMethodBreakdown(period),
  });

  const transactionsQuery = useTransactions();
  const paymentMethodsQuery = usePaymentMethods();

  const filteredTransactions = useMemo(() => {
    const all = transactionsQuery.data ?? [];
    return all
      .filter((t) => isSamePeriod(t.date, period))
      .filter((t) =>
        activePaymentMethodIds.length > 0
          ? activePaymentMethodIds.includes(t.paymentMethodId)
          : true
      );
  }, [transactionsQuery.data, period, activePaymentMethodIds]);

  const paymentMethodsById = useMemo(() => {
    const map = new Map<string, string>();
    (paymentMethodsQuery.data ?? []).forEach((pm) => map.set(pm.id, pm.name));
    return map;
  }, [paymentMethodsQuery.data]);

  const isLoading =
    summaryQuery.isLoading || breakdownQuery.isLoading || transactionsQuery.isLoading;

  /**
   * Refetch combinado (resumo, breakdown, transações e métodos de
   * pagamento) — usado pelo pull-to-refresh do Dashboard.
   */
  const refetch = useCallback(async () => {
    await Promise.all([
      summaryQuery.refetch(),
      breakdownQuery.refetch(),
      transactionsQuery.refetch(),
      paymentMethodsQuery.refetch(),
    ]);
  }, [summaryQuery.refetch, breakdownQuery.refetch, transactionsQuery.refetch, paymentMethodsQuery.refetch]);

  return {
    period,
    goToPreviousPeriod,
    goToNextPeriod,
    summary: summaryQuery.data,
    breakdown: breakdownQuery.data ?? [],
    activePaymentMethodIds,
    togglePaymentMethodFilter,
    filteredTransactions,
    paymentMethodsById,
    isLoading,
    refetch,
  };
}
