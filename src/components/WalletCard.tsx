// ============================================================
// WALLET CARD COMPONENT
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../theme/colors';

const WalletCard = ({ balance, todayEarnings, totalTrips }: { balance: number; todayEarnings: number; totalTrips: number }) => {
  return (
    <View style={styles.card}>
      <View style={styles.circleLg} />
      <View style={styles.circleSm} />

      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Ionicons name="wallet-outline" size={20} color={COLORS.textPrimary} />
        </View>
        <Text style={styles.label}>WALLET BALANCE</Text>
      </View>

      <Text style={styles.balance}>
        GH₵ {balance != null ? balance.toFixed(2) : '0.00'}
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="today-outline" size={16} color={COLORS.textPrimary} />
          <Text style={styles.statLabel}>Today</Text>
          <Text style={styles.statValue}>GH₵{todayEarnings?.toFixed(2) ?? '0.00'}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Ionicons name="car-outline" size={16} color={COLORS.textPrimary} />
          <Text style={styles.statLabel}>Total Trips</Text>
          <Text style={styles.statValue}>{totalTrips ?? 0}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    overflow: 'hidden',
    ...SHADOW.lg,
  },
  circleLg: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primaryLight,
    top: -60,
    right: -60,
    opacity: 0.8,
  },
  circleSm: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryDark,
    bottom: -30,
    left: 10,
    opacity: 0.4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.sm,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  balance: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.hero,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: SPACING.xl,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.base,
    fontWeight: '800',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
});

export default WalletCard;
