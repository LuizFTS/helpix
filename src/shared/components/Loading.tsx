import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { colors } from '../../core/theme';

type LoadingProps = {
  label?: string;
  fullScreen?: boolean;
};

export function Loading({ label, fullScreen = false }: LoadingProps) {
  return (
    <View className={`items-center justify-center ${fullScreen ? 'flex-1 bg-background' : 'py-10'}`}>
      <ActivityIndicator color={colors.primary} size="large" />
      {label ? <Text className="text-textSecondary mt-3 text-sm">{label}</Text> : null}
    </View>
  );
}
