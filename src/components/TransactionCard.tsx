import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  onRebook,
}: {
  item: Transaction;
  mode?: 'passenger' | 'driver';
  last?: boolean;
  onRebook?: (item: Transaction) => void;
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
        {isPassenger && onRebook ? (
          <TouchableOpacity
            onPress={() => onRebook(item)}
            hitSlop={8}
            style={styles.rebookBtn}
            accessibilityRole="button"
            accessibilityLabel={`Rebook ${item.from} to ${item.to}`}
          >
            <Text style={styles.rebookText}>Rebook</Text>
          </TouchableOpacity>
        ) : null}
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
    alignItems: 'flex-start',
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
  rebookBtn: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: COLORS.primaryMuted,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  rebookText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 12,
    color: COLORS.ink,
  },
  right: {
    alignItems: 'flex-end',
    gap: 5,
    paddingTop: 2,
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
