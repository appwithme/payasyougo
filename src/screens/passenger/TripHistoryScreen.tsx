import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import TransactionCard from '../../components/TransactionCard';
import { resolveRebookRoute } from '../../services/rebookService';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
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

  const listHeader = (
    <View style={styles.top}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Trips</Text>
        {completed.length > 0 ? (
          <Text style={styles.spent}>
            GH₵{totalSpent.toFixed(0)}
            <Text style={styles.spentUnit}> spent</Text>
          </Text>
        ) : null}
      </View>

      <Text style={styles.meta}>
        {passengerTrips.length === 0
          ? 'Fares you pay show up here'
          : `${passengerTrips.length} total · ${completed.length} paid${
              failedCount ? ` · ${failedCount} failed` : ''
            }`}
      </Text>

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

          <Text style={styles.resultCount}>
            Showing {filtered.length}
            {filtered.length !== passengerTrips.length
              ? ` of ${passengerTrips.length}`
              : ''}
          </Text>
        </>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {passengerTrips.length === 0 ? (
        <View style={styles.page}>
          {listHeader}
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptySubtitle}>
              After you pay a fare, rebook it from here in one tap.
            </Text>
          </View>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.page}>
          {listHeader}
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
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={listHeader}
          renderItem={({ item, index }) => (
            <View>
              <TransactionCard
                item={item}
                mode="passenger"
                last={index === filtered.length - 1}
                onRebook={handleRebook}
              />
              {rebookingId === item.id ? (
                <View style={styles.rebookBusy}>
                  <ActivityIndicator size="small" color={COLORS.ink} />
                  <Text style={styles.rebookBusyText}>Opening route…</Text>
                </View>
              ) : null}
            </View>
          )}
          contentContainerStyle={[styles.page, { paddingBottom: tabPad }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  page: {
    paddingHorizontal: SPACING.lg,
  },
  top: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  title: {
    fontFamily: 'Sora_700Bold',
    fontSize: 28,
    color: COLORS.ink,
    letterSpacing: -0.8,
  },
  spent: {
    fontFamily: 'Sora_700Bold',
    fontSize: 18,
    color: COLORS.ink,
    letterSpacing: -0.3,
  },
  spentUnit: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
    color: COLORS.textMuted,
  },
  meta: {
    ...type.caption,
    marginTop: -4,
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
    paddingVertical: 10,
    marginTop: 4,
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
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
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
  resultCount: {
    ...type.caption,
    fontSize: 12,
    marginTop: 2,
  },
  rebookBusy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: -6,
    marginBottom: 10,
  },
  rebookBusyText: {
    ...type.caption,
    color: COLORS.ink,
  },
  empty: {
    paddingTop: SPACING.lg,
    gap: 6,
  },
  emptyTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 17,
    color: COLORS.ink,
  },
  emptySubtitle: { ...type.caption },
  clearBtn: {
    alignSelf: 'flex-start',
    marginTop: 10,
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
