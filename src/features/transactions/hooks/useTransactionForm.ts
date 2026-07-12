import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  transactionFormSchema,
  transactionFormDefaultValues,
  TransactionFormValues,
} from '../utils/transactionSchema';
import { useCreateTransaction, useUpdateTransaction } from './useTransactions';
import { Transaction } from '../types/transaction.types';

function buildValuesFromExisting(existing: Transaction): TransactionFormValues {
  return {
    type: existing.type,
    description: existing.description,
    amount: existing.amount,
    date: existing.date,
    paymentMethodId: existing.paymentMethodId,
    notes: existing.notes ?? '',
    isInstallment: !!existing.installmentGroupId,
    installmentTotal: existing.installmentTotal,
  };
}

/**
 * Encapsula toda a lógica de formulário (validação, submit, mapeamento
 * para o input do Service) para que as telas fiquem enxutas.
 *
 * IMPORTANTE: `useForm` só aplica `defaultValues` na primeira
 * renderização. Como `existing` vem de uma query assíncrona (Firestore),
 * na tela de edição o hook é chamado antes dos dados chegarem — então
 * sem o `useEffect` abaixo, o formulário ficava permanentemente vazio
 * mesmo depois da transação carregar. O `form.reset()` força a
 * atualização assim que `existing` aparece (ou muda de id).
 */
export function useTransactionForm(existing?: Transaction) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: existing ? buildValuesFromExisting(existing) : transactionFormDefaultValues,
  });

  useEffect(() => {
    if (existing) {
      form.reset(buildValuesFromExisting(existing));
    }
    // Só re-executa quando o ID muda (ou quando passa a existir),
    // não a cada refetch em background do React Query — assim não
    // sobrescreve o que o usuário já estiver digitando.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.id]);

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
