// ============================================================
// ENTER DRIVER ID SCREEN
// ============================================================
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_DRIVERS } from '../../data/mockData';
import Header from '../../components/Header';
import Input from '../../components/Input';
import DriverCard from '../../components/DriverCard';
import Button from '../../components/Button';
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../../theme/colors';

import { Driver } from '../../types';

const EnterDriverIdScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { from, to, fare } = route.params;

  const [driverId, setDriverId] = useState('');
  const [foundDriver, setFoundDriver] = useState<Driver | null>(null);
  const [notFound, setNotFound]       = useState(false);

  const handleSearch = (text: string) => {
    const val = text.toUpperCase();
    setDriverId(val);
    const driver = MOCK_DRIVERS.find(d => d.id === val);
    setFoundDriver(driver || null);
    setNotFound(val.length >= 5 && !driver);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <Header title="Driver Details" onBack={() => navigation.goBack()} transparent />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
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
          Ask your driver for their unique ID (e.g. DRV001) to link the payment.
        </Text>

        <View style={styles.hint}>
          <Ionicons name="bulb" size={20} color={COLORS.primaryDark} />
          <Text style={styles.hintText}>
            Demo IDs: <Text style={styles.hintCode}>DRV001</Text> (Kwame) ·{' '}
            <Text style={styles.hintCode}>DRV002</Text> (Ama)
          </Text>
        </View>

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
          style={styles.btn}
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
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  tripSummaryText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
  },
  fareBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  fareText: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: FONT_SIZE.sm,
  },

  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: SPACING.lg,
  },

  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight + '33',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  hintText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    flex: 1,
    lineHeight: 20,
    fontWeight: '500',
  },
  hintCode: {
    fontWeight: '800',
    fontFamily: 'monospace',
  },

  inputWrap: {
    marginBottom: SPACING.lg,
  },

  driverSection: {
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  foundLabel: {
    color: COLORS.success,
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
  },

  btn: { marginTop: SPACING.sm },
});

export default EnterDriverIdScreen;
