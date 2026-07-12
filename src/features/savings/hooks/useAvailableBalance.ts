import { useMemo } from 'react';
import { useTransactions } from '../../transactions/hooks/useTransactions';
import { useSavingGoals } from './useSavings';

/**
 * "Saldo disponível" pra Economias não é o mesmo que o saldo do
 * Dashboard (que é por período) — aqui é o saldo TOTAL acumulado
 * (todas as transações, todos os tempos) MENOS o que já está alocado
 * em outras caixinhas.
 *
 * Contribuir pra uma meta não cria uma transação nova — é só "separar"
 * uma parte do saldo que você já tem. Por isso o total geral não muda,
 * só a divisão entre "livre" e "alocado" muda.
 */
export function useAvailableBalance() {
  const transactionsQuery = useTransactions();
  const goalsQuery = useSavingGoals();

  const totalBalance = useMemo(() => {
    const transactions = transactionsQuery.data ?? [];
    const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return income - expenses;
  }, [transactionsQuery.data]);

  const totalSaved = useMemo(
    () => (goalsQuery.data ?? []).reduce((sum, goal) => sum + goal.currentAmount, 0),
    [goalsQuery.data]
  );

  return {
    totalBalance,
    totalSaved,
    availableBalance: totalBalance - totalSaved,
    isLoading: transactionsQuery.isLoading || goalsQuery.isLoading,
  };
}
