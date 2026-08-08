import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { MapPin } from '../../components/BrandMark';
import { COLORS } from '../../theme/colors';

const { width: W, height: H } = Dimensions.get('window');

type Props = { onFinish: () => void };

function SoftOrb({
  x,
  y,
  size,
  delay,
  color,
}: {
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [0.2, 0.55]),
    transform: [{ translateY: interpolate(t.value, [0, 1], [0, -12]) }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

/**
 * Splash inspired by ride-style branding:
 * 1) Amber pin pops in the center
 * 2) Pin slides left
 * 3) lowercase "payasyougo" rolls in on the right
 * 4) Soft ambient orbs, then fade to onboarding
 */
export default function SplashScreen({ onFinish }: Props) {
  const pinScale = useSharedValue(0.15);
  const pinOpacity = useSharedValue(0);
  const pinX = useSharedValue(0);
  const nameX = useSharedValue(56);
  const nameOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.92);
  const decorOpacity = useSharedValue(0);
  const exitOpacity = useSharedValue(1);

  useEffect(() => {
    // Soft ambient
    decorOpacity.value = withTiming(1, { duration: 600 });

    // White card fades behind pin (ride-style tile)
    cardOpacity.value = withDelay(80, withTiming(1, { duration: 350 }));
    cardScale.value = withDelay(80, withSpring(1, { damping: 14, stiffness: 140 }));

    // 1) Pin pops
    pinOpacity.value = withTiming(1, { duration: 220 });
    pinScale.value = withSpring(1, { damping: 10, stiffness: 170 });

    // 2–3) Pin slides left, name rolls in from right
    const slideAt = 850;
    pinX.value = withDelay(slideAt, withSpring(-58, { damping: 15, stiffness: 95 }));
    nameOpacity.value = withDelay(slideAt + 100, withTiming(1, { duration: 400 }));
    nameX.value = withDelay(slideAt + 100, withSpring(0, { damping: 14, stiffness: 110 }));

    // Exit
    const timer = setTimeout(() => {
      exitOpacity.value = withTiming(0, { duration: 360 }, (finished) => {
        if (finished) runOnJS(onFinish)();
      });
    }, 3100);

    return () => clearTimeout(timer);
  }, []);

  const rootStyle = useAnimatedStyle(() => ({
    opacity: exitOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value * exitOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const pinStyle = useAnimatedStyle(() => ({
    opacity: pinOpacity.value,
    transform: [{ translateX: pinX.value }, { scale: pinScale.value }],
  }));

  const nameStyle = useAnimatedStyle(() => ({
    opacity: nameOpacity.value,
    transform: [{ translateX: nameX.value }],
  }));

  const decorStyle = useAnimatedStyle(() => ({
    opacity: decorOpacity.value * exitOpacity.value,
  }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      {/* pale blue-cream like the ride inspo backdrop */}
      <View style={StyleSheet.absoluteFillObject}>
        <View style={styles.bg} />
      </View>

      <Animated.View style={[StyleSheet.absoluteFill, decorStyle]} pointerEvents="none">
        <SoftOrb x={W * 0.1} y={H * 0.16} size={18} delay={0} color="#FFFFFF" />
        <SoftOrb x={W * 0.78} y={H * 0.2} size={12} delay={180} color={COLORS.primary} />
        <SoftOrb x={W * 0.15} y={H * 0.74} size={14} delay={320} color="#FFFFFF" />
        <SoftOrb x={W * 0.82} y={H * 0.7} size={10} delay={80} color={COLORS.primary} />
        <SoftOrb x={W * 0.48} y={H * 0.1} size={8} delay={240} color="#D6E6F5" />
        <View style={styles.softCircle} />
      </Animated.View>

      <Animated.View style={[styles.stage, rootStyle]}>
        {/* ride-style white squircle */}
        <Animated.View style={[styles.card, cardStyle]}>
          <View style={styles.row}>
            <Animated.View style={pinStyle}>
              <MapPin size={54} />
            </Animated.View>

            <Animated.View style={[styles.nameBlock, nameStyle]}>
              <Text style={styles.word}>
                payasyou
                <Text style={styles.go}>go</Text>
              </Text>
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.Text style={[styles.tag, nameStyle]}>
          campus rides · digital fares
        </Animated.Text>
      </Animated.View>

      <Animated.Text style={[styles.footer, nameStyle]}>
        University of Cape Coast
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EAF3FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: {
    flex: 1,
    backgroundColor: '#EAF3FA',
  },
  softCircle: {
    position: 'absolute',
    top: H * 0.22,
    left: W * 0.5 - 140,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  stage: {
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 36,
    paddingVertical: 28,
    paddingHorizontal: 28,
    minWidth: Math.min(W * 0.82, 340),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A2A3A',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
  },
  nameBlock: {
    marginLeft: 4,
    justifyContent: 'center',
  },
  word: {
    fontFamily: 'Sora_700Bold',
    fontSize: 28,
    color: '#152033',
    letterSpacing: -1,
    textTransform: 'lowercase',
  },
  go: {
    color: COLORS.primaryDark,
  },
  tag: {
    marginTop: 22,
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
    color: '#5A6B7D',
    letterSpacing: 0.2,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    color: '#7A8B9C',
  },
});
