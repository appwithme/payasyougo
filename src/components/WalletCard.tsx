import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme/colors';
import { type } from '../theme/typography';

const WalletCard = ({
  balance,
  todayEarnings,
  totalTrips,
}: {
  balance: number;
  todayEarnings: number;
  totalTrips: number;
}) => {
  return (
    <LinearGradient
      colors={[COLORS.ink, '#2A2A2A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.accentOrb} />

      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Ionicons name="wallet" size={18} color={COLORS.ink} />
        </View>
        <Text style={styles.label}>Wallet balance</Text>
      </View>

      <Text style={styles.balance}>
        GH₵ {balance != null ? balance.toFixed(2) : '0.00'}
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="sunny-outline" size={16} color={COLORS.primary} />
          <Text style={styles.statLabel}>Today</Text>
          <Text style={styles.statValue}>GH₵{todayEarnings?.toFixed(2) ?? '0.00'}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Ionicons name="car-outline" size={16} color={COLORS.primary} />
          <Text style={styles.statLabel}>Total trips</Text>
          <Text style={styles.statValue}>{totalTrips ?? 0}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    overflow: 'hidden',
    ...SHADOW.lg,
  },
  accentOrb: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.primary,
    opacity: 0.18,
    top: -40,
    right: -30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.md,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...type.caption,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balance: {
    fontFamily: 'Sora_700Bold',
    fontSize: 40,
    color: COLORS.white,
    letterSpacing: -1,
    marginBottom: SPACING.xl,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    ...type.caption,
    color: 'rgba(255,255,255,0.55)',
  },
  statValue: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    color: COLORS.white,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: SPACING.sm,
  },
});

export default WalletCard;
