import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';
import TransactionCard from '../../components/TransactionCard';
import { fetchRoutes } from '../../services/routesService';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';
import { RouteInfo } from '../../types';

const PassengerDashboardScreen = ({ navigation }: { navigation: any }) => {
  const { currentUser, passengerTrips } = useApp();
  const recentTrips = passengerTrips.slice(0, 3);
  const firstName = currentUser?.name?.split(' ')[0] || 'Passenger';
  const [quickRoutes, setQuickRoutes] = useState<RouteInfo[]>([]);

  useEffect(() => {
    fetchRoutes()
      .then((data) => setQuickRoutes(data.routes.slice(0, 4)))
      .catch(() => setQuickRoutes([]));
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Hi, {firstName}</Text>
            <Text style={styles.subGreeting}>Where are you headed?</Text>
          </View>
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => navigation.navigate('PassengerProfile')}
          >
            <Text style={styles.avatarText}>{firstName.charAt(0)}</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(80).duration(450)}>
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => navigation.navigate('BookTrip')}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaCard}
            >
              <View style={styles.ctaLeft}>
                <View style={styles.ctaIconWrap}>
                  <Ionicons name="navigate" size={26} color={COLORS.ink} />
                </View>
                <View>
                  <Text style={styles.ctaTitle}>Book a ride</Text>
                  <Text style={styles.ctaSubtitle}>Pick a route · pay with MoMo</Text>
                </View>
              </View>
              <View style={styles.ctaArrow}>
                <Ionicons name="arrow-forward" size={20} color={COLORS.ink} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick routes</Text>
          <View style={styles.routesGrid}>
            {quickRoutes.map((r, i) => (
              <TouchableOpacity
                key={`${r.from}-${r.to}`}
                style={styles.routeCard}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('BookTrip')}
              >
                <View style={styles.routeMeta}>
                  <Ionicons name="git-commit-outline" size={16} color={COLORS.primaryDark} />
                  <Text style={styles.routeFromTo} numberOfLines={2}>
                    {r.from} → {r.to}
                  </Text>
                </View>
                <Text style={styles.routeFare}>GH₵{r.fare.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent trips</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TripHistory')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {recentTrips.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="bus-outline" size={40} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No trips yet — book your first campus ride.</Text>
            </View>
          ) : (
            recentTrips.map((trip) => (
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
  scroll: { padding: SPACING.lg, paddingBottom: 110 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  greeting: { ...type.heading },
  subGreeting: { ...type.caption, marginTop: 4 },
  avatarBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 18,
    fontFamily: 'Sora_700Bold',
  },

  ctaCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    ...SHADOW.md,
  },
  ctaLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  ctaIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTitle: { ...type.subheading, color: COLORS.ink },
  ctaSubtitle: { ...type.caption, color: COLORS.ink, opacity: 0.7, marginTop: 2 },
  ctaArrow: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(26,26,26,0.08)',
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
  sectionTitle: { ...type.subheading, marginBottom: SPACING.md },
  seeAll: { ...type.label, color: COLORS.textSecondary },

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
    gap: SPACING.sm,
  },
  routeMeta: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  routeFromTo: {
    ...type.caption,
    color: COLORS.textPrimary,
    flex: 1,
    fontFamily: 'DMSans_700Bold',
  },
  routeFare: {
    fontFamily: 'Sora_700Bold',
    fontSize: 20,
    color: COLORS.ink,
  },

  empty: {
    alignItems: 'center',
    padding: SPACING.xl,
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: { ...type.caption, textAlign: 'center' },
});

export default PassengerDashboardScreen;
