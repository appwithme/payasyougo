// ============================================================
// WELCOME SCREEN
// ============================================================
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../../theme/colors';

const WelcomeScreen = ({ navigation }: { navigation: any }) => {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(logoAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        Animated.spring(cardAnim, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <Animated.View style={[styles.logoSection, { opacity: fadeAnim, transform: [{ scale: logoAnim }] }]}>
        <View style={styles.logoCircle}>
          <Ionicons name="bus" size={48} color={COLORS.textPrimary} />
        </View>
        <Text style={styles.appName}>PayAsYouGo</Text>
        <Text style={styles.tagline}>UCC Campus Transport · Fast · Simple · Cashless</Text>
      </Animated.View>

      <Animated.View style={[styles.cards, { transform: [{ translateY: cardAnim }], opacity: fadeAnim }]}>
        <Text style={styles.prompt}>Select your role</Text>

        <TouchableOpacity
          style={styles.roleCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('PassengerSignup')}
        >
          <View style={[styles.roleIcon, { backgroundColor: COLORS.surfaceAlt }]}>
            <Ionicons name="person" size={28} color={COLORS.textPrimary} />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Passenger</Text>
            <Text style={styles.roleDesc}>Book rides · Pay fare · View history</Text>
          </View>
          <View style={styles.arrowIcon}>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('DriverLogin')}
        >
          <View style={[styles.roleIcon, { backgroundColor: COLORS.primaryLight + '44' }]}>
            <Ionicons name="car-sport" size={28} color={COLORS.primaryDark} />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Driver</Text>
            <Text style={styles.roleDesc}>Receive payments · Manage wallet</Text>
          </View>
          <View style={styles.arrowIcon}>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.footer}>University of Cape Coast · v1.0</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
    paddingBottom: SPACING.lg,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.md,
    marginBottom: SPACING.lg,
  },
  appName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.hero,
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.base,
    textAlign: 'center',
    marginTop: SPACING.sm,
    fontWeight: '500',
    paddingHorizontal: SPACING.xl,
  },
  cards: {
    gap: SPACING.md,
  },
  prompt: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  roleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
    ...SHADOW.sm,
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleInfo: { flex: 1 },
  roleTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
  },
  roleDesc: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 4,
    fontWeight: '500',
  },
  arrowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default WelcomeScreen;
