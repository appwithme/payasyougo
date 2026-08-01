// ============================================================
// PASSENGER DASHBOARD SCREEN
// ============================================================
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
import { useApp } from '../../context/AppContext';
import TransactionCard from '../../components/TransactionCard';
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../../theme/colors';

const PassengerDashboardScreen = ({ navigation }: { navigation: any }) => {
  const { currentUser, passengerTrips } = useApp();
  const recentTrips = passengerTrips.slice(0, 3);
  const firstName = currentUser?.name?.split(' ')[0] || 'Passenger';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Hello, {firstName} 👋</Text>
            <Text style={styles.subGreeting}>Where are you going today?</Text>
          </View>
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => navigation.navigate('PassengerProfile')}
          >
            <Text style={styles.avatarText}>{firstName.charAt(0)}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.ctaCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('BookTrip')}
        >
          <View style={styles.ctaContent}>
            <View style={styles.ctaIconWrap}>
              <Ionicons name="bus" size={32} color={COLORS.textPrimary} />
            </View>
            <View style={styles.ctaTextWrap}>
              <Text style={styles.ctaTitle}>Book a Ride</Text>
              <Text style={styles.ctaSubtitle}>Pay easily via campus wallet</Text>
            </View>
          </View>
          <View style={styles.ctaArrow}>
            <Ionicons name="arrow-forward" size={24} color={COLORS.textPrimary} />
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Routes</Text>
          <View style={styles.routesGrid}>
            {[
              { from: 'Science', to: 'Casford', fare: 3 },
              { from: 'Science', to: 'Ayensu', fare: 3 },
              { from: 'Ayensu', to: 'Science', fare: 3 },
              { from: 'Ayensu', to: 'Casford', fare: 5 },
            ].map((r, i) => (
              <View key={i} style={styles.routeCard}>
                <View style={styles.routeHeader}>
                  <Text style={styles.routeFromTo}>
                    {r.from} <Ionicons name="arrow-forward" size={12} color={COLORS.textMuted} /> {r.to}
                  </Text>
                </View>
                <Text style={styles.routeFare}>GH₵{r.fare}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Trips</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TripHistory')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentTrips.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="car-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No trips yet. Book your first ride!</Text>
            </View>
          ) : (
            recentTrips.map(trip => (
              <TransactionCard key={trip.id} item={trip} mode="passenger" />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 100 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  greeting: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subGreeting: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 4,
    fontWeight: '500',
  },
  avatarBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.sm,
  },
  avatarText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
  },

  ctaCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    ...SHADOW.md,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  ctaIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.sm,
  },
  ctaTextWrap: {},
  ctaTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    marginBottom: 4,
  },
  ctaSubtitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    opacity: 0.8,
  },
  ctaArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  section: { marginBottom: SPACING.xl },
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

  routesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  routeCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
    gap: SPACING.sm,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeFromTo: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  routeFare: {
    color: COLORS.primaryDark,
    fontSize: FONT_SIZE.lg,
    fontWeight: '900',
  },

  empty: {
    alignItems: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default PassengerDashboardScreen;
