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
import { LinearGradient } from 'expo-linear-gradient';
import BrandMark from '../../components/BrandMark';
import { COLORS } from '../../theme/colors';
import { type } from '../../theme/typography';

const { width: W, height: H } = Dimensions.get('window');

type Props = { onFinish: () => void };

function FloatingDot({
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
          withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [0.25, 0.85]),
    transform: [
      { translateY: interpolate(t.value, [0, 1], [0, -14]) },
      { scale: interpolate(t.value, [0, 1], [0.85, 1.15]) },
    ],
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

function OrbitRing({ delay }: { delay: number }) {
  const rot = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    rot.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 10000, easing: Easing.linear }), -1, false)
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.35,
    transform: [{ rotate: `${rot.value * 360}deg` }],
  }));

  return (
    <Animated.View style={[styles.orbit, style]}>
      <View style={styles.orbitDot} />
    </Animated.View>
  );
}

export default function SplashScreen({ onFinish }: Props) {
  // 0 = pop in center, 1 = slide left + name in
  const phase = useSharedValue(0);
  const logoScale = useSharedValue(0.2);
  const logoOpacity = useSharedValue(0);
  const nameX = useSharedValue(48);
  const nameOpacity = useSharedValue(0);
  const tagOpacity = useSharedValue(0);
  const decorOpacity = useSharedValue(0);
  const exitOpacity = useSharedValue(1);

  useEffect(() => {
    // 1) Logo pops up in center
    logoOpacity.value = withTiming(1, { duration: 280 });
    logoScale.value = withSpring(1, { damping: 11, stiffness: 160 });

    decorOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));

    // 2) After beat: logo slides left, name rolls in from right
    const slideAt = 900;
    phase.value = withDelay(slideAt, withSpring(1, { damping: 16, stiffness: 90 }));
    nameOpacity.value = withDelay(slideAt + 120, withTiming(1, { duration: 420 }));
    nameX.value = withDelay(
      slideAt + 120,
      withSpring(0, { damping: 15, stiffness: 110 })
    );
    tagOpacity.value = withDelay(slideAt + 320, withTiming(1, { duration: 380 }));

    // 3) Hold, then fade out → onboarding
    const doneAt = 3200;
    const timer = setTimeout(() => {
      exitOpacity.value = withTiming(0, { duration: 380 }, (finished) => {
        if (finished) runOnJS(onFinish)();
      });
    }, doneAt);

    return () => clearTimeout(timer);
  }, []);

  const clusterStyle = useAnimatedStyle(() => ({
    opacity: exitOpacity.value,
    transform: [
      {
        translateX: interpolate(phase.value, [0, 1], [0, -56]),
      },
    ],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      {
        // keep logo slightly left of center once phase advances (cluster also moves)
        translateX: interpolate(phase.value, [0, 1], [0, -8]),
      },
    ],
  }));

  const nameStyle = useAnimatedStyle(() => ({
    opacity: nameOpacity.value * exitOpacity.value,
    transform: [{ translateX: nameX.value }],
  }));

  const tagStyle = useAnimatedStyle(() => ({
    opacity: tagOpacity.value * exitOpacity.value,
  }));

  const decorStyle = useAnimatedStyle(() => ({
    opacity: decorOpacity.value * exitOpacity.value,
  }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#FFF9F0', '#FFE6A0', '#F5B800']}
        locations={[0, 0.62, 1]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[StyleSheet.absoluteFill, decorStyle]} pointerEvents="none">
        <FloatingDot x={W * 0.12} y={H * 0.18} size={10} delay={0} color={COLORS.ink} />
        <FloatingDot x={W * 0.78} y={H * 0.22} size={14} delay={200} color="#fff" />
        <FloatingDot x={W * 0.18} y={H * 0.72} size={12} delay={400} color="#fff" />
        <FloatingDot x={W * 0.82} y={H * 0.68} size={8} delay={100} color={COLORS.ink} />
        <FloatingDot x={W * 0.5} y={H * 0.12} size={6} delay={300} color={COLORS.ink} />
        <FloatingDot x={W * 0.08} y={H * 0.48} size={7} delay={500} color="#fff" />
        <FloatingDot x={W * 0.9} y={H * 0.42} size={9} delay={150} color={COLORS.ink} />

        <View style={styles.arcTop} />
        <View style={styles.arcBottom} />
        <OrbitRing delay={400} />
      </Animated.View>

      <View style={styles.stage}>
        <Animated.View style={[styles.cluster, clusterStyle]}>
          <Animated.View style={logoStyle}>
            <BrandMark size={88} />
          </Animated.View>

          <Animated.View style={[styles.nameBlock, nameStyle]}>
            <Text style={styles.name}>PayAsYouGo</Text>
            <Animated.Text style={[styles.tagline, tagStyle]}>
              Campus rides · Digital fares
            </Animated.Text>
          </Animated.View>
        </Animated.View>
      </View>

      <Animated.Text style={[styles.footer, tagStyle]}>University of Cape Coast</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  cluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  nameBlock: {
    justifyContent: 'center',
    maxWidth: W * 0.52,
  },
  name: {
    ...type.hero,
    fontSize: 28,
    lineHeight: 32,
  },
  tagline: {
    ...type.caption,
    color: COLORS.ink,
    opacity: 0.65,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    ...type.caption,
    color: COLORS.ink,
    opacity: 0.5,
  },
  arcTop: {
    position: 'absolute',
    top: H * 0.08,
    alignSelf: 'center',
    left: W * 0.2,
    width: W * 0.6,
    height: W * 0.6,
    borderRadius: W * 0.3,
    borderWidth: 1.5,
    borderColor: 'rgba(26,26,26,0.08)',
  },
  arcBottom: {
    position: 'absolute',
    bottom: H * 0.05,
    right: -W * 0.15,
    width: W * 0.55,
    height: W * 0.55,
    borderRadius: W * 0.275,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  orbit: {
    position: 'absolute',
    top: H * 0.28,
    left: W * 0.5 - 90,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.1)',
    borderStyle: 'dashed',
  },
  orbitDot: {
    position: 'absolute',
    top: -5,
    left: 85,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.ink,
  },
});
