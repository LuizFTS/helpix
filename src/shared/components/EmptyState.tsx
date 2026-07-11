import React from 'react';
import { View, Text } from 'react-native';
import { Inbox, LucideIcon } from 'lucide-react-native';
import { colors } from '../../core/theme';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
};

export function EmptyState({ title, description, icon: Icon = Inbox }: EmptyStateProps) {
  return (
    <View className="items-center justify-center px-8 py-14">
      <View className="w-16 h-16 rounded-full bg-surface items-center justify-center mb-4">
        <Icon color={colors.textSecondary} size={28} />
      </View>
      <Text className="text-textPrimary text-base font-semibold text-center">{title}</Text>
      {description ? (
        <Text className="text-textSecondary text-sm text-center mt-2 leading-5">{description}</Text>
      ) : null}
    </View>
  );
}
