// ============================================================
// TRIP HISTORY SCREEN
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
import TransactionCard from '../../components/TransactionCard';
import Header from '../../components/Header';
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../../theme/colors';

const TripHistoryScreen = ({ navigation }: { navigation: any }) => {
  const { passengerTrips } = useApp();

  const totalSpent = passengerTrips.reduce((sum, t) => sum + t.amount, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <Header
        title="Trip History"
        subtitle={`${passengerTrips.length} trips`}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{passengerTrips.length}</Text>
          <Text style={styles.summaryLabel}>Total Trips</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>GH₵{totalSpent}</Text>
          <Text style={styles.summaryLabel}>Total Spent</Text>
        </View>
      </View>

      {passengerTrips.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="car-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>No Trips Yet</Text>
          <Text style={styles.emptySubtitle}>
            Your completed trips will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={passengerTrips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionCard item={item} mode="passenger" />
          )}
          contentContainerStyle={styles.list}
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
    backgroundColor: COLORS.primaryLight + '33',
    margin: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
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
  summaryLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 4,
    fontWeight: '600',
  },
  divider: {
    width: 2,
    backgroundColor: COLORS.primaryLight,
    marginHorizontal: SPACING.md,
    borderRadius: 1,
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
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

export default TripHistoryScreen;
