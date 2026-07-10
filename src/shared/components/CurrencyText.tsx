import React from 'react';
import { Text, TextStyle } from 'react-native';
import { colors } from '../../core/theme';

type CurrencyTextProps = {
  value: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  colorMode?: 'auto' | 'neutral';
  showSign?: boolean;
  style?: TextStyle;
};

const sizeMap = {
  sm: { symbol: 14, value: 14 },
  md: { symbol: 16, value: 18 },
  lg: { symbol: 22, value: 30 },
  xl: { symbol: 26, value: 40 },
};

const formatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function CurrencyText({
  value,
  size = 'md',
  colorMode = 'auto',
  showSign = false,
  style,
}: CurrencyTextProps) {
  const sizes = sizeMap[size];
  const color =
    colorMode === 'neutral'
      ? colors.textPrimary
      : value > 0
      ? colors.success
      : value < 0
      ? colors.danger
      : colors.textPrimary;

  const sign = showSign ? (value > 0 ? '+ ' : value < 0 ? '- ' : '') : '';

  return (
    <Text style={[{ color }, style]}>
      <Text style={{ fontSize: sizes.symbol, fontWeight: '600' }}>{sign}R$ </Text>
      <Text style={{ fontSize: sizes.value, fontWeight: '700' }}>
        {formatter.format(Math.abs(value))}
      </Text>
    </Text>
  );
}
