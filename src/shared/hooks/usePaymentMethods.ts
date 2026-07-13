import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PaymentMethodService } from '../../core/services/PaymentMethodService';
import { CreatePaymentMethodInput } from '../types/paymentMethod.types';

export const paymentMethodsQueryKey = ['payment-methods'] as const;

export function usePaymentMethods() {
  return useQuery({
    queryKey: paymentMethodsQueryKey,
    queryFn: () => PaymentMethodService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreatePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePaymentMethodInput) => PaymentMethodService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: paymentMethodsQueryKey }),
  });
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PaymentMethodService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: paymentMethodsQueryKey }),
  });
}
