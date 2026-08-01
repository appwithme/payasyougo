// ============================================================
// DRIVER CARD COMPONENT
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../theme/colors';

import { Driver } from '../types';

const DriverCard = ({ driver }: { driver: Driver | null }) => {
  if (!driver) return null;

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < full ? 'star' : 'star-outline'}
          size={14}
          color={COLORS.primaryDark}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {driver.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{driver.name}</Text>
        <Text style={styles.vehicle}>{driver.vehicle}</Text>

        <View style={styles.row}>
          <View style={styles.starsRow}>{renderStars(driver.rating)}</View>
          <Text style={styles.rating}>{driver.rating}</Text>
        </View>

        <Text style={styles.phone}>{driver.phone}</Text>
      </View>

      <View style={styles.idBadge}>
        <Text style={styles.idLabel}>DRIVER ID</Text>
        <Text style={styles.idValue}>{driver.id}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
  },
  info: { flex: 1 },
  name: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
  },
  vehicle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  starsRow: { flexDirection: 'row', gap: 2 },
  rating: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
  },
  phone: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
    fontWeight: '500',
  },
  idBadge: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    minWidth: 76,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  idLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  idValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    marginTop: 2,
  },
});

export default DriverCard;
