import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../../core/theme';

type LoadingProps = {
  label?: string;
  fullScreen?: boolean;
};

export function Loading({ label, fullScreen = false }: LoadingProps) {
  return (
    <View style={[styles.base, fullScreen ? styles.fullScreen : styles.inline]}>
      <ActivityIndicator color={colors.primary} size="large" />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  fullScreen: { flex: 1, backgroundColor: colors.background },
  inline: { paddingVertical: 40 },
  label: { color: colors.textSecondary, marginTop: 12, fontSize: 14 },
});
