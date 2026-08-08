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
import { LinearGradient } from 'expo-linear-gradient';
import CustomBrandMark from '../../components/CustomBrandMark';
import { COLORS } from '../../theme/colors';

const { width: W, height: H } = Dimensions.get('window');

/**
 * Custom modern splash — hand-crafted mark, editorial layout.
 * Logo top → name under logo (Taxi Rider hierarchy).
 * ~6s brand dwell with intentional progress.
 */
const T = {
  nameAt: 1100,
  tagAt: 1800,
  progressAt: 900,
  exitAt: 5600,
  exitDur: 480,
  safety: 6500,
};

type Props = { onFinish: () => void };

export default function SplashScreen({ onFinish }: Props) {
  const root = useRef(new Animated.Value(1)).current;
  const markOp = useRef(new Animated.Value(0)).current;
  const markScale = useRef(new Animated.Value(0.72)).current;
  const markY = useRef(new Animated.Value(40)).current;
  const ring = useRef(new Animated.Value(0)).current;
  const nameOp = useRef(new Animated.Value(0)).current;
  const nameY = useRef(new Animated.Value(22)).current;
  const tagOp = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const floatY = useRef(new Animated.Value(0)).current;
  const line = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Mark entrance
    Animated.parallel([
      Animated.timing(markOp, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(markScale, {
        toValue: 1,
        friction: 6,
        tension: 58,
        useNativeDriver: true,
      }),
      Animated.spring(markY, {
        toValue: 0,
        friction: 7,
        tension: 55,
        useNativeDriver: true,
      }),
      Animated.timing(ring, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatY, {
            toValue: -7,
            duration: 1700,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatY, {
            toValue: 0,
            duration: 1700,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Decorative route line draws under mark
    Animated.timing(line, {
      toValue: 1,
      duration: 1400,
      delay: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Name under logo
    const nameT = setTimeout(() => {
      Animated.parallel([
        Animated.timing(nameOp, {
          toValue: 1,
          duration: 560,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(nameY, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    }, T.nameAt);

    const tagT = setTimeout(() => {
      Animated.timing(tagOp, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, T.tagAt);

    Animated.timing(bar, {
      toValue: 1,
      duration: T.exitAt - T.progressAt,
      delay: T.progressAt,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const exitT = setTimeout(() => {
      Animated.timing(root, {
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
      clearTimeout(nameT);
      clearTimeout(tagT);
      clearTimeout(exitT);
      clearTimeout(safety);
    };
  }, []);

  const barW = bar.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.min(W * 0.36, 150)],
  });

  const lineW = line.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.min(W * 0.28, 120)],
  });

  const ringScale = ring.interpolate({
    inputRange: [0, 1],
    outputRange: [0.55, 1.15],
  });
  const ringOp = ring.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.35, 0],
  });

  return (
    <Animated.View style={[styles.root, { opacity: root }]}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient
        colors={['#F7FAFD', '#EEF3F9', '#E8F0F8']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* soft mesh accents */}
      <View style={[styles.blob, styles.blobTL]} />
      <View style={[styles.blob, styles.blobBR]} />
      <View style={styles.halo} />

      <View style={styles.stage}>
        <View style={styles.markWrap}>
          {/* expanding ring behind mark */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pulseRing,
              {
                opacity: ringOp,
                transform: [{ scale: ringScale }],
              },
            ]}
          />

          {/* LOGO TOP */}
          <Animated.View
            style={{
              opacity: markOp,
              transform: [
                { translateY: Animated.add(markY, floatY) },
                { scale: markScale },
              ],
            }}
          >
            <CustomBrandMark size={128} />
          </Animated.View>
        </View>

        {/* drawn route accent */}
        <View style={styles.routeRow}>
          <View style={styles.routeDot} />
          <Animated.View style={[styles.routeLine, { width: lineW }]} />
          <View style={[styles.routeDot, styles.routeDotEnd]} />
        </View>

        {/* NAME UNDER LOGO */}
        <Animated.View
          style={{
            opacity: nameOp,
            transform: [{ translateY: nameY }],
            alignItems: 'center',
            marginTop: 18,
          }}
        >
          <Text style={styles.brand}>
            payasyou
            <Text style={styles.brandAccent}>go</Text>
          </Text>
          <Animated.Text style={[styles.tag, { opacity: tagOp }]}>
            campus rides · digital fares
          </Animated.Text>
        </Animated.View>

        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width: barW }]} />
        </View>
      </View>

      <Animated.Text style={[styles.footer, { opacity: tagOp }]}>
        University of Cape Coast
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EEF3F9',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTL: {
    top: -H * 0.08,
    left: -W * 0.2,
    width: W * 0.7,
    height: W * 0.7,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  blobBR: {
    bottom: H * 0.05,
    right: -W * 0.25,
    width: W * 0.65,
    height: W * 0.65,
    backgroundColor: 'rgba(245,184,0,0.12)',
  },
  halo: {
    position: 'absolute',
    top: H * 0.22,
    alignSelf: 'center',
    left: W * 0.5 - 130,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginBottom: H * 0.06,
  },
  markWrap: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    height: 14,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  routeDotEnd: {
    backgroundColor: COLORS.ink,
  },
  routeLine: {
    height: 2,
    backgroundColor: 'rgba(27,43,75,0.18)',
    marginHorizontal: 4,
    borderRadius: 2,
  },
  brand: {
    fontFamily: 'Sora_700Bold',
    fontSize: 36,
    color: COLORS.ink,
    letterSpacing: -1.4,
    textTransform: 'lowercase',
  },
  brandAccent: {
    color: COLORS.primaryDark,
  },
  tag: {
    marginTop: 10,
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
  track: {
    marginTop: 44,
    width: Math.min(W * 0.36, 150),
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(27,43,75,0.1)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    alignSelf: 'center',
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
