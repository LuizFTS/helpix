import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Icons from 'lucide-react-native';
import { colors, radius, spacing } from '../../../core/theme';
import { OverallPaymentMethodBreakdown } from '../types/analytics.types';

type OverallBreakdownRowProps = {
  breakdown: OverallPaymentMethodBreakdown;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function OverallBreakdownRow({ breakdown }: OverallBreakdownRowProps) {
  const { paymentMethod, total, percentage } = breakdown;
  const IconComponent =
    (Icons as Record<string, Icons.LucideIcon>)[paymentMethod.icon] ?? Icons.CreditCard;

  return (
    <View style={styles.row}>
      <View style={[styles.iconWrapper, { backgroundColor: paymentMethod.color }]}>
        <IconComponent size={18} color={colors.white} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{paymentMethod.name}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.min(percentage, 100)}%` }]} />
        </View>
      </View>

      <View style={styles.valueColumn}>
        <Text style={styles.value}>R$ {currencyFormatter.format(total)}</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: { flex: 1, marginRight: spacing.md },
  name: { color: colors.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 6 },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: colors.primary },
  valueColumn: { alignItems: 'flex-end' },
  value: { color: colors.textPrimary, fontSize: 13, fontWeight: '700' },
  percentage: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
});
