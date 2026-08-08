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
          <Text style={styles.heroSub}>
            {driverTransactions.length === 0
              ? 'No fares received yet'
              : `${driverTransactions.length} payment${
                  driverTransactions.length === 1 ? '' : 's'
                } received`}
          </Text>

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{completed.length}</Text>
              <Text style={styles.heroStatLabel}>Completed</Text>
            </View>
            <View style={styles.heroStatRule} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>GH₵{totalEarned.toFixed(0)}</Text>
              <Text style={styles.heroStatLabel}>Earned</Text>
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
    gap: 8,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 4,
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
  heroSub: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  heroStatValue: {
    fontFamily: 'Sora_700Bold',
    fontSize: 22,
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  heroStatLabel: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
  },
  heroStatRule: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
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
