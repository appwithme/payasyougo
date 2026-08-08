import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
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

const { width: W } = Dimensions.get('window');
const SCENE_H = Math.min(W * 0.92, 340);

const BUILDINGS_BACK = [
  { left: 8, w: 36, h: 70, color: '#C5D6EA' },
  { left: 48, w: 44, h: 110, color: '#B7CBE2' },
  { left: 98, w: 32, h: 78, color: '#C9DAED' },
  { left: 138, w: 52, h: 128, color: '#AEC4DE' },
  { left: 198, w: 38, h: 88, color: '#BFD0E6' },
  { left: 242, w: 48, h: 118, color: '#A8C0DB' },
  { left: 298, w: 34, h: 74, color: '#C2D4E9' },
  { left: 340, w: 46, h: 102, color: '#B4C9E1' },
  { left: 392, w: 40, h: 86, color: '#C7D8EC' },
  { left: 440, w: 50, h: 120, color: '#ADC3DD' },
  { left: 498, w: 36, h: 72, color: '#C0D2E7' },
  { left: 542, w: 44, h: 96, color: '#B6CAE2' },
];

const BUILDINGS_FRONT = [
  { left: 20, w: 28, h: 48, color: '#9BB4D0' },
  { left: 72, w: 34, h: 62, color: '#8FAAC8' },
  { left: 160, w: 30, h: 54, color: '#97B0CD' },
  { left: 260, w: 36, h: 68, color: '#87A4C4' },
  { left: 360, w: 28, h: 50, color: '#9BB4D0' },
  { left: 450, w: 40, h: 64, color: '#8FAAC8' },
  { left: 540, w: 32, h: 56, color: '#97B0CD' },
];

type Props = {
  style?: object;
  /** Smaller scene for splash */
  compact?: boolean;
};

export default function CampusRideScene({ style, compact }: Props) {
  const sceneH = compact ? Math.min(W * 0.7, 260) : SCENE_H;
  const roadY = sceneH * 0.72;

  const clouds = useSharedValue(0);
  const skyline = useSharedValue(0);
  const carX = useSharedValue(-90);
  const foliage = useSharedValue(0);

  useEffect(() => {
    clouds.value = withRepeat(
      withTiming(-W * 0.35, {
        duration: 28000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    skyline.value = withRepeat(
      withTiming(-W * 0.22, {
        duration: 18000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    foliage.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    carX.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(W + 40, {
            duration: 5200,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(-90, { duration: 0 })
        ),
        -1,
        false
      )
    );
  }, []);

  const cloudStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: clouds.value }],
  }));

  const skylineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: skyline.value }],
  }));

  const carStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: carX.value }],
  }));

  const foliageStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: foliage.value * 0.35 }, { rotate: `${foliage.value * 0.4}deg` }],
  }));

  return (
    <View style={[styles.scene, { height: sceneH }, style]}>
      {/* Sky wash */}
      <View style={styles.skyFade} />

      {/* Sun — upper sky */}
      <View style={styles.sun}>
        <View style={styles.sunCore} />
      </View>

      {/* Clouds — slow drift */}
      <Animated.View style={[styles.cloudLayer, cloudStyle]}>
        <Cloud left={20} top={18} scale={1} />
        <Cloud left={140} top={8} scale={0.75} />
        <Cloud left={260} top={28} scale={0.9} />
        <Cloud left={W + 40} top={14} scale={1.05} />
        <Cloud left={W + 180} top={32} scale={0.7} />
        <Cloud left={W + 300} top={10} scale={0.85} />
      </Animated.View>

      {/* Distant skyline — medium parallax */}
      <Animated.View
        style={[
          styles.skyline,
          { bottom: sceneH - roadY + 8, height: compact ? 100 : 140 },
          skylineStyle,
        ]}
      >
        {[0, W * 0.85].map((offset) => (
          <View key={offset} style={[styles.skylineStrip, { left: offset }]}>
            {BUILDINGS_BACK.map((b, i) => (
              <View
                key={`b-${offset}-${i}`}
                style={[
                  styles.building,
                  {
                    left: b.left,
                    width: b.w,
                    height: compact ? b.h * 0.75 : b.h,
                    backgroundColor: b.color,
                    bottom: 0,
                  },
                ]}
              >
                <View style={styles.windowRow}>
                  <View style={styles.window} />
                  <View style={styles.window} />
                </View>
              </View>
            ))}
            {BUILDINGS_FRONT.map((b, i) => (
              <View
                key={`f-${offset}-${i}`}
                style={[
                  styles.building,
                  {
                    left: b.left,
                    width: b.w,
                    height: compact ? b.h * 0.75 : b.h,
                    backgroundColor: b.color,
                    bottom: 0,
                    opacity: 0.92,
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </Animated.View>

      {/* Ground / road plane */}
      <View style={[styles.ground, { height: sceneH - roadY + 28 }]}>
        <View style={styles.roadLine} />
      </View>

      {/* Foliage accent */}
      <Animated.View
        style={[
          styles.foliage,
          { bottom: sceneH - roadY - 10 },
          foliageStyle,
        ]}
      >
        <View style={[styles.leaf, styles.leafA]} />
        <View style={[styles.leaf, styles.leafB]} />
        <View style={[styles.leaf, styles.leafC]} />
      </Animated.View>

      {/* Taxi driving across */}
      <Animated.View
        style={[
          styles.carWrap,
          { bottom: sceneH - roadY - 6 },
          carStyle,
        ]}
      >
        <CampusTaxi />
      </Animated.View>
    </View>
  );
}

function Cloud({
  left,
  top,
  scale,
}: {
  left: number;
  top: number;
  scale: number;
}) {
  return (
    <View
      style={[
        styles.cloud,
        {
          left,
          top,
          transform: [{ scale }],
        },
      ]}
    >
      <View style={[styles.puff, styles.puffL]} />
      <View style={[styles.puff, styles.puffM]} />
      <View style={[styles.puff, styles.puffR]} />
    </View>
  );
}

function CampusTaxi() {
  return (
    <View style={styles.taxi}>
      <View style={styles.taxiLight} />
      <View style={styles.taxiCabin} />
      <View style={styles.taxiBody}>
        <View style={styles.taxiWindow} />
        <View style={[styles.taxiWindow, styles.taxiWindowRear]} />
      </View>
      <View style={[styles.wheel, styles.wheelL]} />
      <View style={[styles.wheel, styles.wheelR]} />
      <View style={styles.taxiStripe} />
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    width: '100%',
    overflow: 'hidden',
  },
  skyFade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  cloudLayer: {
    ...StyleSheet.absoluteFillObject,
    width: W * 2.2,
  },
  cloud: {
    position: 'absolute',
    width: 72,
    height: 28,
  },
  puff: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
  },
  puffL: { left: 0, bottom: 0, width: 28, height: 18 },
  puffM: { left: 18, bottom: 4, width: 36, height: 24 },
  puffR: { left: 44, bottom: 0, width: 26, height: 16 },
  skyline: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: W * 2,
  },
  skylineStrip: {
    position: 'absolute',
    bottom: 0,
    width: W,
    height: '100%',
  },
  building: {
    position: 'absolute',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  windowRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 10,
    marginLeft: 8,
  },
  window: {
    width: 6,
    height: 8,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  ground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#7FA0C4',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  roadLine: {
    position: 'absolute',
    top: 18,
    left: 24,
    right: 24,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  foliage: {
    position: 'absolute',
    left: -6,
    width: 70,
    height: 90,
    zIndex: 2,
  },
  leaf: {
    position: 'absolute',
    backgroundColor: COLORS.ink,
    borderRadius: 40,
    opacity: 0.88,
  },
  leafA: {
    width: 34,
    height: 56,
    left: 8,
    bottom: 8,
    transform: [{ rotate: '-18deg' }],
    backgroundColor: '#3A5278',
  },
  leafB: {
    width: 28,
    height: 48,
    left: 28,
    bottom: 18,
    transform: [{ rotate: '22deg' }],
    backgroundColor: '#2A3F63',
  },
  leafC: {
    width: 22,
    height: 38,
    left: 4,
    bottom: 36,
    transform: [{ rotate: '-36deg' }],
    backgroundColor: '#4A6488',
  },
  carWrap: {
    position: 'absolute',
    left: 0,
    zIndex: 3,
  },
  taxi: {
    width: 78,
    height: 36,
  },
  taxiLight: {
    position: 'absolute',
    top: 0,
    left: 30,
    width: 16,
    height: 5,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  taxiCabin: {
    position: 'absolute',
    top: 5,
    left: 16,
    width: 40,
    height: 14,
    backgroundColor: '#F7FAFD',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 10,
  },
  taxiBody: {
    position: 'absolute',
    top: 16,
    left: 0,
    width: 78,
    height: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 8,
  },
  taxiWindow: {
    width: 14,
    height: 7,
    borderRadius: 2,
    backgroundColor: '#9BB4D0',
    marginTop: -10,
  },
  taxiWindowRear: {
    width: 12,
  },
  taxiStripe: {
    position: 'absolute',
    top: 20,
    left: 6,
    right: 6,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  wheel: {
    position: 'absolute',
    bottom: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.ink,
    borderWidth: 2,
    borderColor: '#D8E2EF',
  },
  wheelL: { left: 12 },
  wheelR: { right: 12 },
  sun: {
    position: 'absolute',
    top: 12,
    right: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(245,184,0,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunCore: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
  },
});
