import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../core/theme';
import { BottomSheet, Input, Button } from '../../../shared/components';
import { useAddContribution } from '../hooks/useSavings';

type AddContributionSheetProps = {
  visible: boolean;
  onClose: () => void;
  savingGoalId: string;
  goalName: string;
};

export function AddContributionSheet({
  visible,
  onClose,
  savingGoalId,
  goalName,
}: AddContributionSheetProps) {
  const [amountText, setAmountText] = useState('');
  const [error, setError] = useState<string | undefined>();
  const addContribution = useAddContribution();

  const handleSave = async () => {
    const amount = parseFloat(amountText.replace(',', '.'));
    if (!amount || amount <= 0) {
      setError('Informe um valor maior que zero');
      return;
    }

    await addContribution.mutateAsync({
      savingGoalId,
      amount,
      date: new Date().toISOString().split('T')[0],
    });

    setAmountText('');
    setError(undefined);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} heightPercent={0.42}>
      <Text style={styles.title}>Novo aporte</Text>
      <Text style={styles.subtitle}>{goalName}</Text>

      <View style={{ height: spacing.md }} />

      <Input
        label="Valor do aporte"
        placeholder="R$ 0,00"
        keyboardType="decimal-pad"
        value={amountText}
        onChangeText={(text) => {
          setAmountText(text);
          if (error) setError(undefined);
        }}
        error={error}
        autoFocus
      />

      <Button label="Salvar aporte" onPress={handleSave} isLoading={addContribution.isPending} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 2 },
});
