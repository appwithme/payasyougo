import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { MapPin } from '../../components/BrandMark';
import { COLORS } from '../../theme/colors';

const { width: W, height: H } = Dimensions.get('window');

/** First-launch brand intro — researched modern timing (~5.5s) */
const TIMING = {
  ambientIn: 400,
  pinPop: 700,
  holdMark: 900,
  slideStart: 1600,
  lettersStart: 1900,
  tagStart: 3200,
  progressStart: 1400,
  exitAt: 5200,
  exitDur: 450,
  totalHold: 5650,
};

const LETTERS = 'payasyougo'.split('');

type Props = { onFinish: () => void };

function PulseRing({
  delay,
  size,
}: {
  delay: number;
  size: number;
}) {
  const scale = useRef(new Animated.Value(0.55)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.35,
            duration: 2200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.35,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.55,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
}

/**
 * Modern splash choreography (logo reveal best practices):
 * anticipation → mark establish → slide lockup → staggered wordmark
 * → tagline → progress settle → fade out
 */
export default function SplashScreen({ onFinish }: Props) {
  const rootOpacity = useRef(new Animated.Value(1)).current;
  const ambient = useRef(new Animated.Value(0)).current;
  const pinOpacity = useRef(new Animated.Value(0)).current;
  const pinScale = useRef(new Animated.Value(0.55)).current;
  const pinY = useRef(new Animated.Value(18)).current;
  const pinX = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.92)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const tagY = useRef(new Animated.Value(10)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  const letterAnims = useMemo(
    () =>
      LETTERS.map(() => ({
        opacity: new Animated.Value(0),
        y: new Animated.Value(14),
      })),
    []
  );

  useEffect(() => {
    // 1) Ambient wash in
    Animated.timing(ambient, {
      toValue: 1,
      duration: TIMING.ambientIn,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Soft card appears
    Animated.sequence([
      Animated.delay(120),
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 2) Pin pops with overshoot settle (establish mark)
    Animated.sequence([
      Animated.delay(280),
      Animated.parallel([
        Animated.timing(pinOpacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.spring(pinScale, {
          toValue: 1,
          friction: 5,
          tension: 90,
          useNativeDriver: true,
        }),
        Animated.spring(pinY, {
          toValue: 0,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Progress bar (feels intentional while brand holds)
    Animated.timing(progress, {
      toValue: 1,
      duration: TIMING.exitAt - TIMING.progressStart,
      delay: TIMING.progressStart,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();

    Animated.timing(footerOpacity, {
      toValue: 1,
      duration: 500,
      delay: 800,
      useNativeDriver: true,
    }).start();

    // 3) Pin slides left into lockup
    const slideTimer = setTimeout(() => {
      Animated.spring(pinX, {
        toValue: -78,
        friction: 9,
        tension: 55,
        useNativeDriver: true,
      }).start();
    }, TIMING.slideStart);

    // 4) Staggered letter reveal (modern wordmark cascade)
    const letterTimer = setTimeout(() => {
      Animated.stagger(
        55,
        letterAnims.map((a) =>
          Animated.parallel([
            Animated.timing(a.opacity, {
              toValue: 1,
              duration: 320,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.spring(a.y, {
              toValue: 0,
              friction: 7,
              tension: 80,
              useNativeDriver: true,
            }),
          ])
        )
      ).start();
    }, TIMING.lettersStart);

    // 5) Tagline
    const tagTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(tagOpacity, {
          toValue: 1,
          duration: 480,
          useNativeDriver: true,
        }),
        Animated.timing(tagY, {
          toValue: 0,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, TIMING.tagStart);

    // 6) Exit fade
    const exitTimer = setTimeout(() => {
      Animated.timing(rootOpacity, {
        toValue: 0,
        duration: TIMING.exitDur,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onFinish();
      });
    }, TIMING.exitAt);

    // Safety: never hang forever
    const safety = setTimeout(() => onFinish(), TIMING.totalHold + 800);

    return () => {
      clearTimeout(slideTimer);
      clearTimeout(letterTimer);
      clearTimeout(tagTimer);
      clearTimeout(exitTimer);
      clearTimeout(safety);
    };
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.min(W * 0.42, 180)],
  });

  return (
    <Animated.View style={[styles.root, { opacity: rootOpacity }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bg} />

      <Animated.View style={[styles.glow, { opacity: ambient }]} />

      <View style={styles.ringsWrap} pointerEvents="none">
        <PulseRing delay={0} size={160} />
        <PulseRing delay={700} size={210} />
        <PulseRing delay={1400} size={260} />
      </View>

      <View style={styles.stage}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: [{ scale: cardScale }],
            },
          ]}
        >
          <View style={styles.lockup}>
            <Animated.View
              style={[
                styles.pinWrap,
                {
                  opacity: pinOpacity,
                  transform: [
                    { translateX: pinX },
                    { translateY: pinY },
                    { scale: pinScale },
                  ],
                },
              ]}
            >
              <MapPin size={52} />
            </Animated.View>

            <View style={styles.wordRow}>
              {LETTERS.map((ch, i) => {
                const isGo = i >= 7;
                return (
                  <Animated.Text
                    key={`${ch}-${i}`}
                    style={[
                      styles.letter,
                      isGo && styles.letterAccent,
                      {
                        opacity: letterAnims[i].opacity,
                        transform: [{ translateY: letterAnims[i].y }],
                      },
                    ]}
                  >
                    {ch}
                  </Animated.Text>
                );
              })}
            </View>
          </View>
        </Animated.View>

        <Animated.Text
          style={[
            styles.tag,
            {
              opacity: tagOpacity,
              transform: [{ translateY: tagY }],
            },
          ]}
        >
          campus rides · digital fares
        </Animated.Text>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </View>

      <Animated.Text style={[styles.footer, { opacity: footerOpacity }]}>
        University of Cape Coast
      </Animated.Text>
    </Animated.View>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#EAF3FA',
  },
  glow: {
    position: 'absolute',
    top: H * 0.18,
    left: W * 0.5 - 150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  ringsWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  stage: {
    alignItems: 'center',
    zIndex: 2,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 40,
    paddingVertical: 36,
    paddingHorizontal: 28,
    width: Math.min(W * 0.88, 370),
    alignItems: 'center',
    shadowColor: '#152033',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 12,
  },
  lockup: {
    height: 78,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinWrap: {
    position: 'absolute',
    zIndex: 3,
  },
  wordRow: {
    position: 'absolute',
    left: '38%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  letter: {
    fontFamily: 'Sora_700Bold',
    fontSize: 25,
    color: '#152033',
    letterSpacing: -1.1,
    textTransform: 'lowercase',
  },
  letterAccent: {
    color: COLORS.primaryDark,
  },
  tag: {
    marginTop: 28,
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: '#5A6B7D',
    letterSpacing: 0.3,
  },
  progressTrack: {
    marginTop: 28,
    width: Math.min(W * 0.42, 180),
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(21,32,51,0.1)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: COLORS.primaryDark,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    color: '#7A8B9C',
  },
});
