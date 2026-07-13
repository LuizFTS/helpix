import React from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Plus } from 'lucide-react-native';
import { colors, shadow } from '../../core/theme';

type FloatingButtonProps = {
  onPress: () => void;
  accessibilityLabel?: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingButton({ onPress, accessibilityLabel = 'Nova movimentação' }: FloatingButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.9, { damping: 12, stiffness: 200 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      }}
      style={[animatedStyle, shadow.floatingButton]}
      className="absolute right-5 bottom-6 w-[60px] h-[60px] rounded-full bg-primary items-center justify-center"
    >
      <Plus color={colors.white} size={28} />
    </AnimatedPressable>
  );
}
