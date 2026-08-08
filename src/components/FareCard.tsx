import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../theme/colors';
import { type } from '../theme/typography';

const FareCard = ({ from, to, fare }: { from: string | null; to: string | null; fare: number }) => {
  if (!from || !to || fare == null) return null;

  return (
    <View style={styles.card}>
      <View style={styles.route}>
        <View style={styles.locationRow}>
          <Ionicons name="ellipse" size={8} color={COLORS.ink} />
          <Text style={styles.locationText}>{from}</Text>
        </View>

        <View style={styles.connector} />

        <View style={styles.locationRow}>
          <Ionicons name="ellipse" size={8} color={COLORS.primary} />
          <Text style={styles.locationText}>{to}</Text>
        </View>
      </View>

      <View style={styles.fareBlock}>
        <Text style={styles.fareLabel}>Fixed fare</Text>
        <Text style={styles.fareAmount}>GH₵{fare}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  route: {
    flex: 1,
    gap: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationText: { ...type.bodyBold, flex: 1 },
  connector: {
    width: 1,
    height: 14,
    backgroundColor: COLORS.border,
    marginLeft: 3.5,
  },
  fareBlock: {
    alignItems: 'flex-end',
  },
  fareLabel: { ...type.caption },
  fareAmount: {
    fontFamily: 'Sora_700Bold',
    fontSize: 28,
    color: COLORS.ink,
    letterSpacing: -0.5,
    marginTop: 2,
  },
});

export default FareCard;
