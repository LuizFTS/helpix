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
      <View style={styles.compactRow}>
        <Pressable onPress={onPrevious} hitSlop={10} style={styles.compactArrow}>
          <ChevronLeft size={16} color={colors.textSecondary} />
        </Pressable>

        <View style={styles.pill}>
          <Calendar size={14} color={colors.textPrimary} />
          <Text style={styles.pillText}>{formatPeriodShort(period)}</Text>
        </View>

        <Pressable onPress={onNext} hitSlop={10} style={styles.compactArrow}>
          <ChevronRight size={16} color={colors.textSecondary} />
        </Pressable>
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
  compactRow: { flexDirection: 'row', alignItems: 'center' },
  compactArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    marginHorizontal: 6,
  },
  pillText: { color: colors.textPrimary, fontSize: 12, fontWeight: '600', marginLeft: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  arrow: { padding: 8 },
  label: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
});
