import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme/colors';
import { type } from '../theme/typography';

const NotificationCard = ({
  notification,
  onDismiss,
  onViewDetails,
}: {
  notification: any;
  onDismiss: () => void;
  onViewDetails: () => void;
}) => {
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
      <View style={styles.pulseDot} />

      <View style={styles.content}>
        <Text style={styles.title}>Payment received</Text>
        <Text style={styles.passenger}>{notification.passengerName}</Text>
        <Text style={styles.route}>
          {notification.from} → {notification.to}
        </Text>
      </View>

      <Text style={styles.amount}>+GH₵{notification.amount}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.viewBtn} onPress={onViewDetails} activeOpacity={0.8}>
          <Ionicons name="eye-outline" size={16} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss} activeOpacity={0.8}>
          <Ionicons name="close" size={16} color={COLORS.ink} />
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
    borderWidth: 1.5,
    borderColor: COLORS.success,
    ...SHADOW.md,
    gap: SPACING.sm,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.success,
  },
  content: { flex: 1 },
  title: {
    ...type.caption,
    color: COLORS.success,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  passenger: { ...type.label },
  route: { ...type.caption, marginTop: 2 },
  amount: {
    fontFamily: 'Sora_700Bold',
    fontSize: 16,
    color: COLORS.success,
    marginRight: 4,
  },
  actions: { gap: 6 },
  viewBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default NotificationCard;
