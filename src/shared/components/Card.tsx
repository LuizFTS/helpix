import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadow } from '../../core/theme';

type CardProps = ViewProps & {
  elevated?: boolean;
  highlighted?: boolean;
  children: React.ReactNode;
};

export function Card({ elevated = false, highlighted = false, style, children, ...rest }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: highlighted ? colors.surfaceHighlight : colors.surface,
          borderWidth: highlighted ? 1 : 0,
          borderColor: colors.primary,
        },
        elevated ? shadow.card : undefined,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    padding: spacing.md,
  },
});
