import React from 'react';
import { View, ViewStyle } from 'react-native';
import { COLORS } from '../theme/colors';

type Props = {
  size?: number;
  style?: ViewStyle;
};

/**
 * Flat geometric brand mark — amber tile + ink route glyph.
 */
function CustomBrandMark({ size = 48, style }: Props) {
  const r = size * 0.28;
  const pad = size * 0.22;
  const stroke = Math.max(2.5, size * 0.07);
  const dot = size * 0.14;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: r,
          backgroundColor: COLORS.primary,
          alignItems: 'center',
          justifyContent: 'center',
          padding: pad,
        },
        style,
      ]}
    >
      <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
        <View
          style={{
            width: dot,
            height: dot,
            borderRadius: dot / 2,
            backgroundColor: COLORS.ink,
            marginBottom: size * 0.06,
          }}
        />
        <View
          style={{
            width: stroke,
            height: size * 0.22,
            backgroundColor: COLORS.ink,
            marginLeft: (dot - stroke) / 2,
            borderRadius: stroke / 2,
            marginBottom: size * 0.06,
          }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: dot * 1.15,
              height: dot * 1.15,
              borderRadius: 3,
              backgroundColor: COLORS.ink,
              transform: [{ rotate: '45deg' }],
            }}
          />
          <View
            style={{
              marginLeft: size * 0.08,
              width: size * 0.28,
              height: stroke,
              backgroundColor: COLORS.ink,
              borderRadius: stroke / 2,
            }}
          />
        </View>
      </View>
    </View>
  );
}

export default CustomBrandMark;
