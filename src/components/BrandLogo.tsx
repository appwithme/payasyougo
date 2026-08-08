import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import BrandMark from './BrandMark';
import { SPACING } from '../theme/colors';
import { type } from '../theme/typography';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  style?: ViewStyle;
  tone?: 'yellow' | 'ink' | 'plain';
};

const SIZES = { sm: 40, md: 72, lg: 96 };

export default function BrandLogo({
  size = 'md',
  showWordmark = false,
  style,
  tone = 'yellow',
}: Props) {
  const dim = SIZES[size];

  return (
    <View style={[styles.wrap, style]}>
      <BrandMark size={dim} tone={tone} />
      {showWordmark ? (
        <View style={styles.wordmark}>
          <Text style={styles.name}>PayAsYouGo</Text>
          <Text style={styles.tag}>UCC Campus Transport</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  wordmark: { alignItems: 'center', marginTop: SPACING.md },
  name: { ...type.heading, fontSize: 28 },
  tag: { ...type.caption, marginTop: 4 },
});
