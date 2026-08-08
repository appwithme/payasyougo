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
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { type } from '../../theme/typography';

const TripHistoryScreen = ({ navigation }: { navigation: any }) => {
  const { passengerTrips } = useApp();

  const totalSpent = passengerTrips.reduce((sum, t) => sum + t.amount, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <Header
        title="Trip history"
        subtitle={`${passengerTrips.length} trips`}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{passengerTrips.length}</Text>
          <Text style={styles.summaryLabel}>Trips</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>GH₵{totalSpent}</Text>
          <Text style={styles.summaryLabel}>Spent</Text>
        </View>
      </View>

      {passengerTrips.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="bus-outline" size={40} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>No trips yet</Text>
          <Text style={styles.emptySubtitle}>Completed trips will show up here.</Text>
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
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontFamily: 'Sora_700Bold',
    fontSize: 22,
    color: COLORS.ink,
  },
  summaryLabel: { ...type.caption, marginTop: 4 },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.xl,
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: 200,
  },
  emptyTitle: { ...type.subheading },
  emptySubtitle: { ...type.caption, textAlign: 'center' },
});

export default TripHistoryScreen;
