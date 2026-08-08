import React from 'react';
import { View, ViewStyle } from 'react-native';
import CustomBrandMark from './CustomBrandMark';
import { COLORS } from '../theme/colors';

type Props = {
  size?: number;
  style?: ViewStyle;
  variant?: 'pin3d' | 'icon' | 'pin' | 'squircle';
};

export default function BrandMark({ size = 72, style, variant = 'pin3d' }: Props) {
  if (variant === 'pin') {
    const dot = size * 0.22;
    return (
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size * 0.28,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
            gap: size * 0.08,
          },
          style,
        ]}
      >
        <View
          style={{
            width: dot,
            height: dot,
            borderRadius: dot / 2,
            backgroundColor: COLORS.ink,
          }}
        />
        <View
          style={{
            width: size * 0.08,
            height: size * 0.2,
            borderRadius: 2,
            backgroundColor: COLORS.ink,
          }}
        />
        <View
          style={{
            width: dot,
            height: dot,
            borderRadius: 2,
            backgroundColor: COLORS.ink,
            transform: [{ rotate: '45deg' }],
          }}
        />
      </View>
    );
  }

  return <CustomBrandMark size={size} style={style} />;
}
