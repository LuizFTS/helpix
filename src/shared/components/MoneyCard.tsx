import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../core/theme';
import { CurrencyText } from './CurrencyText';
import { PeriodSelector } from './PeriodSelector';
import { Period, formatPeriodUppercase } from '../utils/date';

type MoneyCardProps = {
  greeting: string;
  period: Period;
  balance: number;
  income: number;
  expenses: number;
  previousBalance: number;
  onPreviousPeriod: () => void;
  onNextPeriod: () => void;
};

export function MoneyCard({
  greeting,
  period,
  balance,
  income,
  expenses,
  previousBalance,
  onPreviousPeriod,
  onNextPeriod,
}: MoneyCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.periodLabel}>{formatPeriodUppercase(period)}</Text>
          <Text style={styles.greeting}>{greeting}</Text>
        </View>
        <PeriodSelector period={period} onPrevious={onPreviousPeriod} onNext={onNextPeriod} compact />
      </View>

      <Text style={styles.balanceLabel}>SALDO TOTAL</Text>
      <CurrencyText value={balance} size="xl" colorMode="neutral" />

      <View style={styles.breakdownRow}>
        <View>
          <Text style={styles.breakdownLabel}>Receitas</Text>
          <CurrencyText value={income} size="sm" />
        </View>
        <View>
          <Text style={styles.breakdownLabel}>Despesas</Text>
          <CurrencyText value={-Math.abs(expenses)} size="sm" />
        </View>
        <View>
          <Text style={styles.breakdownLabel}>Saldo Anterior</Text>
          <CurrencyText value={previousBalance} size="sm" colorMode="neutral" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  periodLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  greeting: { color: colors.textPrimary, fontSize: 24, fontWeight: '700', marginTop: 4 },
  balanceLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
  },
  breakdownLabel: { color: colors.textSecondary, fontSize: 13, marginBottom: 4 },
});
