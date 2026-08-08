import { TextStyle } from 'react-native';
import { COLORS, FONT_SIZE } from './colors';

export const FONTS = {
  display: 'Sora_700Bold',
  displaySemi: 'Sora_600SemiBold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
};

export const type = {
  hero: {
    fontFamily: FONTS.display,
    fontSize: FONT_SIZE.hero,
    color: COLORS.textPrimary,
    letterSpacing: -1.2,
  } as TextStyle,
  title: {
    fontFamily: FONTS.display,
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textPrimary,
    letterSpacing: -0.8,
  } as TextStyle,
  heading: {
    fontFamily: FONTS.displaySemi,
    fontSize: FONT_SIZE.xl,
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
  } as TextStyle,
  subheading: {
    fontFamily: FONTS.displaySemi,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  } as TextStyle,
  body: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    lineHeight: 24,
  } as TextStyle,
  bodyBold: {
    fontFamily: FONTS.bodyBold,
    fontSize: FONT_SIZE.base,
    color: COLORS.textPrimary,
  } as TextStyle,
  caption: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    lineHeight: 20,
  } as TextStyle,
  label: {
    fontFamily: FONTS.bodyBold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  } as TextStyle,
  button: {
    fontFamily: FONTS.bodyBold,
    fontSize: FONT_SIZE.base,
    letterSpacing: 0.2,
  } as TextStyle,
};
