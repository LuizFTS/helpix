import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../../../core/theme';
import { TransactionType } from '../types/transaction.types';

type TransactionTypeToggleProps = {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
};

export function TransactionTypeToggle({ value, onChange }: TransactionTypeToggleProps) {
  return (
    <View style={styles.wrapper}>
      <ToggleOption
        label="Despesa"
        active={value === 'expense'}
        activeColor={colors.danger}
        onPress={() => onChange('expense')}
      />
      <ToggleOption
        label="Receita"
        active={value === 'income'}
        activeColor={colors.success}
        onPress={() => onChange('income')}
      />
    </View>
  );
}

function ToggleOption({
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
    marginBottom: 20,
  },
  option: { flex: 1, paddingVertical: 12, borderRadius: radius.sm - 4, alignItems: 'center' },
  optionLabel: { fontWeight: '600' },
});
