import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';
import TransactionCard from '../../components/TransactionCard';
import InkSheetScreen from '../../components/InkSheetScreen';
import { resolveRebookRoute } from '../../services/rebookService';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';
import { useTabBarPadding } from '../../navigation/FloatingTabBar';
import { Transaction } from '../../types';

type StatusFilter = 'all' | 'completed' | 'failed' | 'pending';

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Paid' },
  { key: 'failed', label: 'Failed' },
  { key: 'pending', label: 'Pending' },
];

const TripHistoryScreen = ({ navigation }: { navigation: any }) => {
  const { passengerTrips } = useApp();
  const tabPad = useTabBarPadding();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [rebookingId, setRebookingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return passengerTrips.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (!q) return true;
      const hay = [t.from, t.to, t.driverName, t.driverId, t.paymentRef]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [passengerTrips, query, statusFilter]);

  const completed = passengerTrips.filter((t) => t.status === 'completed');
  const totalSpent = completed.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const failedCount = passengerTrips.filter((t) => t.status === 'failed').length;

  const handleRebook = async (trip: Transaction) => {
    if (rebookingId) return;
    setRebookingId(trip.id);
    try {
      const route = await resolveRebookRoute(trip);
      if (!route.fare) {
        Alert.alert('Couldn’t rebook', 'No fare found for this route.');
        return;
      }
      navigation.navigate('BookTab', {
        screen: 'EnterDriverId',
        params: {
          from: route.from,
          to: route.to,
          fare: route.fare,
          routeId: route.id,
          prefillDriverId: trip.driverId,
        },
      });
    } catch (err: any) {
      Alert.alert(
        'Couldn’t rebook',
        err?.message || 'Something went wrong. Try Book instead.'
      );
    } finally {
      setRebookingId(null);
    }
  };

  const tools = (
    <Animated.View entering={FadeInUp.delay(100).duration(420)} style={styles.tools}>
      {passengerTrips.length > 0 ? (
        <>
          <View style={styles.search}>
            <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Route or driver"
              placeholderTextColor={COLORS.textMuted}
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>

          <View style={styles.filters}>
            {FILTERS.map((f) => {
              const active = statusFilter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  onPress={() => setStatusFilter(f.key)}
                  style={[styles.chip, active && styles.chipActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      ) : null}
    </Animated.View>
  );

  const listBody =
    passengerTrips.length === 0 ? (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No trips yet</Text>
        <Text style={styles.emptySubtitle}>
          After you pay a fare, it shows up here.
        </Text>
      </View>
    ) : filtered.length === 0 ? (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No matches</Text>
        <Text style={styles.emptySubtitle}>
          Try another search or clear the status filter.
        </Text>
        <TouchableOpacity
          onPress={() => {
            setQuery('');
            setStatusFilter('all');
          }}
          style={styles.clearBtn}
        >
          <Text style={styles.clearText}>Clear filters</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={styles.listPanel}>
        <Text style={styles.resultCount}>
          Showing {filtered.length}
          {filtered.length !== passengerTrips.length
            ? ` of ${passengerTrips.length}`
            : ''}
        </Text>
        {filtered.map((item, index) => (
          <View key={item.id}>
            <TransactionCard
              item={item}
              mode="passenger"
              last={index === filtered.length - 1}
              onRebook={handleRebook}
              rebooking={rebookingId === item.id}
            />
          </View>
        ))}
      </View>
    );

  return (
    <InkSheetScreen
      hero={
        <Animated.View entering={FadeInDown.delay(60).duration(420)} style={styles.heroBody}>
          <Text style={styles.heroTitle}>Trips</Text>
          <Text style={styles.heroMeta}>
            {passengerTrips.length === 0
              ? 'Fares you pay show up here'
              : `${passengerTrips.length} total · ${completed.length} paid${
                  failedCount ? ` · ${failedCount} failed` : ''
                }`}
          </Text>
          {completed.length > 0 ? (
            <View style={styles.heroMetrics}>
              <View style={styles.heroMetric}>
                <Text style={styles.metricLabel}>Paid</Text>
                <Text style={styles.metricValue}>{completed.length}</Text>
              </View>
              <View style={styles.heroMetric}>
                <Text style={styles.metricLabel}>Spent</Text>
                <Text style={styles.metricValue}>GH₵{totalSpent.toFixed(0)}</Text>
              </View>
            </View>
          ) : null}
        </Animated.View>
      }
    >
      <FlatList
        data={[{ key: 'content' }]}
        keyExtractor={(item) => item.key}
        renderItem={() => (
          <View style={styles.page}>
            {tools}
            {listBody}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: tabPad }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </InkSheetScreen>
  );
};

const styles = StyleSheet.create({
  heroBody: {
    marginTop: SPACING.md,
    gap: SPACING.lg,
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
  page: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    gap: SPACING.md,
  },
  tools: {
    gap: 10,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 11,
    ...SHADOW.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: COLORS.ink,
    padding: 0,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
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
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  listPanel: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  resultCount: {
    ...type.caption,
    fontSize: 12,
    marginBottom: 2,
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
    fontSize: 17,
    color: COLORS.ink,
  },
  emptySubtitle: { ...type.caption },
  clearBtn: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.ink,
  },
  clearText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    color: COLORS.white,
  },
});

export default TripHistoryScreen;
