import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import BrandMark from './BrandMark';
import { COLORS, SPACING } from '../theme/colors';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  style?: ViewStyle;
  /** kept for API compat — squircle is always white like ride inspo */
  tone?: 'yellow' | 'ink' | 'plain';
};

const SIZES = { sm: 40, md: 72, lg: 96 };

export default function BrandLogo({
  size = 'md',
  showWordmark = false,
  style,
}: Props) {
  const dim = SIZES[size];

  return (
    <View style={[styles.wrap, style]}>
      <BrandMark size={dim} variant="squircle" />
      {showWordmark ? (
        <View style={styles.wordmark}>
          <Text style={styles.name}>
            payasyou
            <Text style={styles.go}>go</Text>
          </Text>
          <Text style={styles.tag}>UCC campus transport</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  wordmark: { alignItems: 'center', marginTop: SPACING.md },
  name: {
    fontFamily: 'Sora_700Bold',
    fontSize: 26,
    color: COLORS.ink,
    letterSpacing: -0.8,
    textTransform: 'lowercase',
  },
  go: {
    color: COLORS.primaryDark,
  },
  tag: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
