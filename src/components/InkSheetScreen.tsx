import React from 'react';
import { View, Text, StyleSheet, StatusBar, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../theme/colors';

type Props = {
  /** Content inside the dark hero (below brand). */
  hero: React.ReactNode;
  children: React.ReactNode;
  /** Extra bottom padding inside the hero before the sheet overlap. */
  heroBottom?: number;
  sheetStyle?: ViewStyle;
  showBrand?: boolean;
};

/**
 * Shared passenger chrome: ink gradient hero + overlapping light sheet.
 * Matches Profile / PaymentSuccess language.
 */
export default function InkSheetScreen({
  hero,
  children,
  heroBottom = SPACING.xl,
  sheetStyle,
  showBrand = true,
}: Props) {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['#15233F', COLORS.ink, '#2A3F63']}
        locations={[0, 0.55, 1]}
        style={[styles.hero, { paddingBottom: heroBottom + 8 }]}
      >
        <SafeAreaView edges={['top']} style={styles.heroSafe}>
          {showBrand ? (
            <Animated.Text entering={FadeIn.duration(400)} style={styles.brand}>
              payasyou<Text style={styles.brandGo}>go</Text>
            </Animated.Text>
          ) : null}
          {hero}
        </SafeAreaView>
      </LinearGradient>

      <View style={[styles.sheet, sheetStyle]}>
        <SafeAreaView edges={['bottom']} style={styles.sheetInner}>
          {children}
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
  hero: {},
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
  sheet: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    marginTop: -18,
    overflow: 'hidden',
  },
  sheetInner: {
    flex: 1,
  },
});
