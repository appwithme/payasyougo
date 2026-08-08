import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  rebooking = false,
}: {
  item: Transaction;
  mode?: 'passenger' | 'driver';
  last?: boolean;
  onRebook?: (item: Transaction) => void;
  rebooking?: boolean;
}) => {
  const isPassenger = mode === 'passenger';
  const isWithdrawal = item.kind === 'withdrawal';
  const person = isPassenger
    ? item.driverName
    : isWithdrawal
      ? item.provider || 'Mobile Money'
      : item.passengerName;
  const statusColor = STATUS_COLOR[item.status] ?? COLORS.textMuted;
  const amountPrefix = isPassenger || isWithdrawal ? '−' : '+';
  const title = isWithdrawal ? 'Withdrawal' : (
    <>
      {item.from}
      <Text style={styles.arrow}> → </Text>
      {item.to}
    </>
  );

  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <View style={styles.main}>
        <Text style={styles.route} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {isWithdrawal ? (
            <>
              {item.to}
              {item.to ? ' · ' : ''}
              {item.date} · {item.time}
            </>
          ) : (
            <>
              {person}
              {person ? ' · ' : ''}
              {item.date} · {item.time}
            </>
          )}
        </Text>
      </View>

      <View style={styles.right}>
        <View style={styles.rightTop}>
          <Text
            style={[
              styles.amount,
              !isPassenger && !isWithdrawal && styles.amountCredit,
              isWithdrawal && styles.amountDebit,
            ]}
          >
            {amountPrefix}GH₵{Number(item.amount).toFixed(2)}
          </Text>
          {isPassenger && onRebook ? (
            <TouchableOpacity
              onPress={() => onRebook(item)}
              hitSlop={8}
              disabled={rebooking}
              style={styles.reloadBtn}
              accessibilityRole="button"
              accessibilityLabel={`Reload trip ${item.from} to ${item.to}`}
            >
              {rebooking ? (
                <ActivityIndicator size="small" color={COLORS.textMuted} />
              ) : (
                <Ionicons name="reload" size={16} color={COLORS.textMuted} />
              )}
            </TouchableOpacity>
          ) : null}
        </View>
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
  right: {
    alignItems: 'flex-end',
    gap: 5,
    paddingTop: 2,
  },
  rightTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reloadBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
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
  amountDebit: {
    color: COLORS.ink,
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
