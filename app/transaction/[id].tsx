import React, { useMemo } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../../src/core/theme';
import { Input, Button, Loading, DatePickerInput } from '../../src/shared/components';
import { usePaymentMethods } from '../../src/shared/hooks/usePaymentMethods';
import {
  useTransaction,
  useDeleteTransaction,
  useDuplicateTransaction,
} from '../../src/features/transactions/hooks/useTransactions';
import { useTransactionForm } from '../../src/features/transactions/hooks/useTransactionForm';
import { PaymentMethodPicker } from '../../src/features/transactions/components/PaymentMethodPicker';

export default function EditTransactionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: transaction, isLoading } = useTransaction(id);
  const { data: paymentMethods = [] } = usePaymentMethods();
  const deleteMutation = useDeleteTransaction();
  const duplicateMutation = useDuplicateTransaction();

  const { form, submit, isSubmitting } = useTransactionForm(transaction);
  const { control } = form;

  // Mesma regra da tela de criação: o tipo da transação (fixo na
  // edição) determina quais métodos de pagamento fazem sentido.
  const availablePaymentMethods = useMemo(
    () =>
      paymentMethods.filter((pm) =>
        transaction?.type === 'income' ? pm.type === 'income' : pm.type !== 'income'
      ),
    [paymentMethods, transaction?.type]
  );

  if (isLoading || !transaction) {
    return <Loading fullScreen label="Carregando movimentação..." />;
  }

  const handleSave = async () => {
    await submit();
    router.back();
  };

  const handleDelete = () => {
    Alert.alert('Excluir movimentação', 'Tem certeza que deseja excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteMutation.mutateAsync(transaction.id);
          router.back();
        },
      },
    ]);
  };

  const handleDuplicate = async () => {
    await duplicateMutation.mutateAsync(transaction.id);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <Input
              label="Descrição"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="amount"
          render={({ field, fieldState }) => (
            <Input
              label="Valor"
              keyboardType="decimal-pad"
              value={String(field.value)}
              onChangeText={(text) => field.onChange(parseFloat(text.replace(',', '.')) || 0)}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="date"
          render={({ field, fieldState }) => (
            <DatePickerInput
              label="Data"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="paymentMethodId"
          render={({ field, fieldState }) => (
            <PaymentMethodPicker
              paymentMethods={availablePaymentMethods}
              selectedId={field.value}
              onSelect={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <Input
              label="Observações"
              multiline
              value={field.value}
              onChangeText={field.onChange}
              style={{ height: 90, textAlignVertical: 'top', paddingTop: 12 }}
            />
          )}
        />

        <Button label="Salvar alterações" onPress={handleSave} isLoading={isSubmitting} />
        <View style={{ height: 12 }} />
        <Button label="Duplicar" variant="secondary" onPress={handleDuplicate} />
        <View style={{ height: 12 }} />
        <Button label="Excluir" variant="danger" onPress={handleDelete} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
});
