import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Header from '../../components/Header';
import Input from '../../components/Input';
import DriverCard from '../../components/DriverCard';
import Button from '../../components/Button';
import { lookupDriver } from '../../services/driversService';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { type } from '../../theme/typography';
import { Driver } from '../../types';

const EnterDriverIdScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { from, to, fare } = route.params;

  const [driverId, setDriverId] = useState('');
  const [foundDriver, setFoundDriver] = useState<Driver | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [looking, setLooking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (text: string) => {
    const val = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setDriverId(val);
    setFoundDriver(null);
    setNotFound(false);

    if (timer.current) clearTimeout(timer.current);
    if (val.length < 5) return;

    timer.current = setTimeout(async () => {
      setLooking(true);
      try {
        const driver = await lookupDriver(val);
        setFoundDriver(driver);
        setNotFound(false);
      } catch {
        setFoundDriver(null);
        setNotFound(true);
      } finally {
        setLooking(false);
      }
    }, 400);
  };

  const fareLabel = `GH₵${Number(fare).toFixed(2)}`;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <Header title="Link driver" onBack={() => navigation.goBack()} transparent />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(350)} style={styles.tripCard}>
            <View style={styles.tripTop}>
              <Text style={styles.tripLabel}>Your route</Text>
              <Text style={styles.tripFare}>{fareLabel}</Text>
            </View>
            <View style={styles.tripStops}>
              <View style={styles.stopRow}>
                <View style={styles.iconWell}>
                  <Ionicons name="locate-outline" size={14} color={COLORS.textSecondary} />
                </View>
                <Text style={styles.stopText} numberOfLines={1}>
                  {from}
                </Text>
              </View>
              <View style={styles.stopRow}>
                <View style={styles.iconWell}>
                  <Ionicons name="flag-outline" size={14} color={COLORS.textSecondary} />
                </View>
                <Text style={styles.stopText} numberOfLines={1}>
                  {to}
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.hero}>
            <Text style={styles.title}>Who’s driving?</Text>
            <Text style={styles.subtitle}>
              Enter the driver ID shown on their profile to send this fare.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.inputBlock}>
            <Input
              label="Driver ID"
              placeholder="DRV001"
              value={driverId}
              onChangeText={handleSearch}
              iconName="id-card-outline"
              autoCapitalize="characters"
              autoCorrect={false}
              error={notFound ? 'No driver found with this ID' : ''}
            />

            {looking ? (
              <View style={styles.statusRow}>
                <ActivityIndicator size="small" color={COLORS.ink} />
                <Text style={styles.statusText}>Looking up driver…</Text>
              </View>
            ) : null}

            {!looking && driverId.length > 0 && driverId.length < 5 ? (
              <Text style={styles.hint}>Keep typing — IDs are at least 5 characters.</Text>
            ) : null}
          </Animated.View>

          {foundDriver ? (
            <Animated.View entering={FadeInUp.duration(350)} style={styles.driverBlock}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>Paying</Text>
                <Text style={styles.sectionHint}>Verified match</Text>
              </View>
              <DriverCard driver={foundDriver} />
            </Animated.View>
          ) : null}
        </ScrollView>

        <Animated.View entering={FadeInUp.delay(140).duration(400)} style={styles.footer}>
          <Button
            title={foundDriver ? `Continue · ${fareLabel}` : 'Continue to payment'}
            variant="ink"
            onPress={() =>
              navigation.navigate('ConfirmTrip', {
                from,
                to,
                fare,
                driver: foundDriver,
              })
            }
            disabled={!foundDriver}
            icon={
              foundDriver ? (
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              ) : undefined
            }
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    gap: SPACING.lg,
  },

  tripCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  tripTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tripLabel: { ...type.caption },
  tripFare: {
    fontFamily: 'Sora_700Bold',
    fontSize: 18,
    color: COLORS.ink,
  },
  tripStops: { gap: 10 },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWell: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopText: { ...type.bodyBold, flex: 1 },

  hero: { gap: 6 },
  title: { ...type.heading },
  subtitle: { ...type.body },

  inputBlock: { gap: 8 },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: { ...type.caption },
  hint: { ...type.caption },

  driverBlock: { gap: SPACING.sm },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: { ...type.label },
  sectionHint: {
    ...type.caption,
    color: COLORS.success,
    fontFamily: 'DMSans_700Bold',
  },

  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
});

export default EnterDriverIdScreen;
