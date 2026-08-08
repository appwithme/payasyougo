import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import BrandMark from '../../components/BrandMark';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';

const { width: W } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: { navigation: any }) {
  const bob = useSharedValue(0);

  useEffect(() => {
    bob.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const bobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value }],
  }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient
        colors={['#FFF9F0', '#FFE8A8', COLORS.primary]}
        locations={[0, 0.55, 1]}
        style={styles.hero}
      >
        <View style={styles.heroDecor} />
        <View style={styles.heroDecorSm} />

        <SafeAreaView style={styles.heroSafe} edges={['top']}>
          <Animated.View entering={FadeInDown.duration(500)} style={styles.brandBlock}>
            <Animated.View style={bobStyle}>
              <BrandMark size={86} />
            </Animated.View>
            <Text style={styles.appName}>PayAsYouGo</Text>
            <Text style={styles.tagline}>Digital fares for UCC campus rides</Text>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      <Animated.View entering={FadeInUp.delay(180).duration(480)} style={styles.sheet}>
        <Text style={styles.prompt}>Continue as</Text>

        <TouchableOpacity
          style={styles.roleRow}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('PassengerLogin')}
        >
          <View style={[styles.roleIcon, { backgroundColor: COLORS.primary }]}>
            <Ionicons name="person" size={22} color={COLORS.ink} />
          </View>
          <View style={styles.roleCopy}>
            <Text style={styles.roleTitle}>Passenger</Text>
            <Text style={styles.roleDesc}>Book a route and pay with MoMo</Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleRow}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('DriverLogin')}
        >
          <View style={[styles.roleIcon, { backgroundColor: COLORS.ink }]}>
            <Ionicons name="car-sport" size={22} color={COLORS.primary} />
          </View>
          <View style={styles.roleCopy}>
            <Text style={styles.roleTitle}>Driver</Text>
            <Text style={styles.roleDesc}>Collect fares and track earnings</Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        <Text style={styles.footer}>University of Cape Coast · v1.0</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  hero: {
    flex: 1.15,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  heroDecor: {
    position: 'absolute',
    top: -40,
    right: -50,
    width: W * 0.7,
    height: W * 0.7,
    borderRadius: W * 0.35,
    borderWidth: 1.5,
    borderColor: 'rgba(26,26,26,0.08)',
  },
  heroDecorSm: {
    position: 'absolute',
    bottom: 80,
    left: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  heroSafe: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  brandBlock: { alignItems: 'flex-start' },
  appName: { ...type.hero, fontSize: 36, marginTop: SPACING.md },
  tagline: { ...type.body, marginTop: 6, maxWidth: 280 },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.sm,
    ...SHADOW.lg,
  },
  prompt: {
    ...type.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: SPACING.xs,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleCopy: { flex: 1 },
  roleTitle: { ...type.subheading },
  roleDesc: { ...type.caption, marginTop: 2 },
  footer: { ...type.caption, textAlign: 'center', marginTop: SPACING.md },
});
