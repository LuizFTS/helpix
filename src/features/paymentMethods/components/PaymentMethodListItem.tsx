import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Icons from 'lucide-react-native';
import { Trash2 } from 'lucide-react-native';
import { colors, radius, spacing } from '../../../core/theme';
import { PaymentMethod } from '../../../shared/types/paymentMethod.types';

type PaymentMethodListItemProps = {
  paymentMethod: PaymentMethod;
  onDelete: () => void;
};

export function PaymentMethodListItem({ paymentMethod, onDelete }: PaymentMethodListItemProps) {
  const IconComponent =
    (Icons as Record<string, Icons.LucideIcon>)[paymentMethod.icon] ?? Icons.CreditCard;
  const isIncome = paymentMethod.type === 'income';

  return (
    <View style={styles.row}>
      <View style={[styles.iconWrapper, { backgroundColor: paymentMethod.color }]}>
        <IconComponent size={18} color={colors.white} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{paymentMethod.name}</Text>
        <View style={[styles.badge, { backgroundColor: isIncome ? colors.successSoft : colors.dangerSoft }]}>
          <Text style={[styles.badgeText, { color: isIncome ? colors.success : colors.danger }]}>
            {isIncome ? 'ENTRADA' : 'SAÍDA'}
          </Text>
        </View>
      </View>

      <Pressable onPress={onDelete} hitSlop={10} style={styles.deleteButton}>
        <Trash2 size={18} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  info: { flex: 1 },
  name: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  deleteButton: { padding: 6 },
});
