import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Header from '../../components/Header';
import Input from '../../components/Input';
import DriverCard from '../../components/DriverCard';
import Button from '../../components/Button';
import { lookupDriver } from '../../services/driversService';
import { COLORS, SPACING } from '../../theme/colors';
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
    const val = text.toUpperCase();
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <Header title="Driver" onBack={() => navigation.goBack()} transparent />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.duration(350)} style={styles.tripSummary}>
          <Text style={styles.tripRoute}>
            {from} → {to}
          </Text>
          <Text style={styles.tripFare}>GH₵{fare}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(60).duration(400)}>
          <Text style={styles.title}>Enter driver ID</Text>
          <Text style={styles.subtitle}>
            Ask your driver for the ID on their profile to link this payment.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.inputWrap}>
          <Input
            label="Driver ID"
            placeholder="e.g. DRV001"
            value={driverId}
            onChangeText={handleSearch}
            iconName="id-card-outline"
            autoCapitalize="characters"
            error={notFound ? 'No driver found with this ID' : ''}
          />
          {looking && (
            <View style={styles.looking}>
              <ActivityIndicator size="small" color={COLORS.ink} />
              <Text style={styles.lookingText}>Looking up driver…</Text>
            </View>
          )}
        </Animated.View>

        {foundDriver && (
          <Animated.View entering={FadeInUp.duration(350)} style={styles.driverSection}>
            <View style={styles.foundRow}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.foundLabel}>Driver found</Text>
            </View>
            <DriverCard driver={foundDriver} />
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.delay(140).duration(400)}>
          <Button
            title="Continue to payment"
            onPress={() =>
              navigation.navigate('ConfirmTrip', {
                from,
                to,
                fare,
                driver: foundDriver,
              })
            }
            disabled={!foundDriver}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 40 },
  tripSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tripRoute: { ...type.bodyBold, flex: 1, marginRight: SPACING.md },
  tripFare: {
    fontFamily: 'Sora_700Bold',
    fontSize: 18,
    color: COLORS.ink,
  },
  title: { ...type.heading },
  subtitle: {
    ...type.body,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  inputWrap: { marginBottom: SPACING.lg },
  looking: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  lookingText: { ...type.caption },
  driverSection: { marginBottom: SPACING.lg, gap: SPACING.sm },
  foundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  foundLabel: {
    ...type.label,
    color: COLORS.success,
  },
});

export default EnterDriverIdScreen;
