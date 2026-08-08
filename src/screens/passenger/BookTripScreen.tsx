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
import { COLORS, SPACING } from '../../theme/colors';
import { type } from '../../theme/typography';
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
        from: selectedRoute.from,
        to: selectedRoute.to,
        fare: selectedRoute.route.fare,
        routeId: selectedRoute.route.id,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <Header title="Make payment" onBack={() => navigation.goBack()} transparent />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Route</Text>
        <Text style={styles.sublabel}>Choose pickup and drop-off</Text>

        <View style={styles.selectorWrapper}>
          <RouteSelector onRouteChange={setSelectedRoute} />
        </View>

        {canContinue && (
          <View style={styles.fareSection}>
            <Text style={styles.sectionLabel}>Fare</Text>
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
          <Text style={styles.tip}>Select a route to continue.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 40 },
  label: { ...type.subheading },
  sublabel: { ...type.caption, marginTop: 4 },
  selectorWrapper: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  fareSection: {
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  sectionLabel: { ...type.label },
  btn: { marginTop: SPACING.md },
  tip: {
    ...type.caption,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});

export default BookTripScreen;
