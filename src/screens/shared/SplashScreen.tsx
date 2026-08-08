import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { COLORS } from '../../theme/colors';

const { width: W, height: H } = Dimensions.get('window');
const LOGO_3D = require('../../../assets/brand/logo-3d-pin-v2.png');

/**
 * Taxi Rider layout + modern 3D glossy pin:
 * logo on top, app name underneath, ~5.8s dwell.
 */
const T = {
  nameIn: 950,
  tagIn: 1650,
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
        opacity: a.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.5] }),
        transform: [
          {
            translateY: a.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -10],
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
  const logoScale = useRef(new Animated.Value(0.55)).current;
  const logoY = useRef(new Animated.Value(36)).current;
  const shadowOpacity = useRef(new Animated.Value(0)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const nameY = useRef(new Animated.Value(20)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const floatY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1) 3D logo pops in with settle
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 65,
        useNativeDriver: true,
      }),
      Animated.spring(logoY, {
        toValue: 0,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // gentle idle float (premium 3D product feel)
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatY, {
            toValue: -8,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatY, {
            toValue: 0,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // 2) Name under logo
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

    // 4) Progress
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

      <SoftBlob top={H * 0.1} left={-36} size={150} color="#FFFFFF" />
      <SoftBlob
        top={H * 0.2}
        left={W * 0.65}
        size={110}
        color="rgba(245,184,0,0.2)"
        delay={180}
      />
      <SoftBlob top={H * 0.72} left={W * 0.12} size={90} color="#FFFFFF" delay={360} />
      <View style={styles.centerGlow} />

      <View style={styles.column}>
        {/* 3D LOGO — top */}
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [
              { translateY: Animated.add(logoY, floatY) },
              { scale: logoScale },
            ],
            alignItems: 'center',
          }}
        >
          <Image source={LOGO_3D} style={styles.logo} resizeMode="contain" />
          <Animated.View style={[styles.logoShadow, { opacity: shadowOpacity }]} />
        </Animated.View>

        {/* APP NAME — under logo */}
        <Animated.View
          style={{
            opacity: nameOpacity,
            transform: [{ translateY: nameY }],
            marginTop: 8,
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
    top: H * 0.2,
    left: W * 0.5 - 150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  column: {
    alignItems: 'center',
    zIndex: 2,
    marginBottom: H * 0.06,
    paddingHorizontal: 32,
  },
  logo: {
    width: Math.min(W * 0.42, 180),
    height: Math.min(W * 0.42, 180),
  },
  logoShadow: {
    marginTop: -6,
    width: 78,
    height: 14,
    borderRadius: 40,
    backgroundColor: 'rgba(27,43,75,0.14)',
    transform: [{ scaleX: 1.15 }],
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
