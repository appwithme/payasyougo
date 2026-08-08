import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../theme/colors';
import { type } from '../theme/typography';
import { Driver } from '../types';

const DriverCard = ({ driver }: { driver: Driver | null }) => {
  if (!driver) return null;

  const full = Math.floor(driver.rating ?? 0);

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{driver.name.charAt(0).toUpperCase()}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {driver.name}
        </Text>
        <Text style={styles.vehicle} numberOfLines={1}>
          {driver.vehicle}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.stars}>
            {Array.from({ length: 5 }, (_, i) => (
              <Ionicons
                key={i}
                name={i < full ? 'star' : 'star-outline'}
                size={12}
                color={COLORS.primaryDark}
              />
            ))}
          </View>
          <Text style={styles.rating}>{Number(driver.rating).toFixed(1)}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.idText}>{driver.id}</Text>
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
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Sora_700Bold',
    fontSize: 18,
    color: COLORS.ink,
  },
  info: { flex: 1, gap: 2 },
  name: { ...type.label, fontSize: 16 },
  vehicle: { ...type.caption },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  stars: { flexDirection: 'row', gap: 1, marginRight: 2 },
  rating: {
    ...type.caption,
    color: COLORS.textPrimary,
    fontFamily: 'DMSans_700Bold',
  },
  metaDot: { ...type.caption },
  idText: {
    ...type.caption,
    fontFamily: 'DMSans_700Bold',
    color: COLORS.ink,
  },
});

export default DriverCard;
