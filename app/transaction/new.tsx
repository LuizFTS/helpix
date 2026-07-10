import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { colors } from '../../src/core/theme';
import { Input, Button } from '../../src/shared/components';
import { usePaymentMethods } from '../../src/shared/hooks/usePaymentMethods';
import { useTransactionForm } from '../../src/features/transactions/hooks/useTransactionForm';
import { TransactionTypeToggle } from '../../src/features/transactions/components/TransactionTypeToggle';
import { PaymentMethodPicker } from '../../src/features/transactions/components/PaymentMethodPicker';
import { InstallmentSelector } from '../../src/features/transactions/components/InstallmentSelector';

export default function NewTransactionScreen() {
  const router = useRouter();
  const { data: paymentMethods = [] } = usePaymentMethods();
  const { form, submit, isSubmitting } = useTransactionForm();
  const { control, watch, setValue, formState } = form;

  const type = watch('type');
  const isInstallment = watch('isInstallment');

  const onSubmit = async () => {
    await submit();
    if (Object.keys(formState.errors).length > 0) return;
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Controller
          control={control}
          name="type"
          render={({ field }) => <TransactionTypeToggle value={field.value} onChange={field.onChange} />}
        />

        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <Input
              label="Descrição"
              placeholder="Ex: Supermercado"
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
              placeholder="R$ 0,00"
              keyboardType="decimal-pad"
              value={field.value ? String(field.value) : ''}
              onChangeText={(text) => field.onChange(parseFloat(text.replace(',', '.')) || 0)}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="date"
          render={({ field, fieldState }) => (
            <Input
              label="Data"
              placeholder="AAAA-MM-DD"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="paymentMethodId"
          render={({ field, fieldState }) => (
            <PaymentMethodPicker
              paymentMethods={paymentMethods}
              selectedId={field.value}
              onSelect={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        {type === 'expense' ? (
          <InstallmentSelector
            isInstallment={isInstallment}
            installmentTotal={watch('installmentTotal')}
            onChangeIsInstallment={(value) => setValue('isInstallment', value)}
            onChangeTotal={(value) => setValue('installmentTotal', value)}
            error={formState.errors.installmentTotal?.message}
          />
        ) : null}

        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <Input
              label="Observações"
              placeholder="Opcional"
              multiline
              value={field.value}
              onChangeText={field.onChange}
              style={{ height: 90, textAlignVertical: 'top', paddingTop: 12 }}
            />
          )}
        />

        <Button label="Salvar" onPress={onSubmit} isLoading={isSubmitting} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
});
