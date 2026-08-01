// ============================================================
// TRANSACTION CARD COMPONENT
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../theme/colors';

import { Transaction } from '../types';

const TransactionCard = ({ item, mode = 'passenger' }: { item: Transaction; mode?: 'passenger' | 'driver' }) => {
  const isPassenger = mode === 'passenger';

  return (
    <View style={styles.card}>
      <View style={[styles.icon, isPassenger ? styles.iconPassenger : styles.iconDriver]}>
        <Ionicons
          name={isPassenger ? 'car-outline' : 'cash-outline'}
          size={20}
          color={isPassenger ? COLORS.textPrimary : COLORS.success}
        />
      </View>

      <View style={styles.details}>
        <Text style={styles.route}>
          {item.from} → {item.to}
        </Text>
        <Text style={styles.meta}>
          {isPassenger ? `Driver: ${item.driverName}` : `From: ${item.passengerName}`}
        </Text>
        <Text style={styles.datetime}>
          {item.date}  •  {item.time}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, isPassenger ? styles.amountDebit : styles.amountCredit]}>
          {isPassenger ? '-' : '+'}GH₵{item.amount}
        </Text>
        <View style={[styles.badge, item.status === 'completed' ? styles.badgeSuccess : styles.badgePending]}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
        <Text style={styles.txnId}>{item.id}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  iconPassenger: {
    backgroundColor: COLORS.primaryLight,
  },
  iconDriver: {
    backgroundColor: COLORS.successLight,
  },
  details: { flex: 1 },
  route: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
  },
  meta: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
    fontWeight: '500',
  },
  datetime: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    fontSize: FONT_SIZE.base,
    fontWeight: '800',
  },
  amountDebit: {
    color: COLORS.textPrimary, // Clean fintech look
  },
  amountCredit: {
    color: COLORS.success,
  },
  badge: {
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  badgeSuccess: {
    backgroundColor: COLORS.successLight,
  },
  badgePending: {
    backgroundColor: COLORS.warning + '33',
  },
  badgeText: {
    color: COLORS.success,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  txnId: {
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
    fontFamily: 'monospace',
  },
});

export default TransactionCard;
