import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING } from '../theme/colors';
import { type } from '../theme/typography';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  style?: ViewStyle;
};

const SIZES = { sm: 40, md: 72, lg: 110 };

export default function BrandLogo({ size = 'md', showWordmark = false, style }: Props) {
  const dim = SIZES[size];

  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.badge, { width: dim, height: dim, borderRadius: dim * 0.28 }]}>
        <Image
          source={require('../../assets/icon.png')}
          style={{ width: dim, height: dim, borderRadius: dim * 0.28 }}
          resizeMode="cover"
        />
      </View>
      {showWordmark && (
        <View style={styles.wordmark}>
          <Text style={styles.name}>PayAsYouGo</Text>
          <Text style={styles.tag}>UCC Campus Transport</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  badge: {
    overflow: 'hidden',
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
  },
  wordmark: { alignItems: 'center', marginTop: SPACING.md },
  name: { ...type.heading, fontSize: 28 },
  tag: { ...type.caption, marginTop: 4 },
});
