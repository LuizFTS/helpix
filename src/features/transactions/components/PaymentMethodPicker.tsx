import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../core/theme';
import { PaymentMethod } from '../../../shared/types/paymentMethod.types';
import { FilterChip } from '../../../shared/components';

type PaymentMethodPickerProps = {
  paymentMethods: PaymentMethod[];
  selectedId?: string;
  onSelect: (id: string) => void;
  error?: string;
};

export function PaymentMethodPicker({
  paymentMethods,
  selectedId,
  onSelect,
  error,
}: PaymentMethodPickerProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>MÉTODO DE PAGAMENTO</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {paymentMethods.map((pm) => (
          <FilterChip
            key={pm.id}
            label={pm.name}
            active={selectedId === pm.id}
            onPress={() => onSelect(pm.id)}
          />
        ))}
      </ScrollView>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: { color: colors.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: spacing.sm, letterSpacing: 0.5 },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
});
