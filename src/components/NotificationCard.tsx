// ============================================================
// NOTIFICATION CARD COMPONENT
// ============================================================
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../theme/colors';

const NotificationCard = ({ notification, onDismiss, onViewDetails }: { notification: any; onDismiss: () => void; onViewDetails: () => void }) => {
  const slideAnim = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    if (notification) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 60,
        friction: 9,
      }).start();
    }
  }, [notification]);

  if (!notification) return null;

  return (
    <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.pulseWrap}>
        <View style={styles.pulseDot} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Payment Received</Text>
        <Text style={styles.passenger}>{notification.passengerName}</Text>
        <Text style={styles.route}>
          {notification.from} → {notification.to}
        </Text>
        <Text style={styles.time}>{notification.time}</Text>
      </View>

      <View style={styles.amountWrap}>
        <Text style={styles.currency}>GH₵</Text>
        <Text style={styles.amount}>{notification.amount}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.viewBtn}
          onPress={onViewDetails}
          activeOpacity={0.8}
        >
          <Ionicons name="eye-outline" size={18} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dismissBtn}
          onPress={onDismiss}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={18} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.success,
    ...SHADOW.lg,
    gap: SPACING.sm,
  },
  pulseWrap: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
  },
  content: { flex: 1 },
  title: {
    color: COLORS.success,
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  passenger: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
  },
  route: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
    fontWeight: '500',
  },
  time: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: SPACING.sm,
  },
  currency: {
    color: COLORS.success,
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    marginBottom: 4,
  },
  amount: {
    color: COLORS.success,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
  },
  actions: {
    gap: SPACING.xs,
  },
  viewBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.sm,
  },
  dismissBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default NotificationCard;
