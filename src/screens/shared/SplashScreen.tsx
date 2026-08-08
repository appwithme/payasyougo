import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import BrandMark from '../../components/BrandMark';
import { COLORS } from '../../theme/colors';

const { height: H } = Dimensions.get('window');

/** Short identity beat — welcome owns the campus scene + role pick */
const EXIT_AT = 2800;
const EXIT_DUR = 380;
const SAFETY = 3600;

type Props = { onFinish: () => void };

export default function SplashScreen({ onFinish }: Props) {
  const rootOp = useSharedValue(1);
  const markScale = useSharedValue(0.78);
  const markOp = useSharedValue(0);
  const nameOp = useSharedValue(0);
  const nameY = useSharedValue(16);
  const ring = useSharedValue(0);
  const floatY = useSharedValue(0);

  useEffect(() => {
    markOp.value = withTiming(1, { duration: 480, easing: Easing.out(Easing.cubic) });
    markScale.value = withTiming(1, { duration: 640, easing: Easing.out(Easing.back(1.2)) });

    ring.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1100, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 0 })
      ),
      2,
      false
    );

    nameOp.value = withDelay(420, withTiming(1, { duration: 420 }));
    nameY.value = withDelay(
      420,
      withTiming(0, { duration: 480, easing: Easing.out(Easing.cubic) })
    );

    floatY.value = withDelay(
      700,
      withRepeat(
        withSequence(
          withTiming(-6, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );

    rootOp.value = withDelay(
      EXIT_AT,
      withTiming(0, { duration: EXIT_DUR, easing: Easing.in(Easing.cubic) })
    );

    const exitT = setTimeout(() => onFinish(), EXIT_AT + EXIT_DUR);
    const safety = setTimeout(() => onFinish(), SAFETY);
    return () => {
      clearTimeout(exitT);
      clearTimeout(safety);
    };
  }, []);

  const rootStyle = useAnimatedStyle(() => ({ opacity: rootOp.value }));

  const markStyle = useAnimatedStyle(() => ({
    opacity: markOp.value,
    transform: [{ translateY: floatY.value }, { scale: markScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: interpolate(ring.value, [0, 0.25, 1], [0, 0.45, 0]),
    transform: [{ scale: interpolate(ring.value, [0, 1], [0.7, 1.35]) }],
  }));

  const nameStyle = useAnimatedStyle(() => ({
    opacity: nameOp.value,
    transform: [{ translateY: nameY.value }],
  }));

  return (
    <Animated.View style={[styles.root, rootStyle]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.stage}>
        <View style={styles.markWrap}>
          <Animated.View pointerEvents="none" style={[styles.ring, ringStyle]} />
          <Animated.View style={markStyle}>
            <BrandMark size={132} />
          </Animated.View>
        </View>

        <Animated.View style={[styles.copy, nameStyle]}>
          <Text style={styles.brand}>
            payasyou
            <Text style={styles.brandGo}>go</Text>
          </Text>
          <Text style={styles.tag}>UCC campus rides</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginBottom: H * 0.04,
  },
  markWrap: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  copy: {
    alignItems: 'center',
    marginTop: 8,
  },
  brand: {
    fontFamily: 'Sora_700Bold',
    fontSize: 34,
    color: COLORS.ink,
    letterSpacing: -1.3,
  },
  brandGo: {
    color: COLORS.primaryDark,
  },
  tag: {
    marginTop: 8,
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: COLORS.textMuted,
    letterSpacing: 0.4,
  },
});
