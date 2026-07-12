import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TransactionService } from '../services/TransactionService';
import { CreateTransactionInput, UpdateTransactionInput } from '../types/transaction.types';

export const transactionsQueryKey = ['transactions'] as const;

export function useTransactions() {
  return useQuery({
    queryKey: transactionsQueryKey,
    queryFn: () => TransactionService.getAll(),
  });
}

export function useTransaction(id: string | undefined) {
  const query = useQuery({
    queryKey: [...transactionsQueryKey, id],
    queryFn: async () => (await TransactionService.getById(id as string)) ?? null,
    enabled: !!id,
  });

  return { ...query, data: query.data ?? undefined };
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTransactionInput) => TransactionService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transactionsQueryKey }),
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTransactionInput) => TransactionService.update(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transactionsQueryKey }),
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => TransactionService.remove(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: [...transactionsQueryKey, id] });
      queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
    },
  });
}

/**
 * Exclusão em massa — usada pela seleção múltipla na tela de
 * Atividades (toque longo pra entrar no modo de seleção).
 */
export function useDeleteTransactions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => TransactionService.removeMany(ids),
    onSuccess: (_, ids) => {
      ids.forEach((id) => queryClient.removeQueries({ queryKey: [...transactionsQueryKey, id] }));
      queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
    },
  });
}

export function useDuplicateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => TransactionService.duplicate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transactionsQueryKey }),
  });
}
