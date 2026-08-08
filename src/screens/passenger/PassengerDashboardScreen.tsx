import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';
import TransactionCard from '../../components/TransactionCard';
import Button from '../../components/Button';
import UserAvatar from '../../components/UserAvatar';
import InkSheetScreen from '../../components/InkSheetScreen';
import { resolveRebookRoute } from '../../services/rebookService';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';
import { useTabBarPadding } from '../../navigation/FloatingTabBar';
import { Transaction } from '../../types';

const PAY_RIDE_ICON = require('../../../assets/brand/pay-ride-icon-outline.png');
const PassengerDashboardScreen = ({ navigation }: { navigation: any }) => {
  const { currentUser, passengerTrips } = useApp();
  const tabPad = useTabBarPadding();
  const recentTrips = passengerTrips.slice(0, 3);
  const completed = passengerTrips.filter((t) => t.status === 'completed');
  const totalSpent = completed.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const firstName = currentUser?.name?.split(' ')[0] || 'Passenger';
  const avatar =
    currentUser && 'avatar' in currentUser ? currentUser.avatar : null;
  const [rebookingId, setRebookingId] = useState<string | null>(null);

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
        err?.message || 'Pick this route again from Book.'
      );
    } finally {
      setRebookingId(null);
    }
  };

  return (
    <InkSheetScreen
      hero={
        <Animated.View entering={FadeInDown.delay(60).duration(420)} style={styles.heroBody}>
          <View style={styles.heroRow}>
            <View style={styles.heroCopy}>
              <Text style={styles.greeting}>Hi, {firstName}</Text>
              <Text style={styles.heroMeta}>Ready for a campus fare?</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfileTab' as never)}
              activeOpacity={0.85}
            >
              <View style={styles.avatarRing}>
                <UserAvatar name={currentUser?.name} uri={avatar} size={48} radius={16} />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      }
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabPad }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.delay(100).duration(420)} style={styles.payCard}>
          <View style={styles.payTop}>
            <View style={styles.payCopy}>
              <Text style={styles.payEyebrow}>MoMo</Text>
              <Text style={styles.payTitle}>Pay for a ride</Text>
              <Text style={styles.paySubtitle}>
                Pick a UCC route and settle with Mobile Money.
              </Text>
            </View>
            <Image
              source={PAY_RIDE_ICON}
              style={styles.payIcon}
              resizeMode="contain"
            />
          </View>
          <Button
            title="Select route"
            variant="primary"
            onPress={() => navigation.navigate('BookTab' as never)}
            icon={<Ionicons name="arrow-forward" size={18} color={COLORS.ink} />}
            style={styles.payBtn}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(160).duration(420)} style={styles.stats}>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>{completed.length}</Text>
            <Text style={styles.statLabel}>Paid trips</Text>
          </View>
          <View style={[styles.statTile, styles.statAccent]}>
            <Text style={styles.statValue}>GH₵{totalSpent.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(420)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent trips</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('HistoryTab' as never)}
              hitSlop={8}
            >
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listPanel}>
            {recentTrips.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No trips yet</Text>
                <Text style={styles.emptyText}>
                  After you pay a fare, it shows up here.
                </Text>
              </View>
            ) : (
              recentTrips.map((trip, i) => (
                <TransactionCard
                  key={trip.id}
                  item={trip}
                  mode="passenger"
                  last={i === recentTrips.length - 1}
                  onRebook={handleRebook}
                  rebooking={rebookingId === trip.id}
                />
              ))
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </InkSheetScreen>
  );
};

const styles = StyleSheet.create({
  heroBody: {
    marginTop: SPACING.md,
    gap: SPACING.lg,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  heroCopy: {
    flex: 1,
    gap: 6,
  },
  greeting: {
    fontFamily: 'Sora_700Bold',
    fontSize: 28,
    color: COLORS.white,
    letterSpacing: -0.8,
  },
  heroMeta: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
  },
  avatarRing: {
    padding: 3,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    gap: SPACING.lg,
  },
  payCard: {
    backgroundColor: COLORS.ink,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.md,
    ...SHADOW.md,
  },
  payTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  payCopy: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  payIcon: {
    width: 88,
    height: 88,
  },
  payEyebrow: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: COLORS.primary,
    marginBottom: 2,
  },
  payTitle: {
    fontFamily: 'Sora_700Bold',
    fontSize: 22,
    color: COLORS.white,
    letterSpacing: -0.4,
  },
  paySubtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 20,
  },
  payBtn: {
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  statTile: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  statAccent: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: 'rgba(245,184,0,0.35)',
  },
  statValue: {
    fontFamily: 'Sora_700Bold',
    fontSize: 22,
    color: COLORS.ink,
    letterSpacing: -0.5,
  },
  statLabel: {
    ...type.caption,
    marginTop: 4,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 17,
    color: COLORS.ink,
  },
  seeAll: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    color: COLORS.ink,
  },
  listPanel: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  empty: {
    paddingVertical: SPACING.lg,
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
