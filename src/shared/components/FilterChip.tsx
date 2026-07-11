import React from 'react';
import { Pressable, Text } from 'react-native';

type FilterChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function FilterChip({ label, active = false, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 border ${
        active ? 'bg-primarySoft border-primary' : 'bg-surface border-border'
      }`}
    >
      <Text className={`text-sm font-semibold ${active ? 'text-primary' : 'text-textSecondary'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
