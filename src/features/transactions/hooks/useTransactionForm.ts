import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  transactionFormSchema,
  transactionFormDefaultValues,
  TransactionFormValues,
} from '../utils/transactionSchema';
import { useCreateTransaction, useUpdateTransaction } from './useTransactions';
import { Transaction } from '../types/transaction.types';

/**
 * Encapsula toda a lógica de formulário (validação, submit, mapeamento
 * para o input do Service) para que as telas fiquem enxutas — apenas
 * orquestram UI e delegam a este hook.
 */
export function useTransactionForm(existing?: Transaction) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: existing
      ? {
          type: existing.type,
          description: existing.description,
          amount: existing.amount,
          date: existing.date,
          paymentMethodId: existing.paymentMethodId,
          notes: existing.notes ?? '',
          isInstallment: !!existing.installmentGroupId,
          installmentTotal: existing.installmentTotal,
        }
      : transactionFormDefaultValues,
  });

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  const submit = form.handleSubmit(async (values) => {
    if (existing) {
      await updateMutation.mutateAsync({
        id: existing.id,
        description: values.description,
        amount: values.amount,
        date: values.date,
        paymentMethodId: values.paymentMethodId,
        notes: values.notes,
      });
      return;
    }

    await createMutation.mutateAsync({
      type: values.type,
      description: values.description,
      amount: values.amount,
      date: values.date,
      paymentMethodId: values.paymentMethodId,
      notes: values.notes,
      installments: {
        isInstallment: values.isInstallment,
        total: values.installmentTotal,
      },
    });
  });

  return {
    form,
    submit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
}
