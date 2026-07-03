import { Platform } from 'react-native';

export const palette = {
  white: '#FFFFFF',
  black: '#0B0B0B',
  gray50: '#F7F6F4',
  gray100: '#F1EFEC',
  gray200: '#E5E2DD',
  gray400: '#A8A49D',
  gray500: '#7C7873',
  gray700: '#4A4743',
  gray900: '#171614',
  ink: '#0B0B0B',
  star: '#111111',
  danger: '#C0392B',
  dangerDark: '#E07B6E',
} as const;

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textSecondary: string;
  textInverse: string;
  border: string;
  accent: string;
  onAccent: string;
  danger: string;
  skeleton: string;
}

export const lightColors: ThemeColors = {
  background: palette.white,
  surface: palette.gray50,
  surfaceMuted: palette.gray100,
  text: palette.gray900,
  textSecondary: palette.gray500,
  textInverse: palette.white,
  border: palette.gray200,
  accent: palette.black,
  onAccent: palette.white,
  danger: palette.danger,
  skeleton: palette.gray200,
};

export const darkColors: ThemeColors = {
  background: '#121110',
  surface: '#1D1B19',
  surfaceMuted: '#262421',
  text: '#F5F3F0',
  textSecondary: '#A8A49D',
  textInverse: palette.gray900,
  border: '#33302C',
  accent: '#F5F3F0',
  onAccent: '#121110',
  danger: palette.dangerDark,
  skeleton: '#2E2B28',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

/**
 * The reference design uses a serif display face for headings.
 * System serifs keep the look without shipping font assets.
 */
export const fonts = {
  display: Platform.select({ ios: 'Georgia', default: 'serif' }),
  body: undefined, // platform default (San Francisco / Roboto)
} as const;

export const typography = {
  display: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34 },
  title: { fontFamily: fonts.display, fontSize: 22, lineHeight: 28 },
  cardTitle: { fontFamily: fonts.display, fontSize: 16, lineHeight: 21 },
  body: { fontSize: 15, lineHeight: 22 },
  caption: { fontSize: 13, lineHeight: 18 },
  price: { fontSize: 17, fontWeight: '700' as const },
} as const;
