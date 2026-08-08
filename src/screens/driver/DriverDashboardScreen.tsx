import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';
import WalletCard from '../../components/WalletCard';
import TransactionCard from '../../components/TransactionCard';
import NotificationCard from '../../components/NotificationCard';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
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

  useFocusEffect(
    useCallback(() => {
      refreshDriverWallet();
      refreshTrips();
    }, [refreshDriverWallet, refreshTrips])
  );

  if (!driver) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.greeting}>Hi, {driver.name.split(' ')[0]}</Text>
          <View style={styles.idBadge}>
            <Ionicons name="id-card-outline" size={12} color={COLORS.ink} />
            <Text style={styles.idLabel}>{driver.id}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={() => navigation.navigate('DriverProfile')}
        >
          <Text style={styles.avatarText}>{driver.name.charAt(0)}</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabPad }]}
        showsVerticalScrollIndicator={false}
      >
        {pendingNotification ? (
          <View style={styles.notificationWrap}>
            <NotificationCard
              notification={pendingNotification}
              onDismiss={clearNotification}
              onViewDetails={() => {
                clearNotification();
                navigation.navigate('TransactionHistory');
              }}
            />
          </View>
        ) : null}

        <View style={styles.walletSection}>
          <WalletCard
            balance={driver.walletBalance}
            todayEarnings={driver.todayEarnings}
            totalTrips={driver.totalTrips}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent payments</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {recentTxns.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="cash-outline" size={40} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>Waiting for passenger payments.</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerTitle: { gap: 6 },
  greeting: { ...type.heading },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
  idLabel: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 12,
    color: COLORS.ink,
  },
  avatarBtn: {
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
  scroll: { padding: SPACING.lg },
  notificationWrap: { marginBottom: SPACING.md },
  walletSection: { marginBottom: SPACING.xl },
  section: { marginBottom: SPACING.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: { ...type.subheading },
  seeAll: { ...type.label, color: COLORS.textSecondary },
  empty: {
    alignItems: 'center',
    padding: SPACING.xl,
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: { ...type.caption, textAlign: 'center' },
});

export default DriverDashboardScreen;
