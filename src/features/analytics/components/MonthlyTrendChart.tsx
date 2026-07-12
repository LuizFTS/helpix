import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../core/theme';
import { MonthlyTrendPoint } from '../types/analytics.types';
import { formatPeriodShort } from '../../../shared/utils/date';

type MonthlyTrendChartProps = {
  points: MonthlyTrendPoint[];
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function MonthlyTrendChart({ points }: MonthlyTrendChartProps) {
  const maxValue = Math.max(1, ...points.flatMap((p) => [p.income, p.expenses]));

  return (
    <View>
      {points.map((point) => (
        <View key={`${point.period.year}-${point.period.month}`} style={styles.row}>
          <Text style={styles.monthLabel}>{formatPeriodShort(point.period)}</Text>

          <View style={styles.barsColumn}>
            <View style={styles.barRow}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${(point.income / maxValue) * 100}%`, backgroundColor: colors.success },
                  ]}
                />
              </View>
              <Text style={styles.barValue}>R$ {currencyFormatter.format(point.income)}</Text>
            </View>

            <View style={styles.barRow}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${(point.expenses / maxValue) * 100}%`, backgroundColor: colors.danger },
                  ]}
                />
              </View>
              <Text style={styles.barValue}>R$ {currencyFormatter.format(point.expenses)}</Text>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendLabel}>Receitas</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
          <Text style={styles.legendLabel}>Despesas</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: spacing.md },
  monthLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 6, letterSpacing: 0.5 },
  barsColumn: { gap: 4 },
  barRow: { flexDirection: 'row', alignItems: 'center' },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  barFill: { height: '100%', borderRadius: 5 },
  barValue: { color: colors.textPrimary, fontSize: 12, fontWeight: '600', width: 76, textAlign: 'right' },
  legendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.md },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendLabel: { color: colors.textSecondary, fontSize: 12 },
});
