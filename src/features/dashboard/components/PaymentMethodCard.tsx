import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import * as Icons from 'lucide-react-native';
import { colors, radius, spacing } from '../../../core/theme';
import { PaymentMethodBreakdown } from '../types/dashboard.types';

type PaymentMethodCardProps = {
  breakdown: PaymentMethodBreakdown;
  active: boolean;
  onPress: () => void;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function PaymentMethodCard({ breakdown, active, onPress }: PaymentMethodCardProps) {
  const { paymentMethod, total, percentage } = breakdown;
  const IconComponent =
    (Icons as Record<string, Icons.LucideIcon>)[paymentMethod.icon] ?? Icons.CreditCard;

  // "Entradas" (e qualquer método do tipo income) representa dinheiro
  // recebido, não gasto — o rótulo precisa refletir isso, em vez de
  // sempre dizer "% de gastos".
  const percentageLabel = paymentMethod.type === 'income' ? 'de recebimentos' : 'de gastos';

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { borderColor: active ? colors.primary : 'transparent' }]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: paymentMethod.color }]}>
        <IconComponent color={colors.white} size={20} />
      </View>

      <Text style={styles.name}>{paymentMethod.name}</Text>
      <Text style={styles.value}>R$ {currencyFormatter.format(Math.abs(total))}</Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.min(Math.abs(percentage), 100)}%` }]} />
      </View>
      <Text style={styles.percentage}>
        {Math.abs(percentage)}% {percentageLabel}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    width: 168,
    borderRadius: radius.md,
    padding: spacing.md,
    marginRight: spacing.sm,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  name: { color: colors.textSecondary, fontSize: 14, marginBottom: 4 },
  value: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: spacing.sm },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  percentage: { color: colors.textSecondary, fontSize: 12 },
});
