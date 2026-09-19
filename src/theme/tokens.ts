import { Platform } from 'react-native';

// Ported from project/_ds/sprint-victory-design-system-.../colors_and_type.css
// Only the tokens actually used by the Victory Manutenção prototype are
// kept here — see that file for the full three-brand system.

export const colors = {
  // Sprint accent — primary action color throughout the app
  coral: '#F25C54',
  coral600: '#DC4A43',
  coral700: '#B53B35',
  coral100: '#FDE7E5',
  coral50: '#FEF4F3',

  ink: '#1F1F1F',
  text: '#4A4A4A',
  textMuted: '#6B6B6B',
  line: '#E5E7EB',
  lineStrong: '#D1D5DB',
  bg: '#FFFFFF',
  bgSoft: '#F9FAFB',
  bgSunken: '#F1F3F5',

  success: '#1F8A5B',
  success100: '#DCF3E6',
  warning: '#C9881A',
  warning100: '#FBEED2',
  danger: '#B53B35',
  danger100: '#FDE0DE',

  // Victory master brand
  victoryInk: '#0A0A0A',
  victoryCharcoal: '#2A2A2A',
  victoryPaper: '#FFFFFF',
  victoryBone: '#F4F1EC',
  victoryStone: '#D9D2C7',
  victoryWarmGray: '#6B655D',

  white: '#FFFFFF',
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const radii = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  '2xl': 28,
  pill: 9999,
} as const;

export const shadows = {
  // React Native (iOS) shadow props — Android uses `elevation` instead;
  // components apply both via the `cardShadow` helper below.
  card: {
    shadowColor: 'rgba(15,23,42,1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  pop: {
    shadowColor: 'rgba(15,23,42,1)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 10,
  },
} as const;

export const fontSizes = {
  12: 12,
  13: 13,
  14: 14,
  15: 15,
  16: 16,
  18: 18,
  20: 20,
  24: 24,
  26: 26,
  28: 28,
  32: 32,
} as const;

// Instrument Sans is a variable font (wght 400-700) — both iOS (Core Text)
// and Android (Skia) interpolate weight from a single loaded family via the
// standard `fontWeight` style prop, so we only need one family name here.
// See src/theme/fonts.ts for the expo-font loading hook.
export const fonts = {
  sans: 'InstrumentSans',
  sansItalic: 'InstrumentSans-Italic',
  // RN has no `ui-monospace` keyword like CSS — pick a real platform family.
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }) as string,
} as const;
