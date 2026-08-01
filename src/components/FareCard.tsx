// ============================================================
// FARE CARD COMPONENT
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../theme/colors';

const FareCard = ({ from, to, fare }: { from: string | null; to: string | null; fare: number }) => {
  if (!from || !to || fare == null) return null;

  return (
    <View style={styles.card}>
      <View style={styles.route}>
        <View style={styles.locationBadge}>
          <Ionicons name="location" size={16} color={COLORS.textPrimary} />
          <Text style={styles.locationText}>{from}</Text>
        </View>

        <View style={styles.arrow}>
          <View style={styles.arrowLine} />
          <Ionicons name="arrow-forward" size={18} color={COLORS.textMuted} />
        </View>

        <View style={styles.locationBadge}>
          <Ionicons name="flag" size={16} color={COLORS.primaryDark} />
          <Text style={styles.locationText}>{to}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.fareRow}>
        <View>
          <Text style={styles.fareLabel}>FIXED FARE</Text>
          <Text style={styles.fareNote}>UCC Campus Transport</Text>
        </View>
        <View style={styles.fareBadge}>
          <Text style={styles.fareCurrency}>GH₵</Text>
          <Text style={styles.fareAmount}>{fare}</Text>
        </View>
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
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: 6,
  },
  locationText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
  },
  arrow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  arrowLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },
  fareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fareLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  fareNote: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
    fontWeight: '500',
  },
  fareBadge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  fareCurrency: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    marginTop: 2,
  },
  fareAmount: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    marginLeft: 2,
  },
});

export default FareCard;
