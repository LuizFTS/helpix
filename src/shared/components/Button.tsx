import React from 'react';
import { Pressable, Text, ActivityIndicator, PressableProps, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, radius } from '../../core/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
};

const variantStyles: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.primary, text: colors.white },
  secondary: { bg: colors.surface, text: colors.textPrimary, border: colors.border },
  ghost: { bg: 'transparent', text: colors.primary },
  danger: { bg: colors.danger, text: colors.white },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  label,
  variant = 'primary',
  isLoading = false,
  icon,
  fullWidth = true,
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled || isLoading}
      onPressIn={(e) => {
        scale.value = withTiming(0.97, { duration: 100 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withTiming(1, { duration: 150 });
        onPressOut?.(e);
      }}
      style={[
        animatedStyle,
        styles.base,
        {
          backgroundColor: variantStyle.bg,
          borderWidth: variantStyle.border ? 1 : 0,
          borderColor: variantStyle.border,
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined,
        },
      ]}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={variantStyle.text} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={[styles.label, { color: variantStyle.text, marginLeft: icon ? 8 : 0 }]}>
            {label}
          </Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '600' },
});
