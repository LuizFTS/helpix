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
  return useQuery({
    queryKey: [...transactionsQueryKey, id],
    queryFn: () => TransactionService.getById(id as string),
    enabled: !!id,
  });
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transactionsQueryKey }),
  });
}

export function useDuplicateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => TransactionService.duplicate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transactionsQueryKey }),
  });
}
