import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';
import TransactionCard from '../../components/TransactionCard';
import Button from '../../components/Button';
import UserAvatar from '../../components/UserAvatar';
import { fetchFare } from '../../services/routesService';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';
import { useTabBarPadding } from '../../navigation/FloatingTabBar';
import { Transaction } from '../../types';

const MOMO_ICON = require('../../../assets/brand/momo-icon.png');

const PassengerDashboardScreen = ({ navigation }: { navigation: any }) => {
  const { currentUser, passengerTrips } = useApp();
  const tabPad = useTabBarPadding();
  const recentTrips = passengerTrips.slice(0, 3);
  const firstName = currentUser?.name?.split(' ')[0] || 'Passenger';
  const avatar =
    currentUser && 'avatar' in currentUser ? currentUser.avatar : null;
  const [rebookingId, setRebookingId] = useState<string | null>(null);

  const handleRebook = async (trip: Transaction) => {
    if (rebookingId) return;
    setRebookingId(trip.id);
    try {
      const route = await fetchFare(trip.from, trip.to);
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
        err?.message || 'Pick this route again from Book.'
      );
    } finally {
      setRebookingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.greeting}>Hi, {firstName}</Text>
          <Text style={styles.subGreeting}>Pay a campus fare</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('PassengerProfile')}
          activeOpacity={0.85}
        >
          <UserAvatar name={currentUser?.name} uri={avatar} size={48} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabPad }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.delay(80).duration(450)} style={styles.payCard}>
          <View style={styles.payCardHeader}>
            <Image source={MOMO_ICON} style={styles.momoIcon} resizeMode="cover" />
            <View style={styles.payCopy}>
              <Text style={styles.payTitle}>Pay for a ride</Text>
              <Text style={styles.paySubtitle}>Choose a route, then pay with MoMo</Text>
            </View>
          </View>

          <Button
            title="Select route"
            variant="ink"
            onPress={() => navigation.navigate('BookTrip')}
            icon={<Ionicons name="arrow-forward" size={18} color={COLORS.white} />}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(160).duration(450)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recent trips</Text>
              {recentTrips.length > 0 ? (
                <Text style={styles.sectionHint}>
                  {passengerTrips.length} total
                </Text>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('HistoryTab' as never)}
              hitSlop={8}
            >
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {recentTrips.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No trips yet</Text>
              <Text style={styles.emptyText}>
                After you pay a fare, it shows up here.
              </Text>
            </View>
          ) : (
            <View style={styles.tripList}>
              {            recentTrips.map((trip, i) => (
              <Animated.View
                key={trip.id}
                entering={FadeInUp.delay(200 + i * 50).duration(380)}
              >
                  <TransactionCard
                    item={trip}
                    mode="passenger"
                    last={i === recentTrips.length - 1}
                    onRebook={handleRebook}
                  />
              </Animated.View>
            ))}
            </View>
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
  scroll: { padding: SPACING.lg },
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
  momoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
  },
  payCopy: { flex: 1 },
  payTitle: { ...type.subheading },
  paySubtitle: { ...type.caption, marginTop: 2 },
  section: { marginBottom: SPACING.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  sectionTitle: { ...type.subheading },
  sectionHint: {
    ...type.caption,
    marginTop: 2,
    fontSize: 12,
  },
  seeAll: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    color: COLORS.ink,
    marginTop: 4,
  },
  tripList: {
    marginTop: 4,
  },
  empty: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    gap: 4,
  },
  emptyTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 15,
    color: COLORS.ink,
  },
  emptyText: { ...type.caption },
});

export default PassengerDashboardScreen;
