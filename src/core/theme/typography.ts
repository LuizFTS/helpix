import { TextStyle } from 'react-native';

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34,
} as const;

export const fontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

export const typography: Record<string, TextStyle> = {
  displayLarge: { fontSize: fontSize.display, fontWeight: fontWeight.bold },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.semibold },
  subtitle: { fontSize: fontSize.lg, fontWeight: fontWeight.medium },
  body: { fontSize: fontSize.md, fontWeight: fontWeight.regular },
  bodyStrong: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  caption: { fontSize: fontSize.sm, fontWeight: fontWeight.regular },
  overline: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
};
