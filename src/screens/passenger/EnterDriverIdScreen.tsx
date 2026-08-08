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
import Header from '../../components/Header';
import Input from '../../components/Input';
import DriverCard from '../../components/DriverCard';
import Button from '../../components/Button';
import { lookupDriver } from '../../services/driversService';
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../../theme/colors';
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
      <Header title="Driver Details" onBack={() => navigation.goBack()} transparent />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.tripSummary}>
          <Ionicons name="map" size={20} color={COLORS.primaryDark} />
          <Text style={styles.tripSummaryText}>
            {from} → {to}
          </Text>
          <View style={styles.fareBadge}>
            <Text style={styles.fareText}>GH₵{fare}</Text>
          </View>
        </View>

        <Text style={styles.title}>Enter Driver ID</Text>
        <Text style={styles.subtitle}>
          Ask your driver for their unique ID (shown on their profile) to link the payment.
        </Text>

        <View style={styles.inputWrap}>
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
        </View>

        {foundDriver && (
          <View style={styles.driverSection}>
            <Text style={styles.foundLabel}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} /> Driver Found
            </Text>
            <DriverCard driver={foundDriver} />
          </View>
        )}

        <Button
          title="Continue to Payment"
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
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    ...SHADOW.sm,
  },
  tripSummaryText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
  },
  fareBadge: {
    backgroundColor: COLORS.primaryMuted,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  fareText: { color: COLORS.ink, fontWeight: '800', fontSize: FONT_SIZE.sm },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.base,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  inputWrap: { marginBottom: SPACING.lg },
  looking: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  lookingText: { color: COLORS.textMuted, fontSize: FONT_SIZE.sm },
  driverSection: { marginBottom: SPACING.lg, gap: SPACING.sm },
  foundLabel: {
    color: COLORS.success,
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
});

export default EnterDriverIdScreen;
