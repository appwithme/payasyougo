import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../types';
import { COLORS, SPACING, RADIUS } from '../theme/colors';
import { type } from '../theme/typography';

const TransactionCard = ({
  item,
  mode = 'passenger',
}: {
  item: Transaction;
  mode?: 'passenger' | 'driver';
}) => {
  const isPassenger = mode === 'passenger';

  return (
    <View style={styles.card}>
      <View style={[styles.icon, isPassenger ? styles.iconPassenger : styles.iconDriver]}>
        <Ionicons
          name={isPassenger ? 'navigate-outline' : 'arrow-down-outline'}
          size={20}
          color={isPassenger ? COLORS.ink : COLORS.success}
        />
      </View>

      <View style={styles.details}>
        <Text style={styles.route}>
          {item.from} → {item.to}
        </Text>
        <Text style={styles.meta}>
          {isPassenger ? item.driverName : item.passengerName}
        </Text>
        <Text style={styles.datetime}>
          {item.date} · {item.time}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, !isPassenger && styles.amountCredit]}>
          {isPassenger ? '−' : '+'}GH₵{Number(item.amount).toFixed(2)}
        </Text>
        <View
          style={[
            styles.badge,
            item.status === 'completed' ? styles.badgeSuccess : styles.badgePending,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              item.status !== 'completed' && { color: COLORS.warning },
            ]}
          >
            {item.status}
          </Text>
        </View>
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
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  iconPassenger: { backgroundColor: COLORS.primaryMuted },
  iconDriver: { backgroundColor: COLORS.successLight },
  details: { flex: 1 },
  route: { ...type.label, fontSize: 14 },
  meta: { ...type.caption, marginTop: 3 },
  datetime: { ...type.caption, marginTop: 2, fontSize: 11 },
  right: { alignItems: 'flex-end', gap: 4 },
  amount: {
    fontFamily: 'Sora_700Bold',
    fontSize: 15,
    color: COLORS.ink,
  },
  amountCredit: { color: COLORS.success },
  badge: {
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeSuccess: { backgroundColor: COLORS.successLight },
  badgePending: { backgroundColor: 'rgba(196,122,18,0.15)' },
  badgeText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 10,
    color: COLORS.success,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});

export default TransactionCard;
