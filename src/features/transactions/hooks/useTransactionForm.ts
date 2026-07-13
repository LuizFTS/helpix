import { useEffect, useState } from 'react';
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
    // Reavalia a cada mudança de campo depois da primeira tentativa de
    // submit — assim, assim que o usuário escolhe o método de
    // pagamento (por exemplo), o erro some na hora, sem precisar
    // apertar "Salvar" de novo pra limpar a mensagem.
    mode: 'onSubmit',
    reValidateMode: 'onChange',
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
  const [submitError, setSubmitError] = useState<string | undefined>();

  /**
   * Retorna `true` só quando a transação foi de fato criada/atualizada
   * com sucesso. É ISSO que a tela deve usar pra decidir se navega de
   * volta — nunca `formState.errors` lido depois do `await`, porque
   * nesse ponto o `formState` capturado no componente já está
   * desatualizado (o React ainda não re-renderizou com os erros
   * recém-definidos pelo `handleSubmit`). Usar o retorno de
   * `handleSubmit`'s callback evita essa armadilha de closure stale
   * por completo: o `succeeded` só vira `true` dentro do callback
   * "válido", que só roda se a validação passou.
   */
  const submit = async (): Promise<boolean> => {
    setSubmitError(undefined);
    let succeeded = false;

    await form.handleSubmit(async (values) => {
      try {
        if (existing) {
          await updateMutation.mutateAsync({
            id: existing.id,
            description: values.description,
            amount: values.amount,
            date: values.date,
            paymentMethodId: values.paymentMethodId,
            notes: values.notes,
          });
        } else {
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
        }
        succeeded = true;
      } catch (error) {
        // Falha real de gravação (ex: sem internet) — diferente de
        // erro de validação, que nem chega a entrar neste callback.
        setSubmitError('Não foi possível salvar. Verifique sua internet e tente de novo.');
      }
    })();

    return succeeded;
  };

  return {
    form,
    submit,
    submitError,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
}
