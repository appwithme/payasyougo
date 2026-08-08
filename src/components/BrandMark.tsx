import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { COLORS, SHADOW } from '../theme/colors';

type Props = {
  size?: number;
  style?: ViewStyle;
  /**
   * `pin3d` — glossy 3D splash/hero mark (default)
   * `icon` — App Store tile with pin
   * `pin` — lightweight flat pin for small UI chrome
   */
  variant?: 'pin3d' | 'icon' | 'pin' | 'squircle';
};

const LOGO_3D = require('../../assets/brand/logo-3d-pin-v2.png');
const LOGO_ICON = require('../../assets/brand/logo-3d-icon.png');

/**
 * Brand mark — modern glossy 3D pin for splash/hero,
 * flat geometric pin for small UI.
 */
export default function BrandMark({ size = 72, style, variant = 'pin3d' }: Props) {
  if (variant === 'pin3d') {
    return (
      <View style={[{ width: size, height: size }, style]}>
        <Image source={LOGO_3D} style={styles.fill as ImageStyle} resizeMode="contain" />
      </View>
    );
  }

  if (variant === 'icon' || variant === 'squircle') {
    return (
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size * 0.22,
            overflow: 'hidden',
          },
          style,
        ]}
      >
        <Image source={LOGO_ICON} style={styles.fill as ImageStyle} resizeMode="cover" />
      </View>
    );
  }

  return <MapPin size={size} style={style} />;
}

/** Flat pin for tiny UI (tabs, chips) — keep lightweight */
export function MapPin({ size = 40, style }: { size?: number; style?: ViewStyle }) {
  const head = size * 0.72;
  const hole = size * 0.22;

  return (
    <View style={[{ width: size, height: size, alignItems: 'center' }, style]}>
      <View
        style={{
          width: head,
          height: head,
          borderRadius: head / 2,
          backgroundColor: COLORS.primary,
          alignItems: 'center',
          justifyContent: 'center',
          ...SHADOW.sm,
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
  fill: {
    width: '100%',
    height: '100%',
  },
});
