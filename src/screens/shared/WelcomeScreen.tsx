import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import CustomBrandMark from '../../components/CustomBrandMark';
import { COLORS } from '../../theme/colors';

const { width: W, height: H } = Dimensions.get('window');

type Role = 'passenger' | 'driver';

export default function WelcomeScreen({ navigation }: { navigation: any }) {
  const float = useSharedValue(0);
  const ring = useSharedValue(0.92);

  useEffect(() => {
    float.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    ring.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.92, { duration: 2600, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, []);

  const markMotion = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }],
  }));

  const ringMotion = useAnimatedStyle(() => ({
    transform: [{ scale: ring.value }],
    opacity: 0.55 + (ring.value - 0.92) * 1.5,
  }));

  const go = (role: Role) => {
    navigation.navigate(role === 'passenger' ? 'PassengerLogin' : 'DriverLogin');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient
        colors={['#F8FBFE', '#EAF1F9', '#DDE8F4']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Atmospheric route geometry — not flat fill */}
      <View style={styles.arcOuter} />
      <View style={styles.arcMid} />
      <LinearGradient
        colors={['rgba(245,184,0,0.18)', 'rgba(245,184,0,0)']}
        style={styles.amberWash}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <View style={styles.inkWash} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.hero}>
          <Animated.View entering={FadeIn.duration(700)} style={styles.markStage}>
            <Animated.View style={[styles.pulseRing, ringMotion]} />
            <Animated.View style={markMotion}>
              <CustomBrandMark size={124} />
            </Animated.View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120).duration(520)}>
            <Text style={styles.brand}>
              payasyou
              <Text style={styles.brandGo}>go</Text>
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(220).duration(520)}>
            <Text style={styles.tagline}>
              Digital fares for UCC campus rides
            </Text>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInUp.delay(320).duration(560)}
          style={styles.ctaBlock}
        >
          <RoleRow
            title="Passenger"
            subtitle="Book a route and pay with MoMo"
            icon="person"
            accent="amber"
            onPress={() => go('passenger')}
          />
          <RoleRow
            title="Driver"
            subtitle="Collect fares and track earnings"
            icon="car-sport"
            accent="ink"
            onPress={() => go('driver')}
          />

          <Text style={styles.footer}>University of Cape Coast · v1.0</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

function RoleRow({
  title,
  subtitle,
  icon,
  accent,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: 'amber' | 'ink';
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.98, { duration: 90 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 140 });
      }}
    >
      <Animated.View style={[styles.row, pressStyle]}>
        <View
          style={[
            styles.rowIcon,
            accent === 'amber' ? styles.rowIconAmber : styles.rowIconInk,
          ]}
        >
          <Ionicons
            name={icon}
            size={20}
            color={accent === 'amber' ? COLORS.ink : COLORS.primary}
          />
        </View>
        <View style={styles.rowCopy}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  arcOuter: {
    position: 'absolute',
    top: -H * 0.12,
    right: -W * 0.28,
    width: W * 1.05,
    height: W * 1.05,
    borderRadius: W,
    borderWidth: 1.5,
    borderColor: 'rgba(27,43,75,0.08)',
  },
  arcMid: {
    position: 'absolute',
    top: H * 0.02,
    right: -W * 0.12,
    width: W * 0.72,
    height: W * 0.72,
    borderRadius: W,
    borderWidth: 1.5,
    borderColor: 'rgba(245,184,0,0.22)',
  },
  amberWash: {
    position: 'absolute',
    top: H * 0.08,
    left: W * 0.5 - 140,
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  inkWash: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: H * 0.42,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  safe: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
  },
  markStage: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  pulseRing: {
    position: 'absolute',
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1.5,
    borderColor: 'rgba(245,184,0,0.35)',
    backgroundColor: 'rgba(245,184,0,0.08)',
  },
  brand: {
    fontFamily: 'Sora_700Bold',
    fontSize: 40,
    color: COLORS.ink,
    letterSpacing: -1.6,
    textAlign: 'center',
  },
  brandGo: {
    color: COLORS.primary,
  },
  tagline: {
    marginTop: 10,
    fontFamily: 'DMSans_500Medium',
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 260,
  },
  ctaBlock: {
    gap: 10,
    paddingBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rowIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconAmber: {
    backgroundColor: COLORS.primary,
  },
  rowIconInk: {
    backgroundColor: COLORS.ink,
  },
  rowCopy: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: 'Sora_700Bold',
    fontSize: 17,
    color: COLORS.ink,
    letterSpacing: -0.3,
  },
  rowSubtitle: {
    marginTop: 2,
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textSecondary,
  },
  footer: {
    marginTop: 14,
    textAlign: 'center',
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
