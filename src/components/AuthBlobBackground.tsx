import React, { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { COLORS } from '../theme/colors';

type BlobProps = {
  size: number;
  color: string;
  opacity?: number;
  style?: object;
  delay?: number;
  driftX?: number;
  driftY?: number;
  duration?: number;
};

function FloatingBlob({
  size,
  color,
  opacity = 1,
  style,
  delay = 0,
  driftX = 10,
  driftY = 14,
  duration = 5200,
}: BlobProps) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
  }, [delay, duration, t]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: t.value * driftX },
      { translateY: t.value * driftY },
      { scale: 1 + t.value * 0.04 },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity,
        },
        style,
        animStyle,
      ]}
    />
  );
}

/**
 * Soft ink discs + shadow discs in opposite corners (sign-in inspo).
 * Splash stays untouched — use this on auth screens only.
 */
export default function AuthBlobBackground() {
  const { width: W, height: H } = useWindowDimensions();
  const topSize = Math.max(220, W * 0.72);
  const bottomSize = Math.max(200, W * 0.68);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* Top-right shadow then ink disc */}
      <FloatingBlob
        size={topSize * 1.18}
        color="rgba(27, 43, 75, 0.08)"
        style={{ top: -topSize * 0.42, right: -topSize * 0.38 }}
        delay={0}
        driftX={-12}
        driftY={16}
        duration={5600}
      />
      <FloatingBlob
        size={topSize}
        color={COLORS.ink}
        opacity={0.92}
        style={{ top: -topSize * 0.48, right: -topSize * 0.42 }}
        delay={180}
        driftX={-8}
        driftY={12}
        duration={4800}
      />

      {/* Bottom-left shadow then ink disc */}
      <FloatingBlob
        size={bottomSize * 1.2}
        color="rgba(27, 43, 75, 0.07)"
        style={{ bottom: -bottomSize * 0.45, left: -bottomSize * 0.4 }}
        delay={400}
        driftX={14}
        driftY={-12}
        duration={6000}
      />
      <FloatingBlob
        size={bottomSize}
        color={COLORS.ink}
        opacity={0.88}
        style={{ bottom: -bottomSize * 0.5, left: -bottomSize * 0.46 }}
        delay={620}
        driftX={10}
        driftY={-10}
        duration={5200}
      />

      {/* Soft mid accent (subtle, far edge) */}
      <FloatingBlob
        size={H * 0.22}
        color={COLORS.primary}
        opacity={0.12}
        style={{ top: H * 0.38, left: -W * 0.12 }}
        delay={900}
        driftX={18}
        driftY={10}
        duration={7000}
      />
    </View>
  );
}
