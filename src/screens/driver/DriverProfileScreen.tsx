import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';
import InkSheetScreen from '../../components/InkSheetScreen';
import UserAvatar from '../../components/UserAvatar';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';
import { useTabBarPadding } from '../../navigation/FloatingTabBar';

const DriverProfileScreen = ({ navigation }: { navigation: any }) => {
  const { logout, getDriverData } = useApp();
  const tabPad = useTabBarPadding();
  const driver = getDriverData();
  const canGoBack = (navigation.getState()?.index ?? 0) > 0;
  const avatar = driver && 'avatar' in driver ? (driver as any).avatar : null;

  const handleLogout = () => {
    Alert.alert('Log out', 'Sign out of this driver account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < full ? 'star' : 'star-outline'}
        size={16}
        color={COLORS.primary}
      />
    ));
  };

  if (!driver) return null;

  return (
    <InkSheetScreen
      hero={
        <Animated.View entering={FadeInDown.delay(60).duration(420)} style={styles.heroBody}>
          {canGoBack ? (
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.heroCenter}>
            <View style={styles.avatarRing}>
              <UserAvatar name={driver.name} uri={avatar} size={86} radius={28} />
            </View>
            <Text style={styles.heroName}>{driver.name}</Text>
            <Text style={styles.heroRole}>Driver</Text>
            <View style={styles.starsRow}>{renderStars(driver.rating)}</View>
            <Text style={styles.ratingText}>
              {(driver.ratingCount ?? 0) > 0
                ? `${Number(driver.rating).toFixed(1)} · ${driver.ratingCount} passenger ${
                    driver.ratingCount === 1 ? 'rating' : 'ratings'
                  }`
                : 'No passenger ratings yet'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.idHero}
            onPress={() => navigation.navigate('DriverQr')}
            activeOpacity={0.9}
          >
            <View style={styles.idHeroTop}>
              <Text style={styles.idEyebrow}>Your driver ID</Text>
              <View style={styles.qrChip}>
                <Ionicons name="qr-code-outline" size={14} color={COLORS.ink} />
                <Text style={styles.qrChipText}>QR</Text>
              </View>
            </View>
            <Text style={styles.idValue}>{driver.id}</Text>
            <Text style={styles.idHint}>Tap to show QR for passengers</Text>
          </TouchableOpacity>
        </Animated.View>
      }
      heroBottom={SPACING.lg}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabPad }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.delay(100).duration(420)} style={styles.panel}>
          <Text style={styles.panelTitle}>Account</Text>
          <DetailRow icon="call-outline" label="Phone" value={driver.phone || 'Not set'} />
          <View style={styles.rule} />
          <DetailRow icon="mail-outline" label="Email" value={driver.email || 'Not set'} />
          <View style={styles.rule} />
          <DetailRow icon="bus-outline" label="Vehicle" value={driver.vehicle || 'Not set'} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(160).duration(420)} style={styles.actions}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.85}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="create-outline" size={18} color={COLORS.ink} />
            </View>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Edit profile</Text>
              <Text style={styles.actionHint}>Name and phone</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.85}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="settings-outline" size={18} color={COLORS.ink} />
            </View>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Settings</Text>
              <Text style={styles.actionHint}>Notifications and support</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Ionicons name="log-out-outline" size={18} color={COLORS.error} />
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </InkSheetScreen>
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
        <Ionicons name={icon} size={16} color={COLORS.ink} />
      </View>
      <View style={styles.detailCopy}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroBody: {
    marginTop: SPACING.sm,
    gap: SPACING.md,
  },
  backText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    color: COLORS.primary,
  },
  heroCenter: {
    alignItems: 'center',
    gap: 6,
  },
  avatarRing: {
    padding: 4,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 4,
  },
  heroName: {
    fontFamily: 'Sora_700Bold',
    fontSize: 24,
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  heroRole: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 4,
  },
  ratingText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
  },
  idHero: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 6,
  },
  idHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idEyebrow: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: COLORS.primary,
  },
  qrChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  qrChipText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 12,
    color: COLORS.ink,
  },
  idValue: {
    fontFamily: 'Sora_700Bold',
    fontSize: 30,
    color: COLORS.white,
    letterSpacing: 4,
  },
  idHint: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    gap: SPACING.lg,
  },
  panel: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  panelTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 15,
    color: COLORS.ink,
    marginBottom: 4,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginLeft: 48,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCopy: { flex: 1, gap: 2, minWidth: 0 },
  detailLabel: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  detailValue: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    color: COLORS.ink,
  },
  actions: { gap: 12 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCopy: { flex: 1, gap: 2 },
  actionTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 15,
    color: COLORS.ink,
  },
  actionHint: {
    ...type.caption,
    fontSize: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.errorLight,
  },
  logoutText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    color: COLORS.error,
  },
});

export default DriverProfileScreen;
