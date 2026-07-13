import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Controller } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../src/core/theme';
import { Input, Button, AmountInput, Loading } from '../../../src/shared/components';
import { useScenarioForm } from '../../../src/features/planning/hooks/useScenarioForm';
import {
  useScenario,
  useDeleteScenario,
  useDuplicateScenario,
} from '../../../src/features/planning/hooks/usePlanningQueries';

/**
 * Formulário de edição de cenário.
 *
 * Movido de `app/planning/[id].tsx` (etapa 03) pra
 * `app/planning/[id]/edit.tsx` nesta etapa — a rota `/planning/[id]`
 * agora é a tela de **detalhe/dashboard** (pedida explicitamente por
 * esta etapa), então a edição precisou de um caminho próprio
 * (`/planning/[id]/edit`). Ver decisão registrada no `.md` desta
 * etapa. Nenhuma lógica interna mudou, só a localização do arquivo
 * (e, por consequência, a profundidade dos imports relativos).
 */
export default function EditScenarioScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: scenario, isLoading } = useScenario(id);
  const deleteMutation = useDeleteScenario();
  const duplicateMutation = useDuplicateScenario();

  const { form, submit, submitError, isSubmitting } = useScenarioForm(scenario);
  const { control } = form;

  if (isLoading || !scenario) {
    return <Loading fullScreen label="Carregando cenário..." />;
  }

  const handleSave = async () => {
    const success = await submit();
    if (success) router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir cenário',
      'Deseja realmente excluir este cenário? Esta ação não poderá ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteMutation.mutateAsync(scenario.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleDuplicate = async () => {
    await duplicateMutation.mutateAsync(scenario.id);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {submitError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{submitError}</Text>
          </View>
        ) : null}

        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <Input
              label="Nome"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <Input
              label="Descrição"
              placeholder="Opcional"
              multiline
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              style={{ height: 90, textAlignVertical: 'top', paddingTop: 12 }}
            />
          )}
        />

        <Controller
          control={control}
          name="initialBalance"
          render={({ field, fieldState }) => (
            <AmountInput
              label="Saldo inicial"
              value={field.value}
              onChangeValue={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="projectionMonths"
          render={({ field, fieldState }) => (
            <Input
              label="Meses da projeção"
              keyboardType="number-pad"
              value={field.value ? String(field.value) : ''}
              onChangeText={(text) => field.onChange(parseInt(text, 10) || 0)}
              error={fieldState.error?.message}
            />
          )}
        />

        <Button label="Salvar alterações" onPress={handleSave} isLoading={isSubmitting} />
        <View style={{ height: 12 }} />
        <Button label="Duplicar cenário" variant="secondary" onPress={handleDuplicate} />
        <View style={{ height: 12 }} />
        <Button label="Excluir" variant="danger" onPress={handleDelete} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  errorBanner: {
    backgroundColor: colors.dangerSoft,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  errorBannerText: { color: colors.danger, fontSize: 13, fontWeight: '600', textAlign: 'center' },
});
