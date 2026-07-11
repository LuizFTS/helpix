import React from 'react';
import { Pressable, Text, ActivityIndicator, PressableProps, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../../core/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary: { bg: 'bg-primary', text: 'text-white' },
  secondary: { bg: 'bg-surface', text: 'text-textPrimary', border: 'border border-border' },
  ghost: { bg: 'bg-transparent', text: 'text-primary' },
  danger: { bg: 'bg-danger', text: 'text-white' },
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
  const variantClass = variantClasses[variant];
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
      style={animatedStyle}
      className={`h-14 rounded-sm items-center justify-center px-6 ${variantClass.bg} ${
        variantClass.border ?? ''
      } ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50' : 'opacity-100'}`}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.textPrimary : colors.white} />
      ) : (
        <View className="flex-row items-center">
          {icon}
          <Text className={`text-base font-semibold ${variantClass.text} ${icon ? 'ml-2' : ''}`}>
            {label}
          </Text>
        </View>
      )}
    </AnimatedPressable>
  );
}
