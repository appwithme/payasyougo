import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../theme/colors';
import { type } from '../theme/typography';
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
          size={12}
          color={COLORS.primaryDark}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{driver.name.charAt(0).toUpperCase()}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{driver.name}</Text>
        <Text style={styles.vehicle}>{driver.vehicle}</Text>

        <View style={styles.row}>
          <View style={styles.starsRow}>{renderStars(driver.rating)}</View>
          <Text style={styles.rating}>{driver.rating}</Text>
        </View>
      </View>

      <View style={styles.idBadge}>
        <Text style={styles.idLabel}>ID</Text>
        <Text style={styles.idValue}>{driver.id}</Text>
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
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontFamily: 'Sora_700Bold',
    fontSize: 16,
    color: COLORS.ink,
  },
  info: { flex: 1 },
  name: { ...type.label },
  vehicle: { ...type.caption, marginTop: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  starsRow: { flexDirection: 'row', gap: 1 },
  rating: {
    ...type.caption,
    color: COLORS.textPrimary,
    fontFamily: 'DMSans_700Bold',
  },
  idBadge: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  idLabel: {
    ...type.caption,
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  idValue: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    color: COLORS.ink,
    marginTop: 2,
  },
});

export default DriverCard;
