import { useQuery } from '@tanstack/react-query';
import { PaymentMethodService } from '../../core/services/PaymentMethodService';

export const paymentMethodsQueryKey = ['payment-methods'] as const;

export function usePaymentMethods() {
  return useQuery({
    queryKey: paymentMethodsQueryKey,
    queryFn: () => PaymentMethodService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}
