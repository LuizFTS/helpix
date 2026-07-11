import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { colors } from '../../core/theme';

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  rightElement?: React.ReactNode;
};

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ label, error, rightElement, style, ...rest }, ref) => {
    return (
      <View className="mb-4">
        <Text className="text-textSecondary text-xs font-semibold mb-2 tracking-wide">
          {label.toUpperCase()}
        </Text>
        <View
          className={`bg-surface border rounded-sm flex-row items-center px-4 ${
            error ? 'border-danger' : 'border-border'
          }`}
        >
          <TextInput
            ref={ref}
            placeholderTextColor={colors.textTertiary}
            style={[{ color: colors.textPrimary, flex: 1, height: 52, fontSize: 16 }, style]}
            {...rest}
          />
          {rightElement}
        </View>
        {error ? <Text className="text-danger text-xs mt-1">{error}</Text> : null}
      </View>
    );
  }
);

Input.displayName = 'Input';
