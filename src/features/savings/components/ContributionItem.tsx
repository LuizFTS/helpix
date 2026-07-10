import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import { colors, radius, spacing } from '../../../core/theme';
import { CurrencyText } from '../../../shared/components';
import { formatDateShort } from '../../../shared/utils/date';
import { SavingContribution } from '../types/saving.types';

type ContributionItemProps = {
  contribution: SavingContribution;
};

export function ContributionItem({ contribution }: ContributionItemProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrapper}>
        <TrendingUp size={18} color={colors.success} />
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Aporte</Text>
        <Text style={styles.date}>{formatDateShort(contribution.date)}</Text>
      </View>
      <CurrencyText value={contribution.amount} size="sm" showSign />
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
    borderRadius: 20,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: { flex: 1 },
  label: { color: colors.textPrimary, fontSize: 15, fontWeight: '500' },
  date: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
});
