import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Icons from 'lucide-react-native';
import { colors, radius, spacing } from '../../core/theme';
import { CurrencyText } from './CurrencyText';
import { formatDateShort } from '../utils/date';

export type TransactionItemData = {
  id: string;
  description: string;
  amount: number;
  date: string;
  icon: string;
  paymentMethodName: string;
};

type TransactionItemProps = {
  transaction: TransactionItemData;
  onPress?: (id: string) => void;
  index?: number;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TransactionItem({ transaction, onPress, index = 0 }: TransactionItemProps) {
  const IconComponent = (Icons as Record<string, Icons.LucideIcon>)[transaction.icon] ?? Icons.Circle;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(Math.min(index, 8) * 40).duration(260)}
      onPress={() => onPress?.(transaction.id)}
      onPressIn={() => {
        scale.value = withTiming(0.98, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
      }}
      style={[styles.row, animatedStyle]}
    >
      <View style={styles.iconWrapper}>
        <IconComponent size={20} color={colors.textPrimary} />
      </View>

      <View style={styles.info}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{transaction.paymentMethodName.toUpperCase()}</Text>
          </View>
          <Text style={styles.date}>{formatDateShort(transaction.date)}</Text>
        </View>
      </View>

      <CurrencyText value={transaction.amount} size="sm" showSign />
    </AnimatedPressable>
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: { flex: 1 },
  description: { color: colors.textPrimary, fontSize: 16, fontWeight: '500' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  tag: { backgroundColor: colors.surfaceHighlight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginRight: 8 },
  tagText: { color: colors.textSecondary, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  date: { color: colors.textSecondary, fontSize: 12 },
});
