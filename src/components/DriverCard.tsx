import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme/colors';
import { type } from '../theme/typography';
import { Driver } from '../types';

const DriverCard = ({ driver }: { driver: Driver | null }) => {
  const [open, setOpen] = useState(false);

  if (!driver) return null;

  const full = Math.floor(driver.rating ?? 0);
  const hasRatings = (driver.ratingCount ?? 0) > 0;
  const ratingLabel = hasRatings ? Number(driver.rating).toFixed(1) : 'New';
  const trips = driver.totalTrips ?? 0;
  const tripLabel = trips === 1 ? '1 trip' : `${trips} trips`;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        accessibilityRole="button"
        accessibilityLabel={`View ${driver.name} details`}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{driver.name.charAt(0).toUpperCase()}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {driver.name}
          </Text>
          <Text style={styles.hint}>Tap for driver details</Text>
        </View>

        <View style={styles.trailing}>
          <View style={styles.ratingPill}>
            {hasRatings ? (
              <Ionicons name="star" size={11} color={COLORS.primaryDark} />
            ) : null}
            <Text style={styles.ratingPillText}>{ratingLabel}</Text>
          </View>
        </View>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setOpen(false)}
            accessibilityRole="button"
            accessibilityLabel="Dismiss driver details"
          />

          <Animated.View entering={FadeInUp.duration(280)} style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.sheetHeader}>
              <View style={styles.sheetAvatar}>
                <Text style={styles.sheetAvatarText}>
                  {driver.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.sheetName}>{driver.name}</Text>
              <View style={styles.idBadge}>
                <Ionicons name="id-card-outline" size={13} color={COLORS.ink} />
                <Text style={styles.idBadgeText}>{driver.id}</Text>
              </View>
            </View>

            <View style={styles.starsRow}>
              {hasRatings ? (
                <>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Ionicons
                      key={i}
                      name={i < full ? 'star' : 'star-outline'}
                      size={16}
                      color={COLORS.primaryDark}
                    />
                  ))}
                  <Text style={styles.starsLabel}>
                    {ratingLabel} · {driver.ratingCount}{' '}
                    {driver.ratingCount === 1 ? 'rating' : 'ratings'}
                  </Text>
                </>
              ) : (
                <Text style={styles.starsLabel}>No passenger ratings yet</Text>
              )}
            </View>

            <View style={styles.detailCard}>
              <DetailRow
                icon="bus-outline"
                label="Vehicle"
                value={driver.vehicle || '—'}
              />
              <View style={styles.separator} />
              <DetailRow
                icon="navigate-outline"
                label="Trips completed"
                value={tripLabel}
              />
              {driver.phone ? (
                <>
                  <View style={styles.separator} />
                  <DetailRow icon="call-outline" label="Phone" value={driver.phone} />
                </>
              ) : null}
            </View>

            <Text style={styles.sheetNote}>
              Confirm this matches the driver before you send payment.
            </Text>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => setOpen(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={16} color={COLORS.textSecondary} />
      </View>
      <View style={styles.detailCopy}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  cardPressed: {
    backgroundColor: COLORS.surfaceAlt,
    borderColor: COLORS.borderStrong,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Sora_700Bold',
    fontSize: 17,
    color: COLORS.white,
  },
  info: { flex: 1, gap: 2 },
  name: { ...type.label, fontSize: 16 },
  hint: { ...type.caption, fontSize: 12 },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  ratingPillText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 12,
    color: COLORS.ink,
  },

  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.overlay,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.sm,
    ...SHADOW.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.borderStrong,
    marginBottom: SPACING.lg,
  },
  sheetHeader: {
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.md,
  },
  sheetAvatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: COLORS.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetAvatarText: {
    fontFamily: 'Sora_700Bold',
    fontSize: 28,
    color: COLORS.white,
  },
  sheetName: {
    ...type.heading,
    textAlign: 'center',
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  idBadgeText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    color: COLORS.ink,
    letterSpacing: 0.3,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: SPACING.lg,
  },
  starsLabel: {
    ...type.caption,
    marginLeft: 6,
    color: COLORS.textSecondary,
  },
  detailCard: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCopy: { flex: 1, gap: 2 },
  detailLabel: { ...type.caption, fontSize: 12 },
  detailValue: { ...type.bodyBold },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
    marginLeft: 48,
  },
  sheetNote: {
    ...type.caption,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  doneBtn: {
    backgroundColor: COLORS.ink,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneBtnText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    color: COLORS.white,
  },
});

export default DriverCard;
