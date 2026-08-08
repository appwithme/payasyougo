import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';
import TransactionCard from '../../components/TransactionCard';
import UserAvatar from '../../components/UserAvatar';
import InkSheetScreen from '../../components/InkSheetScreen';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';
import { useTabBarPadding } from '../../navigation/FloatingTabBar';

const DriverDashboardScreen = ({ navigation }: { navigation: any }) => {
  const {
    getDriverData,
    driverTransactions,
    pendingNotification,
    clearNotification,
    refreshDriverWallet,
    refreshTrips,
  } = useApp();
  const tabPad = useTabBarPadding();
  const driver = getDriverData();
  const recentTxns = driverTransactions.slice(0, 3);
  const completedToday = driverTransactions.filter(
    (t) => t.status === 'completed' && t.date === new Date().toISOString().slice(0, 10)
  ).length;
  const firstName = driver?.name?.split(' ')[0] || 'Driver';
  const avatar = driver && 'avatar' in driver ? (driver as any).avatar : null;

  useFocusEffect(
    useCallback(() => {
      refreshDriverWallet();
      refreshTrips();
    }, [refreshDriverWallet, refreshTrips])
  );

  if (!driver) return null;

  return (
    <InkSheetScreen
      hero={
        <Animated.View entering={FadeInDown.delay(60).duration(420)} style={styles.heroBody}>
          <View style={styles.heroRow}>
            <View style={styles.heroCopy}>
              <Text style={styles.greeting}>Hi, {firstName}</Text>
              <Text style={styles.heroMeta}>Collect campus MoMo fares</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('DriverProfile')}
              activeOpacity={0.85}
            >
              <View style={styles.avatarRing}>
                <UserAvatar name={driver.name} uri={avatar} size={48} radius={16} />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.idBlock}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('DriverQr')}
            accessibilityRole="button"
            accessibilityLabel={`Show QR for driver ID ${driver.id}`}
          >
            <View style={styles.idTop}>
              <Text style={styles.idLabel}>Driver ID</Text>
              <View style={styles.qrChip}>
                <Ionicons name="qr-code-outline" size={14} color={COLORS.ink} />
                <Text style={styles.qrChipText}>QR</Text>
              </View>
            </View>
            <Text style={styles.idValue}>{driver.id}</Text>
            <Text style={styles.idMeta}>Passengers scan your QR or enter this ID</Text>
          </TouchableOpacity>
        </Animated.View>
      }
      heroBottom={SPACING.lg}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabPad }]}
        showsVerticalScrollIndicator={false}
      >
        {pendingNotification ? (
          <Animated.View entering={FadeInUp.duration(350)} style={styles.notificationWrap}>
            <View style={styles.liveBanner}>
              <View style={styles.liveDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.liveTitle}>Payment received</Text>
                <Text style={styles.liveBody}>
                  {pendingNotification.passengerName} · {pendingNotification.from} →{' '}
                  {pendingNotification.to} · +GH₵
                  {Number(pendingNotification.amount).toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  clearNotification();
                  navigation.navigate('TransactionHistory');
                }}
                hitSlop={8}
              >
                <Ionicons name="chevron-forward" size={18} color={COLORS.ink} />
              </TouchableOpacity>
              <TouchableOpacity onPress={clearNotification} hitSlop={8}>
                <Ionicons name="close" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInUp.delay(80).duration(420)}>
          <LinearGradient
            colors={[COLORS.ink, '#2A3F63']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.walletCard}
          >
            <View style={styles.walletOrb} />
            <View style={styles.walletHeader}>
              <View style={styles.walletIcon}>
                <Ionicons name="wallet" size={16} color={COLORS.ink} />
              </View>
              <Text style={styles.walletLabel}>Wallet balance</Text>
            </View>
            <Text style={styles.walletBalance}>
              GH₵{Number(driver.walletBalance || 0).toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.walletLink}
              onPress={() => navigation.navigate('WalletTab')}
              activeOpacity={0.85}
            >
              <Text style={styles.walletLinkText}>Open wallet</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(140).duration(420)} style={styles.stats}>
          <View style={[styles.statTile, styles.statAccent]}>
            <Text style={styles.statValue}>
              GH₵{Number(driver.todayEarnings || 0).toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>{completedToday || 0}</Text>
            <Text style={styles.statLabel}>Trips today</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>{driver.totalTrips ?? 0}</Text>
            <Text style={styles.statLabel}>All trips</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(220).duration(420)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent payments</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('TransactionHistory')}
              hitSlop={8}
            >
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listPanel}>
            {recentTxns.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No payments yet</Text>
                <Text style={styles.emptyText}>
                  When a passenger pays your ID, it shows up here.
                </Text>
              </View>
            ) : (
              recentTxns.map((txn, i) => (
                <TransactionCard
                  key={txn.id}
                  item={txn}
                  mode="driver"
                  last={i === recentTxns.length - 1}
                />
              ))
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </InkSheetScreen>
  );
};

const styles = StyleSheet.create({
  heroBody: {
    marginTop: SPACING.md,
    gap: SPACING.lg,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  heroCopy: {
    flex: 1,
    gap: 4,
  },
  greeting: {
    fontFamily: 'Sora_700Bold',
    fontSize: 28,
    color: COLORS.white,
    letterSpacing: -0.8,
  },
  heroMeta: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
  },
  avatarRing: {
    padding: 3,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  idBlock: {
    gap: 6,
  },
  idTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idLabel: {
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
    fontSize: 42,
    color: COLORS.white,
    letterSpacing: 4,
  },
  idMeta: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    gap: SPACING.lg,
  },
  notificationWrap: {},
  liveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.successLight,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(47,158,106,0.35)',
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.success,
  },
  liveTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 14,
    color: COLORS.ink,
  },
  liveBody: {
    ...type.caption,
    marginTop: 2,
  },
  walletCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    overflow: 'hidden',
    ...SHADOW.md,
    gap: 8,
  },
  walletOrb: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.primary,
    opacity: 0.16,
    top: -36,
    right: -24,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  walletIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletLabel: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.65)',
  },
  walletBalance: {
    fontFamily: 'Sora_700Bold',
    fontSize: 36,
    color: COLORS.white,
    letterSpacing: -1,
  },
  walletLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  walletLinkText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    color: COLORS.primary,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
  },
  statTile: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  statAccent: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: 'rgba(245,184,0,0.35)',
  },
  statValue: {
    fontFamily: 'Sora_700Bold',
    fontSize: 18,
    color: COLORS.ink,
    letterSpacing: -0.4,
  },
  statLabel: {
    ...type.caption,
    marginTop: 4,
    fontSize: 11,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 17,
    color: COLORS.ink,
  },
  seeAll: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    color: COLORS.ink,
  },
  listPanel: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  empty: {
    paddingVertical: SPACING.lg,
    gap: 4,
  },
  emptyTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 15,
    color: COLORS.ink,
  },
  emptyText: { ...type.caption },
});

export default DriverDashboardScreen;
