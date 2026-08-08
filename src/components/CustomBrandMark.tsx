import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOW } from '../theme/colors';

type Props = {
  size?: number;
  style?: ViewStyle;
};

/**
 * Hand-crafted brand mark — no AI bitmaps.
 * Amber pin with soft gradient depth + charcoal taxi glyph.
 */
export default function CustomBrandMark({ size = 120, style }: Props) {
  const head = size * 0.78;
  const tipW = size * 0.2;
  const tipH = size * 0.26;
  const glyph = head * 0.42;

  return (
    <View style={[{ width: size, height: size * 1.08, alignItems: 'center' }, style]}>
      {/* soft ground glow */}
      <View
        style={{
          position: 'absolute',
          bottom: size * 0.02,
          width: size * 0.45,
          height: size * 0.1,
          borderRadius: 99,
          backgroundColor: 'rgba(27,43,75,0.1)',
        }}
      />

      {/* pin head */}
      <View
        style={{
          width: head,
          height: head,
          borderRadius: head / 2,
          overflow: 'hidden',
          ...SHADOW.md,
        }}
      >
        <LinearGradient
          colors={['#FFE566', '#F5B800', '#E09A00']}
          locations={[0, 0.45, 1]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* top specular */}
        <LinearGradient
          colors={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0)']}
          start={{ x: 0.3, y: 0 }}
          end={{ x: 0.5, y: 0.55 }}
          style={{
            position: 'absolute',
            top: 0,
            left: head * 0.12,
            width: head * 0.55,
            height: head * 0.45,
            borderBottomRightRadius: head,
          }}
        />
        {/* inner disc */}
        <View
          style={{
            position: 'absolute',
            top: head * 0.18,
            left: head * 0.18,
            width: head * 0.64,
            height: head * 0.64,
            borderRadius: head * 0.32,
            backgroundColor: 'rgba(255,255,255,0.22)',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.35)',
          }}
        >
          <TaxiGlyph size={glyph} />
        </View>
      </View>

      {/* tip */}
      <View style={{ marginTop: -size * 0.02, alignItems: 'center' }}>
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: tipW,
            borderRightWidth: tipW,
            borderTopWidth: tipH,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: '#E09A00',
          }}
        />
        {/* tip highlight edge */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: 0,
            height: 0,
            borderLeftWidth: tipW * 0.55,
            borderRightWidth: tipW * 0.55,
            borderTopWidth: tipH * 0.55,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: '#F5B800',
            opacity: 0.7,
          }}
        />
      </View>
    </View>
  );
}

function TaxiGlyph({ size }: { size: number }) {
  const bodyH = size * 0.38;
  const cabinH = size * 0.26;
  const wheel = size * 0.15;

  return (
    <View
      style={{
        width: size,
        height: size * 0.7,
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <View
        style={{
          width: size * 0.2,
          height: size * 0.09,
          backgroundColor: COLORS.ink,
          borderRadius: 2,
          marginBottom: 1,
        }}
      />
      <View
        style={{
          width: size * 0.52,
          height: cabinH,
          backgroundColor: COLORS.ink,
          borderTopLeftRadius: size * 0.1,
          borderTopRightRadius: size * 0.1,
        }}
      />
      <View
        style={{
          width: size * 0.95,
          height: bodyH,
          backgroundColor: COLORS.ink,
          borderRadius: size * 0.1,
          marginTop: -1,
          paddingBottom: size * 0.05,
          paddingHorizontal: size * 0.12,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            width: wheel,
            height: wheel,
            borderRadius: wheel / 2,
            backgroundColor: '#F5B800',
          }}
        />
        <View
          style={{
            width: wheel,
            height: wheel,
            borderRadius: wheel / 2,
            backgroundColor: '#F5B800',
          }}
        />
      </View>
    </View>
  );
}
