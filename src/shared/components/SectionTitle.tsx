import React from 'react';
import { View, Text, Pressable } from 'react-native';

type SectionTitleProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionTitle({ title, actionLabel, onActionPress }: SectionTitleProps) {
  return (
    <View className="flex-row items-center justify-between px-5 mb-4">
      <Text className="text-textPrimary text-xl font-bold">{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onActionPress} hitSlop={8}>
          <Text className="text-primary text-xs font-bold tracking-wide">
            {actionLabel.toUpperCase()}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
