import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../core/theme';
import { BottomSheet, AmountInput, Button } from '../../../shared/components';
import { useAddContribution } from '../hooks/useSavings';
import { useAvailableBalance } from '../hooks/useAvailableBalance';

type AddContributionSheetProps = {
  visible: boolean;
  onClose: () => void;
  savingGoalId: string;
  goalName: string;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function AddContributionSheet({
  visible,
  onClose,
  savingGoalId,
  goalName,
}: AddContributionSheetProps) {
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState<string | undefined>();
  const addContribution = useAddContribution();
  const { availableBalance, isLoading: isLoadingBalance } = useAvailableBalance();

  const handleSave = async () => {
    if (!amount || amount <= 0) {
      setError('Informe um valor maior que zero');
      return;
    }
    if (amount > availableBalance) {
      setError(
        `Você só tem R$ ${currencyFormatter.format(Math.max(availableBalance, 0))} disponível pra alocar`
      );
      return;
    }

    await addContribution.mutateAsync({
      savingGoalId,
      amount,
      date: new Date().toISOString().split('T')[0],
    });

    setAmount(0);
    setError(undefined);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} heightPercent={0.48}>
      <Text style={styles.title}>Novo aporte</Text>
      <Text style={styles.subtitle}>{goalName}</Text>

      <View style={styles.balanceBox}>
        <Text style={styles.balanceLabel}>Saldo disponível pra alocar</Text>
        <Text style={styles.balanceValue}>
          {isLoadingBalance ? '...' : `R$ ${currencyFormatter.format(Math.max(availableBalance, 0))}`}
        </Text>
      </View>

      <View style={{ height: spacing.md }} />

      <AmountInput
        label="Valor do aporte"
        value={amount}
        onChangeValue={(value) => {
          setAmount(value);
          if (error) setError(undefined);
        }}
        error={error}
      />

      <Button
        label="Salvar aporte"
        onPress={handleSave}
        isLoading={addContribution.isPending}
        disabled={isLoadingBalance || availableBalance <= 0}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 2 },
  balanceBox: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  balanceLabel: { color: colors.textSecondary, fontSize: 12 },
  balanceValue: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginTop: 4 },
});
