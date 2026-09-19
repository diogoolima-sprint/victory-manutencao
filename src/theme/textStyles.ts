import { TextStyle } from 'react-native';
import { colors, fonts } from './tokens';

// Semantic text roles ported from colors_and_type.css (.t-h1, .t-body, etc.)

export const textStyles: Record<string, TextStyle> = {
  h1: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 28, letterSpacing: -0.3, color: colors.victoryInk },
  h2: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 24, letterSpacing: -0.2, color: colors.victoryInk },
  h3: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 19, letterSpacing: -0.2, color: colors.victoryInk },
  h4: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 16, color: colors.victoryInk },
  h5: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 15, color: colors.victoryInk },
  body: { fontFamily: fonts.sans, fontWeight: '400', fontSize: 16, lineHeight: 23, color: colors.text },
  bodySm: { fontFamily: fonts.sans, fontWeight: '400', fontSize: 14, lineHeight: 20, color: colors.text },
  caption: { fontFamily: fonts.sans, fontWeight: '500', fontSize: 12, color: colors.textMuted },
  label: {
    fontFamily: fonts.sans,
    fontWeight: '600',
    fontSize: 11.5,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  mono: { fontFamily: fonts.mono, fontWeight: '600', fontSize: 13, color: colors.victoryInk },
};
