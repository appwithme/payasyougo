// ============================================================
// DRIVER DASHBOARD SCREEN
// ============================================================
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import WalletCard from '../../components/WalletCard';
import TransactionCard from '../../components/TransactionCard';
import NotificationCard from '../../components/NotificationCard';
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../../theme/colors';

const DriverDashboardScreen = ({ navigation }: { navigation: any }) => {
  const { getDriverData, driverTransactions, pendingNotification, clearNotification } = useApp();
  const driver = getDriverData();
  const recentTxns = driverTransactions.slice(0, 3);

  if (!driver) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.greeting}>Hello, {driver.name.split(' ')[0]} 👋</Text>
          <View style={styles.idBadge}>
            <Text style={styles.idLabel}>ID: {driver.id}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={() => navigation.navigate('DriverProfile')}
        >
          <Text style={styles.avatarText}>{driver.name.charAt(0)}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Absolute positioned notification for live updates */}
        {pendingNotification && (
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
        )}

        <View style={styles.walletSection}>
          <WalletCard
            balance={driver.walletBalance}
            todayEarnings={driver.todayEarnings}
            totalTrips={driver.totalTrips}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Payments</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentTxns.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="cash-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No payments received today.</Text>
            </View>
          ) : (
            recentTxns.map((txn) => (
              <TransactionCard key={txn.id} item={txn} mode="driver" />
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
  headerTitle: { gap: 4 },
  greeting: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  idBadge: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  idLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.sm,
  },
  avatarText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
  },

  scroll: { padding: SPACING.lg, paddingBottom: 100 },
  walletSection: { marginBottom: SPACING.xl },
  notificationWrap: {
    marginBottom: SPACING.lg,
    zIndex: 10,
  },

  section: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
  },
  seeAll: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },

  empty: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
    gap: SPACING.md,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
});

export default DriverDashboardScreen;
