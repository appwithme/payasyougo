import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import BrandMark from '../../components/BrandMark';
import { COLORS } from '../../theme/colors';

const { width: W, height: H } = Dimensions.get('window');

/**
 * Taxi Rider–style splash:
 * logo (pin) centered upper-middle, app name directly underneath.
 * Moodboard: cool light-blue field, soft white glow, amber brand mark.
 * Duration ~5.8s so it doesn't feel rushed.
 */
const T = {
  logoIn: 0,
  nameIn: 900,
  tagIn: 1600,
  progressIn: 1200,
  exitAt: 5400,
  exitDur: 420,
  safety: 6200,
};

type Props = { onFinish: () => void };

function SoftBlob({
  top,
  left,
  size,
  color,
  delay = 0,
}: {
  top: number;
  left: number;
  size: number;
  color: string;
  delay?: number;
}) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(a, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(a, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: a.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.55] }),
        transform: [
          {
            translateY: a.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -12],
            }),
          },
        ],
      }}
    />
  );
}

export default function SplashScreen({ onFinish }: Props) {
  const rootOpacity = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoY = useRef(new Animated.Value(28)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const nameY = useRef(new Animated.Value(18)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1) Logo drops in from above-center (Taxi Rider hierarchy)
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 70,
        useNativeDriver: true,
      }),
      Animated.spring(logoY, {
        toValue: 0,
        friction: 7,
        tension: 65,
        useNativeDriver: true,
      }),
    ]).start();

    // 2) App name reads under the logo
    const nameTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(nameY, {
          toValue: 0,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
      ]).start();
    }, T.nameIn);

    // 3) Tagline
    const tagTimer = setTimeout(() => {
      Animated.timing(tagOpacity, {
        toValue: 1,
        duration: 480,
        useNativeDriver: true,
      }).start();
    }, T.tagIn);

    // 4) Loading bar — makes longer dwell feel intentional
    Animated.timing(progress, {
      toValue: 1,
      duration: T.exitAt - T.progressIn,
      delay: T.progressIn,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // 5) Exit
    const exitTimer = setTimeout(() => {
      Animated.timing(rootOpacity, {
        toValue: 0,
        duration: T.exitDur,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onFinish();
      });
    }, T.exitAt);

    const safety = setTimeout(() => onFinish(), T.safety);

    return () => {
      clearTimeout(nameTimer);
      clearTimeout(tagTimer);
      clearTimeout(exitTimer);
      clearTimeout(safety);
    };
  }, []);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.min(W * 0.38, 160)],
  });

  return (
    <Animated.View style={[styles.root, { opacity: rootOpacity }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bg} />

      {/* moodboard soft shapes */}
      <SoftBlob top={H * 0.08} left={-40} size={160} color="#FFFFFF" />
      <SoftBlob
        top={H * 0.18}
        left={W * 0.62}
        size={120}
        color="rgba(245,184,0,0.22)"
        delay={200}
      />
      <SoftBlob top={H * 0.7} left={W * 0.1} size={100} color="#FFFFFF" delay={400} />
      <View style={styles.centerGlow} />

      <View style={styles.column}>
        {/* LOGO — top */}
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ translateY: logoY }, { scale: logoScale }],
          }}
        >
          <BrandMark size={112} variant="pin" />
        </Animated.View>

        {/* APP NAME — directly under logo */}
        <Animated.View
          style={{
            opacity: nameOpacity,
            transform: [{ translateY: nameY }],
            marginTop: 28,
            alignItems: 'center',
          }}
        >
          <Text style={styles.appName}>
            payasyou
            <Text style={styles.appNameAccent}>go</Text>
          </Text>
          <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
            campus rides · digital fares
          </Animated.Text>
        </Animated.View>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: barWidth }]} />
        </View>
      </View>

      <Animated.Text style={[styles.footer, { opacity: tagOpacity }]}>
        University of Cape Coast
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EEF3F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#EEF3F9',
  },
  centerGlow: {
    position: 'absolute',
    top: H * 0.22,
    left: W * 0.5 - 140,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  column: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    zIndex: 2,
    // push block slightly upper-middle like Taxi Rider mockups
    marginBottom: H * 0.08,
  },
  appName: {
    fontFamily: 'Sora_700Bold',
    fontSize: 34,
    color: COLORS.ink,
    letterSpacing: -1.2,
    textTransform: 'lowercase',
  },
  appNameAccent: {
    color: COLORS.primaryDark,
  },
  tagline: {
    marginTop: 10,
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
    letterSpacing: 0.2,
  },
  progressTrack: {
    marginTop: 40,
    width: Math.min(W * 0.38, 160),
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(27,43,75,0.1)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
