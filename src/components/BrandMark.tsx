import React from 'react';
import { Image, View, ViewStyle, ImageStyle, StyleSheet } from 'react-native';

type Props = {
  size?: number;
  style?: ViewStyle;
  /** Kept for call-site compatibility — all variants use the pin-P mark */
  variant?: 'pin3d' | 'icon' | 'pin' | 'squircle';
};

const LOGO = require('../../assets/brand/logo-pin-p.png');

/**
 * App brand mark — custom pin + P logo.
 */
export default function BrandMark({ size = 72, style }: Props) {
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Image
        source={LOGO}
        style={{ width: size, height: size } as ImageStyle}
        resizeMode="contain"
      />
    </View>
  );
}
