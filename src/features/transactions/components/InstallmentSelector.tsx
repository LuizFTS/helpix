import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../core/theme';
import { FilterChip, Input } from '../../../shared/components';

type InstallmentSelectorProps = {
  isInstallment: boolean;
  installmentTotal?: number;
  onChangeIsInstallment: (value: boolean) => void;
  onChangeTotal: (value: number) => void;
  error?: string;
};

/**
 * Só deve ser renderizado quando o tipo da transação for "Despesa"
 * (regra definida na tela de Nova Movimentação).
 */
export function InstallmentSelector({
  isInstallment,
  installmentTotal,
  onChangeIsInstallment,
  onChangeTotal,
  error,
}: InstallmentSelectorProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>TIPO DE COMPRA</Text>
      <View style={styles.row}>
        <FilterChip label="À vista" active={!isInstallment} onPress={() => onChangeIsInstallment(false)} />
        <FilterChip label="Parcelado" active={isInstallment} onPress={() => onChangeIsInstallment(true)} />
      </View>

      {isInstallment ? (
        <Input
          label="Quantidade de parcelas"
          keyboardType="number-pad"
          placeholder="Ex: 10"
          value={installmentTotal ? String(installmentTotal) : ''}
          onChangeText={(text) => onChangeTotal(parseInt(text, 10) || 0)}
          error={error}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: { color: colors.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: spacing.sm, letterSpacing: 0.5 },
  row: { flexDirection: 'row', marginBottom: spacing.sm },
});
