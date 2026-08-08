import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';
import InkSheetScreen from '../../components/InkSheetScreen';
import TransactionCard from '../../components/TransactionCard';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';
import { useTabBarPadding } from '../../navigation/FloatingTabBar';
import { Transaction } from '../../types';

type Filter = 'all' | 'completed' | 'failed';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Paid' },
  { key: 'failed', label: 'Failed' },
];

const TransactionHistoryScreen = ({ navigation }: { navigation: any }) => {
  const { driverTransactions, refreshTrips } = useApp();
  const tabPad = useTabBarPadding();
  const [filter, setFilter] = useState<Filter>('all');
  const canGoBack = (navigation.getState()?.index ?? 0) > 0;

  useFocusEffect(
    useCallback(() => {
      refreshTrips();
    }, [refreshTrips])
  );

  const filtered = useMemo(() => {
    if (filter === 'all') return driverTransactions;
    return driverTransactions.filter((t) => t.status === filter);
  }, [driverTransactions, filter]);

  const completed = driverTransactions.filter((t) => t.status === 'completed');
  const totalEarned = completed.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <InkSheetScreen
      hero={
        <Animated.View entering={FadeInDown.delay(60).duration(420)} style={styles.heroBody}>
          {canGoBack ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              hitSlop={8}
            >
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          ) : null}
          <Text style={styles.heroTitle}>Payments</Text>
          <Text style={styles.heroMeta}>
            {driverTransactions.length === 0
              ? 'No fares received yet'
              : `${driverTransactions.length} payment${
                  driverTransactions.length === 1 ? '' : 's'
                } received`}
          </Text>

          <View style={styles.heroMetrics}>
            <View style={styles.heroMetric}>
              <Text style={styles.metricLabel}>Completed</Text>
              <Text style={styles.metricValue}>{completed.length}</Text>
            </View>
            <View style={styles.heroMetric}>
              <Text style={styles.metricLabel}>Earned</Text>
              <Text style={styles.metricValue}>GH₵{totalEarned.toFixed(0)}</Text>
            </View>
          </View>
        </Animated.View>
      }
      heroBottom={SPACING.lg}
    >
      <View style={[styles.body, { paddingBottom: tabPad }]}>
        <Animated.View entering={FadeInUp.delay(80).duration(400)} style={styles.filters}>
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No payments here</Text>
            <Text style={styles.emptyText}>
              When passengers pay your driver ID, they show up in this list.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item: Transaction) => item.id}
            renderItem={({ item, index }) => (
              <TransactionCard
                item={item}
                mode="driver"
                last={index === filtered.length - 1}
              />
            )}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </InkSheetScreen>
  );
};

const styles = StyleSheet.create({
  heroBody: {
    marginTop: SPACING.md,
    gap: SPACING.lg,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: -8,
  },
  backText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    color: COLORS.primary,
  },
  heroTitle: {
    fontFamily: 'Sora_700Bold',
    fontSize: 28,
    color: COLORS.white,
    letterSpacing: -0.8,
  },
  heroMeta: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    marginTop: -10,
  },
  heroMetrics: {
    flexDirection: 'row',
    gap: SPACING.xl,
  },
  heroMetric: {
    gap: 4,
  },
  metricLabel: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: COLORS.primary,
  },
  metricValue: {
    fontFamily: 'Sora_700Bold',
    fontSize: 28,
    color: COLORS.white,
    letterSpacing: -0.8,
  },
  body: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    gap: SPACING.md,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  chipText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    color: COLORS.ink,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  list: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
  },
  empty: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
    ...SHADOW.sm,
  },
  emptyTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 16,
    color: COLORS.ink,
  },
  emptyText: { ...type.caption },
});

export default TransactionHistoryScreen;
