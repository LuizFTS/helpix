import React from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../core/theme';

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  rightElement?: React.ReactNode;
};

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ label, error, rightElement, style, ...rest }, ref) => {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        <View
          style={[
            styles.inputRow,
            { borderColor: error ? colors.danger : colors.border },
          ]}
        >
          <TextInput
            ref={ref}
            placeholderTextColor={colors.textTertiary}
            style={[styles.input, style]}
            {...rest}
          />
          {rightElement}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  inputRow: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  input: { color: colors.textPrimary, flex: 1, height: 52, fontSize: 16 },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
});
