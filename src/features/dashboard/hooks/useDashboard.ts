import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useFilterStore } from '../../../core/providers/useFilterStore';
import { usePaymentMethods } from '../../../shared/hooks/usePaymentMethods';
import { isSamePeriod } from '../../../shared/utils/date';
import { useTransactions } from '../../transactions/hooks/useTransactions';
import { DashboardService } from '../services/DashboardService';

/**
 * Hook único consumido pela DashboardScreen. Combina: período/filtro
 * ativo (Zustand), resumo e breakdown por método (Services via React
 * Query) e a lista de movimentações já filtrada — a tela não precisa
 * saber como nada disso é calculado.
 */
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
  };
}
