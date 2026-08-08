import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../theme/colors';

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  onBack: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  heroExtra?: React.ReactNode;
};

/**
 * Shared auth chrome: ink gradient hero + overlapping light sheet.
 * Matches PaymentSuccess / AccountCreated / dashboard language.
 */
export default function AuthSheetScreen({
  eyebrow,
  title,
  subtitle,
  onBack,
  children,
  footer,
  heroExtra,
}: Props) {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['#15233F', COLORS.ink, '#243654']}
        locations={[0, 0.55, 1]}
        style={styles.hero}
      >
        <SafeAreaView edges={['top']} style={styles.heroSafe}>
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={onBack}
              style={styles.back}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={22} color={COLORS.white} />
            </TouchableOpacity>
            <Animated.Text entering={FadeIn.duration(400)} style={styles.brand}>
              payasyou<Text style={styles.brandGo}>go</Text>
            </Animated.Text>
            <View style={{ width: 40 }} />
          </View>

          <Animated.View entering={FadeInDown.delay(60).duration(420)} style={styles.heroCopy}>
            <Text style={styles.eyebrow}>{eyebrow}</Text>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.amberRule} />
            <Text style={styles.subtitle}>{subtitle}</Text>
            {heroExtra}
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.sheet}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView edges={['bottom']} style={styles.sheetInner}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            bounces={false}
          >
            <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.sheetBody}>
              {children}
            </Animated.View>
          </ScrollView>
          {footer ? (
            <Animated.View entering={FadeIn.delay(160).duration(320)} style={styles.footer}>
              {footer}
            </Animated.View>
          ) : null}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.ink,
  },
  hero: {
    paddingBottom: SPACING.lg,
  },
  heroSafe: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: SPACING.lg,
    gap: 6,
  },
  eyebrow: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  title: {
    fontFamily: 'Sora_700Bold',
    fontSize: 32,
    lineHeight: 36,
    color: COLORS.white,
    letterSpacing: -1,
  },
  amberRule: {
    width: 36,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.65)',
  },
  sheet: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    marginTop: -2,
  },
  sheetInner: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  sheetBody: {
    gap: SPACING.md,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
});
