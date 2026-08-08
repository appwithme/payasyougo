import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme/colors';
import { type } from '../theme/typography';

const FareCard = ({ from, to, fare }: { from: string | null; to: string | null; fare: number }) => {
  if (!from || !to || fare == null) return null;

  return (
    <View style={styles.card}>
      <View style={styles.route}>
        <View style={styles.locationRow}>
          <View style={styles.iconWell}>
            <Ionicons name="locate-outline" size={16} color={COLORS.textSecondary} />
          </View>
          <View style={styles.locationTextWrap}>
            <Text style={styles.locationLabel}>From</Text>
            <Text style={styles.locationText} numberOfLines={1}>
              {from}
            </Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <View style={styles.iconWell}>
            <Ionicons name="flag-outline" size={16} color={COLORS.textSecondary} />
          </View>
          <View style={styles.locationTextWrap}>
            <Text style={styles.locationLabel}>To</Text>
            <Text style={styles.locationText} numberOfLines={1}>
              {to}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.fareBlock}>
        <Text style={styles.fareLabel}>Fixed fare</Text>
        <Text style={styles.fareAmount}>GH₵{Number(fare).toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
    gap: SPACING.lg,
  },
  route: {
    gap: SPACING.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconWell: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTextWrap: { flex: 1 },
  locationLabel: { ...type.caption, fontSize: 11 },
  locationText: { ...type.bodyBold, marginTop: 1 },
  fareBlock: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fareLabel: { ...type.caption },
  fareAmount: {
    fontFamily: 'Sora_700Bold',
    fontSize: 24,
    color: COLORS.ink,
    letterSpacing: -0.5,
  },
});

export default FareCard;
