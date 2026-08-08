import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING } from '../../theme/colors';
import { type } from '../../theme/typography';

type Props = {
  onFinish: () => void;
};

export default function SplashScreen({ onFinish }: Props) {
  const logoScale = useSharedValue(0.72);
  const logoOpacity = useSharedValue(0);
  const wordOpacity = useSharedValue(0);
  const wordY = useSharedValue(18);
  const barWidth = useSharedValue(0);
  const footerOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 500 });
    logoScale.value = withSpring(1, { damping: 14, stiffness: 120 });

    wordOpacity.value = withDelay(280, withTiming(1, { duration: 450 }));
    wordY.value = withDelay(280, withSpring(0, { damping: 16, stiffness: 140 }));

    barWidth.value = withDelay(
      520,
      withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) })
    );

    footerOpacity.value = withDelay(700, withTiming(1, { duration: 400 }));

    const timer = setTimeout(() => {
      logoOpacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 320 }, (finished) => {
          if (finished) runOnJS(onFinish)();
        })
      );
      wordOpacity.value = withTiming(0, { duration: 280 });
      footerOpacity.value = withTiming(0, { duration: 280 });
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const wordStyle = useAnimatedStyle(() => ({
    opacity: wordOpacity.value,
    transform: [{ translateY: wordY.value }],
  }));

  const barStyle = useAnimatedStyle(() => ({
    width: 120 * barWidth.value,
  }));

  const footerStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#FFF9F0', '#FFE8A8', '#F5B800']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.orbTop} />
      <View style={styles.orbBottom} />

      <View style={styles.center}>
        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logo}
            resizeMode="cover"
          />
        </Animated.View>

        <Animated.View style={[styles.wordmark, wordStyle]}>
          <Text style={styles.name}>PayAsYouGo</Text>
          <Text style={styles.tagline}>Campus rides. Digital fares.</Text>
        </Animated.View>

        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, barStyle]} />
        </View>
      </View>

      <Animated.Text style={[styles.footer, footerStyle]}>
        University of Cape Coast
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  orbTop: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  orbBottom: {
    position: 'absolute',
    bottom: 80,
    left: -70,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(26,26,26,0.06)',
  },
  center: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  logoWrap: {
    width: 108,
    height: 108,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(26,26,26,0.12)',
    backgroundColor: COLORS.primary,
  },
  logo: { width: '100%', height: '100%' },
  wordmark: { alignItems: 'center', marginTop: SPACING.lg },
  name: {
    ...type.hero,
    fontSize: 34,
  },
  tagline: {
    ...type.caption,
    color: COLORS.ink,
    opacity: 0.7,
    marginTop: 6,
  },
  barTrack: {
    marginTop: SPACING.xl,
    width: 120,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(26,26,26,0.12)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.ink,
    borderRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    ...type.caption,
    color: COLORS.ink,
    opacity: 0.55,
    fontWeight: '600',
  },
});
