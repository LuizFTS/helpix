import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../../core/theme';
import { SavingGoalWithProgress } from '../types/saving.types';

type SavingGoalCardProps = {
  goal: SavingGoalWithProgress;
  onPress: () => void;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function SavingGoalCard({ goal, onPress }: SavingGoalCardProps) {
  const isComplete = goal.percentage >= 100;

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{goal.name}</Text>
        {isComplete ? (
          <View style={styles.completeBadge}>
            <Text style={styles.completeBadgeText}>CONCLUÍDA</Text>
          </View>
        ) : (
          <Text style={styles.percentage}>{goal.percentage}%</Text>
        )}
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${goal.percentage}%`, backgroundColor: isComplete ? colors.success : colors.primary },
          ]}
        />
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.currentLabel}>
          R$ {currencyFormatter.format(goal.currentAmount)}{' '}
          <Text style={styles.targetLabel}>de R$ {currencyFormatter.format(goal.targetAmount)}</Text>
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  name: { color: colors.textPrimary, fontSize: 17, fontWeight: '700' },
  percentage: { color: colors.primary, fontSize: 15, fontWeight: '700' },
  completeBadge: {
    backgroundColor: colors.successSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  completeBadgeText: { color: colors.success, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: { height: '100%', borderRadius: 4 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  currentLabel: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  targetLabel: { color: colors.textSecondary, fontWeight: '400' },
});
