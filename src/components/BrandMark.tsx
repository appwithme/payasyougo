import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../theme/colors';

type Props = {
  size?: number;
  style?: ViewStyle;
  /** yellow badge (default) or ink badge */
  tone?: 'yellow' | 'ink' | 'plain';
};

/**
 * Hand-drawn geometric mark — no AI bitmap.
 * Yellow rounded tile + charcoal shuttle body.
 */
export default function BrandMark({ size = 72, style, tone = 'yellow' }: Props) {
  const r = size * 0.28;
  const pad = size * 0.18;
  const bodyW = size - pad * 2;
  const bodyH = size * 0.42;
  const wheel = size * 0.12;
  const bg =
    tone === 'yellow' ? COLORS.primary : tone === 'ink' ? COLORS.ink : 'transparent';
  const ink = tone === 'ink' ? COLORS.primary : COLORS.ink;
  const window = tone === 'ink' ? 'rgba(245,184,0,0.35)' : 'rgba(255,255,255,0.55)';

  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: r,
          backgroundColor: bg,
          borderWidth: tone === 'plain' ? 0 : 1,
          borderColor: tone === 'yellow' ? 'rgba(26,26,26,0.1)' : 'rgba(255,255,255,0.12)',
        },
        style,
      ]}
    >
      {/* shuttle body */}
      <View
        style={{
          width: bodyW,
          height: bodyH,
          borderRadius: size * 0.12,
          backgroundColor: ink,
          marginTop: size * 0.22,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            right: bodyW * 0.08,
            top: bodyH * 0.18,
            width: bodyW * 0.28,
            height: bodyH * 0.42,
            borderRadius: 4,
            backgroundColor: window,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: bodyW * 0.12,
            top: bodyH * 0.22,
            width: bodyW * 0.14,
            height: bodyH * 0.34,
            borderRadius: 3,
            backgroundColor: window,
          }}
        />
      </View>

      {/* wheels */}
      <View style={[styles.wheels, { width: bodyW, marginTop: -wheel * 0.35 }]}>
        <View
          style={{
            width: wheel,
            height: wheel,
            borderRadius: wheel / 2,
            backgroundColor: ink,
            borderWidth: 2,
            borderColor: bg === 'transparent' ? COLORS.background : bg,
          }}
        />
        <View
          style={{
            width: wheel,
            height: wheel,
            borderRadius: wheel / 2,
            backgroundColor: ink,
            borderWidth: 2,
            borderColor: bg === 'transparent' ? COLORS.background : bg,
          }}
        />
      </View>

      {/* fare accent line */}
      <View
        style={{
          position: 'absolute',
          bottom: size * 0.14,
          width: size * 0.22,
          height: 3,
          borderRadius: 2,
          backgroundColor: tone === 'ink' ? COLORS.primary : COLORS.ink,
          opacity: 0.85,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  wheels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '8%',
  },
});
