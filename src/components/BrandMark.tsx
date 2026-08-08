import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SHADOW } from '../theme/colors';

type Props = {
  size?: number;
  style?: ViewStyle;
  /** white tile like the ride inspo, or bare pin only */
  variant?: 'squircle' | 'pin';
};

/**
 * Ride-inspired brand mark:
 * white squircle tile + amber map pin (our accent instead of red).
 */
export default function BrandMark({ size = 72, style, variant = 'squircle' }: Props) {
  if (variant === 'pin') {
    return <MapPin size={size} style={style} />;
  }

  const radius = size * 0.28;
  const pinSize = size * 0.52;

  return (
    <View
      style={[
        styles.squircle,
        {
          width: size,
          height: size,
          borderRadius: radius,
        },
        SHADOW.md,
        style,
      ]}
    >
      <MapPin size={pinSize} />
    </View>
  );
}

export function MapPin({ size = 40, style }: { size?: number; style?: ViewStyle }) {
  const head = size * 0.72;
  const hole = size * 0.22;

  return (
    <View style={[{ width: size, height: size, alignItems: 'center' }, style]}>
      {/* pin head */}
      <View
        style={{
          width: head,
          height: head,
          borderRadius: head / 2,
          backgroundColor: COLORS.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: hole,
            height: hole,
            borderRadius: hole / 2,
            backgroundColor: COLORS.white,
          }}
        />
      </View>
      {/* pin tip */}
      <View
        style={{
          width: 0,
          height: 0,
          marginTop: -size * 0.06,
          borderLeftWidth: size * 0.18,
          borderRightWidth: size * 0.18,
          borderTopWidth: size * 0.28,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: COLORS.primary,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  squircle: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.06)',
  },
});
