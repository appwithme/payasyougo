import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';
import TransactionCard from '../../components/TransactionCard';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';

const PassengerDashboardScreen = ({ navigation }: { navigation: any }) => {
  const { currentUser, passengerTrips } = useApp();
  const recentTrips = passengerTrips.slice(0, 3);
  const firstName = currentUser?.name?.split(' ')[0] || 'Passenger';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.greeting}>Hi, {firstName}</Text>
          <Text style={styles.subGreeting}>Pay a campus fare</Text>
        </View>
        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={() => navigation.navigate('PassengerProfile')}
        >
          <Text style={styles.avatarText}>{firstName.charAt(0)}</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.delay(80).duration(450)} style={styles.payCard}>
          <View style={styles.payCardHeader}>
            <View style={styles.payIcon}>
              <Ionicons name="navigate-outline" size={22} color={COLORS.ink} />
            </View>
            <View style={styles.payCopy}>
              <Text style={styles.payTitle}>New payment</Text>
              <Text style={styles.paySubtitle}>Choose a route, then pay with MoMo</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.searchRow}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('BookTrip')}
          >
            <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
            <Text style={styles.searchPlaceholder}>Where are you going?</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(160).duration(450)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent trips</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TripHistory')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {recentTrips.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons name="receipt-outline" size={22} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>No trips yet</Text>
              <Text style={styles.emptyText}>Your payments will appear here.</Text>
            </View>
          ) : (
            recentTrips.map((trip, i) => (
              <Animated.View
                key={trip.id}
                entering={FadeInUp.delay(200 + i * 60).duration(400)}
              >
                <TransactionCard item={trip} mode="passenger" />
              </Animated.View>
            ))
          )}
        </Animated.View>
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
  greeting: { ...type.heading },
  subGreeting: { ...type.caption },
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
  scroll: { padding: SPACING.lg, paddingBottom: 110 },
  payCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
    ...SHADOW.sm,
  },
  payCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  payIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payCopy: { flex: 1 },
  payTitle: { ...type.subheading },
  paySubtitle: { ...type.caption, marginTop: 2 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  searchPlaceholder: {
    ...type.body,
    color: COLORS.textMuted,
    flex: 1,
  },
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
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: { ...type.label },
  emptyText: { ...type.caption, textAlign: 'center' },
});

export default PassengerDashboardScreen;
