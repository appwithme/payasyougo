import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../types';
import { COLORS, SPACING } from '../theme/colors';

const STATUS_COLOR = {
  completed: COLORS.success,
  pending: COLORS.warning,
  failed: COLORS.error,
} as const;

const TransactionCard = ({
  item,
  mode = 'passenger',
  last = false,
}: {
  item: Transaction;
  mode?: 'passenger' | 'driver';
  last?: boolean;
}) => {
  const isPassenger = mode === 'passenger';
  const person = isPassenger ? item.driverName : item.passengerName;
  const statusColor = STATUS_COLOR[item.status] ?? COLORS.textMuted;

  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <View style={styles.main}>
        <Text style={styles.route} numberOfLines={1}>
          {item.from}
          <Text style={styles.arrow}> → </Text>
          {item.to}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {person}
          {person ? ' · ' : ''}
          {item.date} · {item.time}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, !isPassenger && styles.amountCredit]}>
          {isPassenger ? '−' : '+'}GH₵{Number(item.amount).toFixed(2)}
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={[styles.status, { color: statusColor }]}>
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: SPACING.md,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  main: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  route: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 15,
    color: COLORS.ink,
    letterSpacing: -0.2,
  },
  arrow: {
    fontFamily: 'DMSans_400Regular',
    color: COLORS.textMuted,
  },
  meta: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  right: {
    alignItems: 'flex-end',
    gap: 5,
  },
  amount: {
    fontFamily: 'Sora_700Bold',
    fontSize: 15,
    color: COLORS.ink,
    letterSpacing: -0.3,
  },
  amountCredit: {
    color: COLORS.success,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  status: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 11,
    textTransform: 'capitalize',
  },
});

export default TransactionCard;
