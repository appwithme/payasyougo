// ============================================================
// TRANSACTION HISTORY SCREEN
// ============================================================
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import TransactionCard from '../../components/TransactionCard';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../../theme/colors';
import { useTabBarPadding } from '../../navigation/FloatingTabBar';

const TransactionHistoryScreen = ({ navigation }: { navigation: any }) => {
  const { driverTransactions, getDriverData } = useApp();
  const tabPad = useTabBarPadding();
  const driver = getDriverData();
  const totalEarned = driverTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <Header
        title="Transaction History"
        subtitle={`${driverTransactions.length} payments received`}
        onBack={(navigation.getState()?.index ?? 0) > 0 ? () => navigation.goBack() : undefined}
      />

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{driverTransactions.length}</Text>
          <Text style={styles.summaryLabel}>Total Payments</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, styles.highlight]}>
            GH₵{totalEarned}
          </Text>
          <Text style={styles.summaryLabel}>Total Earned</Text>
        </View>
      </View>

      {driverTransactions.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="cash-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>No Transactions</Text>
          <Text style={styles.emptySubtitle}>
            When passengers pay you, the transactions will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={driverTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TransactionCard
              item={item}
              mode="driver"
              last={index === driverTransactions.length - 1}
            />
          )}
          contentContainerStyle={[styles.list, { paddingBottom: tabPad }]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  summary: {
    flexDirection: 'row',
    backgroundColor: COLORS.successLight + '33',
    margin: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.successLight,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
  },
  highlight: {
    color: COLORS.success,
  },
  summaryLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 4,
    fontWeight: '600',
  },
  divider: {
    width: 2,
    backgroundColor: COLORS.successLight,
    marginHorizontal: SPACING.md,
    borderRadius: 1,
  },
  list: {
    paddingHorizontal: SPACING.lg,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    padding: SPACING.xl,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.base,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default TransactionHistoryScreen;
