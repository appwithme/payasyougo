// ============================================================
// BOOK TRIP SCREEN
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
import Header from '../../components/Header';
import RouteSelector from '../../components/RouteSelector';
import FareCard from '../../components/FareCard';
import Button from '../../components/Button';
import { COLORS, FONT_SIZE, SPACING } from '../../theme/colors';

import { RouteInfo } from '../../types';

const BookTripScreen = ({ navigation }: { navigation: any }) => {
  const [selectedRoute, setSelectedRoute] = useState<{
    from: string | null;
    to: string | null;
    route: RouteInfo | null;
  }>({
    from: null,
    to: null,
    route: null,
  });

  const canContinue = selectedRoute.route != null;

  const handleContinue = () => {
    if (selectedRoute.route) {
      navigation.navigate('EnterDriverId', {
        from:  selectedRoute.from,
        to:    selectedRoute.to,
        fare:  selectedRoute.route.fare,
        routeId: selectedRoute.route.id,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <Header title="Make Payment" onBack={() => navigation.goBack()} transparent />

      <ScrollView
        contentContainerStyle={styles.scroll} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Select Your Route</Text>
        <Text style={styles.sublabel}>
          Choose your pickup and destination from the available UCC routes
        </Text>

        <View style={styles.selectorWrapper}>
          <RouteSelector onRouteChange={setSelectedRoute} />
        </View>

        {canContinue && (
          <View style={styles.fareSection}>
            <Text style={styles.label}>Trip Fare</Text>
            <FareCard
              from={selectedRoute.from}
              to={selectedRoute.to}
              fare={selectedRoute.route!.fare}
            />
          </View>
        )}

        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!canContinue}
          style={styles.btn}
        />

        {!canContinue && (
          <Text style={styles.tip}>
            Select a valid route above to see the fare and continue.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 40 },
  label: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
  },
  sublabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 22,
    marginTop: 4,
    fontWeight: '500',
  },
  selectorWrapper: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  fareSection: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  btn: { marginTop: SPACING.md },
  tip: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    textAlign: 'center',
    marginTop: SPACING.md,
    fontWeight: '500',
  },
});

export default BookTripScreen;
