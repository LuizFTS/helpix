import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors, radius } from '../../core/theme';
import { Period, formatPeriodShort } from '../utils/date';

type PeriodSelectorProps = {
  period: Period;
  onPrevious: () => void;
  onNext: () => void;
  compact?: boolean;
};

export function PeriodSelector({ period, onPrevious, onNext, compact = false }: PeriodSelectorProps) {
  if (compact) {
    return (
      <View style={styles.pill}>
        <Calendar size={14} color={colors.textPrimary} />
        <Text style={styles.pillText}>{formatPeriodShort(period)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <Pressable onPress={onPrevious} hitSlop={10} style={styles.arrow}>
        <ChevronLeft size={20} color={colors.textSecondary} />
      </Pressable>
      <Text style={styles.label}>{formatPeriodShort(period)}</Text>
      <Pressable onPress={onNext} hitSlop={10} style={styles.arrow}>
        <ChevronRight size={20} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  pillText: { color: colors.textPrimary, fontSize: 12, fontWeight: '600', marginLeft: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  arrow: { padding: 8 },
  label: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
});
