import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SHADOW } from '../theme/colors';

type Props = {
  size?: number;
  style?: ViewStyle;
  /** app-icon tile or bare pin mark */
  variant?: 'squircle' | 'pin';
};

/**
 * Taxi Rider–inspired mark:
 * amber location pin with a dark taxi silhouette inside.
 */
export default function BrandMark({ size = 72, style, variant = 'pin' }: Props) {
  if (variant === 'squircle') {
    const radius = size * 0.28;
    return (
      <View
        style={[
          styles.squircle,
          {
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: '#2A2F36',
          },
          SHADOW.md,
          style,
        ]}
      >
        <MapPin size={size * 0.62} />
      </View>
    );
  }

  return <MapPin size={size} style={style} />;
}

export function MapPin({ size = 88, style }: { size?: number; style?: ViewStyle }) {
  const head = size * 0.78;
  const tipH = size * 0.28;
  const tipW = size * 0.22;

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
          ...SHADOW.sm,
        }}
      >
        {/* taxi silhouette */}
        <TaxiGlyph size={head * 0.48} />
      </View>

      {/* pin tip */}
      <View
        style={{
          width: 0,
          height: 0,
          marginTop: -size * 0.04,
          borderLeftWidth: tipW,
          borderRightWidth: tipW,
          borderTopWidth: tipH,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: COLORS.primary,
        }}
      />
    </View>
  );
}

function TaxiGlyph({ size }: { size: number }) {
  const bodyH = size * 0.42;
  const cabinH = size * 0.28;
  const wheel = size * 0.16;

  return (
    <View style={{ width: size, height: size * 0.72, alignItems: 'center', justifyContent: 'flex-end' }}>
      {/* cabin */}
      <View
        style={{
          width: size * 0.55,
          height: cabinH,
          backgroundColor: COLORS.ink,
          borderTopLeftRadius: size * 0.12,
          borderTopRightRadius: size * 0.12,
          marginBottom: -1,
        }}
      />
      {/* body */}
      <View
        style={{
          width: size,
          height: bodyH,
          backgroundColor: COLORS.ink,
          borderRadius: size * 0.1,
          justifyContent: 'flex-end',
          paddingBottom: size * 0.04,
        }}
      >
        {/* roof light */}
        <View
          style={{
            position: 'absolute',
            top: -size * 0.08,
            alignSelf: 'center',
            width: size * 0.22,
            height: size * 0.1,
            borderRadius: 2,
            backgroundColor: COLORS.ink,
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: size * 0.12 }}>
          <View
            style={{
              width: wheel,
              height: wheel,
              borderRadius: wheel / 2,
              backgroundColor: COLORS.primary,
              borderWidth: 2,
              borderColor: COLORS.ink,
            }}
          />
          <View
            style={{
              width: wheel,
              height: wheel,
              borderRadius: wheel / 2,
              backgroundColor: COLORS.primary,
              borderWidth: 2,
              borderColor: COLORS.ink,
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  squircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
