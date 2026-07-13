import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../../../core/theme';

type PaymentMethodTypeToggleProps = {
  value: 'income' | 'expense';
  onChange: (type: 'income' | 'expense') => void;
};

export function PaymentMethodTypeToggle({ value, onChange }: PaymentMethodTypeToggleProps) {
  return (
    <View style={styles.wrapper}>
      <Option
        label="Saída"
        active={value === 'expense'}
        activeColor={colors.danger}
        onPress={() => onChange('expense')}
      />
      <Option
        label="Entrada"
        active={value === 'income'}
        activeColor={colors.success}
        onPress={() => onChange('income')}
      />
    </View>
  );
}

function Option({
  label,
  active,
  activeColor,
  onPress,
}: {
  label: string;
  active: boolean;
  activeColor: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.option, { backgroundColor: active ? activeColor : 'transparent' }]}
    >
      <Text style={[styles.optionLabel, { color: active ? colors.white : colors.textSecondary }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: 4,
    marginBottom: 16,
  },
  option: { flex: 1, paddingVertical: 12, borderRadius: radius.sm - 4, alignItems: 'center' },
  optionLabel: { fontWeight: '600' },
});
