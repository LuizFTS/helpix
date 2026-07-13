import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  scenarioFormSchema,
  scenarioFormDefaultValues,
  ScenarioFormValues,
} from '../utils/scenarioSchema';
import { useCreateScenario, useUpdateScenario } from './usePlanningQueries';
import { Scenario } from '../types';

function buildValuesFromExisting(existing: Scenario): ScenarioFormValues {
  return {
    name: existing.name,
    description: existing.description ?? '',
    initialBalance: existing.initialBalance,
    projectionMonths: existing.projectionMonths,
  };
}

/**
 * Encapsula toda a lógica de formulário de cenário (validação,
 * submit) — mesmo padrão de `useTransactionForm`, incluindo a
 * correção de bug já aplicada lá: `submit()` retorna `Promise<boolean>`
 * indicando sucesso real, nunca dependendo de ler `formState` fora do
 * fluxo do próprio `handleSubmit` (isso causava telas que navegavam de
 * volta mesmo com formulário inválido — ver
 * `CONTEXTO-etapa-validacao-transacao.md`).
 *
 * IMPORTANTE: mesmo motivo documentado em `useTransactionForm` — como
 * `existing` vem de uma query assíncrona (Firestore), o `useEffect`
 * abaixo garante que o formulário se preenche assim que o cenário
 * carrega na tela de edição.
 */
export function useScenarioForm(existing?: Scenario) {
  const form = useForm<ScenarioFormValues>({
    resolver: zodResolver(scenarioFormSchema),
    defaultValues: existing ? buildValuesFromExisting(existing) : scenarioFormDefaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (existing) {
      form.reset(buildValuesFromExisting(existing));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.id]);

  const createMutation = useCreateScenario();
  const updateMutation = useUpdateScenario();
  const [submitError, setSubmitError] = useState<string | undefined>();

  const submit = async (): Promise<boolean> => {
    setSubmitError(undefined);
    let succeeded = false;

    await form.handleSubmit(async (values) => {
      try {
        if (existing) {
          await updateMutation.mutateAsync({
            id: existing.id,
            input: {
              name: values.name,
              description: values.description,
              initialBalance: values.initialBalance,
              projectionMonths: values.projectionMonths,
            },
          });
        } else {
          await createMutation.mutateAsync({
            name: values.name,
            description: values.description,
            initialBalance: values.initialBalance,
            projectionMonths: values.projectionMonths,
          });
        }
        succeeded = true;
      } catch (error) {
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
