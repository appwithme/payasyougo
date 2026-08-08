// ============================================================
// DRIVER PROFILE SCREEN
// ============================================================
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { useTabBarPadding } from '../../navigation/FloatingTabBar';

const DriverProfileScreen = ({ navigation }: { navigation: any }) => {
  const { logout, getDriverData } = useApp();
  const tabPad = useTabBarPadding();
  const driver = getDriverData();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const InfoRow = ({ icon, label, value }: { icon: any; label: string; value?: string | null }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={20} color={COLORS.textPrimary} />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '—'}</Text>
      </View>
    </View>
  );

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < full ? 'star' : 'star-outline'}
        size={18}
        color={COLORS.primaryDark}
      />
    ));
  };

  if (!driver) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <Header title="Driver Profile" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabPad }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{driver.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{driver.name}</Text>
          <View style={styles.roleBadge}>
            <Ionicons name="car-sport" size={14} color={COLORS.textPrimary} />
            <Text style={styles.roleBadgeText}>DRIVER</Text>
          </View>

          <View style={styles.starsRow}>{renderStars(driver.rating)}</View>
          <Text style={styles.ratingText}>{driver.rating} out of 5.0</Text>
        </View>

        <View style={styles.driverIdCard}>
          <View style={styles.driverIdIconWrap}>
            <Ionicons name="qr-code-outline" size={24} color={COLORS.textPrimary} />
          </View>
          <Text style={styles.driverIdLabel}>YOUR UNIQUE DRIVER ID</Text>
          <Text style={styles.driverIdValue}>{driver.id}</Text>
          <Text style={styles.driverIdHint}>
            Passengers need this ID to pay you for trips.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <InfoRow icon="call-outline" label="Phone Number" value={driver.phone} />
          <View style={styles.separator} />
          <InfoRow icon="mail-outline" label="Email" value={driver.email} />
          <View style={styles.separator} />
          <InfoRow icon="bus-outline" label="Vehicle" value={driver.vehicle} />
        </View>

        <Button
          title="Logout"
          variant="danger"
          onPress={handleLogout}
          icon={<Ionicons name="log-out-outline" size={20} color={COLORS.error} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, gap: SPACING.xl },

  avatarSection: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.md,
    borderWidth: 4,
    borderColor: COLORS.primaryLight,
  },
  avatarText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.hero,
    fontWeight: '900',
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    marginTop: SPACING.xs,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight + '55',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  roleBadgeText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },

  driverIdCard: {
    backgroundColor: COLORS.primaryLight + '33',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
  },
  driverIdIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...SHADOW.sm,
  },
  driverIdLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  driverIdValue: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 6,
  },
  driverIdHint: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: SPACING.xs,
  },

  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoText: { flex: 1 },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  infoValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
});

export default DriverProfileScreen;
