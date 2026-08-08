import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Button from './Button';
import { COLORS, SPACING, RADIUS } from '../theme/colors';

type Props = {
  role: 'driver' | 'passenger';
  name?: string;
  phone?: string;
  onGoToLogin: () => void;
};

export default function AccountCreatedView({ role, name, phone, onGoToLogin }: Props) {
  const isDriver = role === 'driver';
  const status = isDriver ? 'Driver account ready' : 'Account ready';
  const headline = isDriver ? 'You’re set\nto drive' : 'You’re set\nto ride';
  const sheetLead = isDriver
    ? 'Sign in to open your portal, track fares, and collect campus payments.'
    : 'Sign in to book a UCC route and pay your driver with MoMo.';

  const line = useSharedValue(0);
  useEffect(() => {
    line.value = withDelay(
      220,
      withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) })
    );
  }, [line]);

  const amberLine = useAnimatedStyle(() => ({
    width: 12 + line.value * 40,
    opacity: 0.35 + line.value * 0.65,
  }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['#15233F', COLORS.ink, '#243654']}
        locations={[0, 0.55, 1]}
        style={styles.hero}
      >
        <SafeAreaView edges={['top']} style={styles.heroSafe}>
          <Animated.Text entering={FadeIn.duration(400)} style={styles.brand}>
            payasyou<Text style={styles.brandGo}>go</Text>
          </Animated.Text>

          <Animated.View entering={FadeInDown.delay(80).duration(450)} style={styles.heroCopy}>
            <Text style={styles.heroStatus}>{status}</Text>
            <Text style={styles.headline}>{headline}</Text>
            <Animated.View style={[styles.amberRule, amberLine]} />
            {(name || phone) && (
              <Text style={styles.heroMeta}>
                {name ? <Text style={styles.heroName}>{name}</Text> : null}
                {name && phone ? ' · ' : ''}
                {phone || ''}
              </Text>
            )}
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.sheet}>
        <SafeAreaView edges={['bottom']} style={styles.sheetInner}>
          <View style={styles.sheetBody}>
            <Animated.View entering={FadeInUp.delay(120).duration(400)} style={styles.nextBlock}>
              <Text style={styles.sectionLabel}>Next step</Text>
              <Text style={styles.sheetLead}>{sheetLead}</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(180).duration(400)} style={styles.checks}>
              {(isDriver
                ? ['Ghana Card verified', 'Licence verified', 'Vehicle details saved']
                : ['Profile saved', 'Phone ready for MoMo', 'Campus routes unlocked']
              ).map((item) => (
                <View key={item} style={styles.checkRow}>
                  <View style={styles.checkIcon}>
                    <Ionicons name="checkmark" size={14} color={COLORS.ink} />
                  </View>
                  <Text style={styles.checkText}>{item}</Text>
                </View>
              ))}
            </Animated.View>
          </View>

          <Animated.View entering={FadeIn.delay(240).duration(350)} style={styles.footer}>
            <Button title="Go to login" variant="ink" onPress={onGoToLogin} />
          </Animated.View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.ink,
  },
  hero: {
    paddingBottom: SPACING.xl,
  },
  heroSafe: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  brand: {
    fontFamily: 'Sora_700Bold',
    fontSize: 15,
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  brandGo: {
    color: COLORS.primary,
  },
  heroCopy: {
    marginTop: SPACING.xl,
    gap: 6,
  },
  heroStatus: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
  },
  headline: {
    fontFamily: 'Sora_700Bold',
    fontSize: 40,
    lineHeight: 44,
    color: COLORS.white,
    letterSpacing: -1.4,
    marginTop: 2,
  },
  amberRule: {
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 10,
    marginBottom: 6,
  },
  heroMeta: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  heroName: {
    fontFamily: 'DMSans_700Bold',
    color: COLORS.white,
  },
  sheet: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    marginTop: -4,
  },
  sheetInner: {
    flex: 1,
  },
  sheetBody: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    gap: SPACING.xl,
  },
  nextBlock: {
    gap: SPACING.sm,
  },
  sectionLabel: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: COLORS.textMuted,
  },
  sheetLead: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.ink,
  },
  checks: {
    gap: SPACING.md,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 15,
    color: COLORS.ink,
    flex: 1,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
});
