import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, LinearTransition } from 'react-native-reanimated';
import Header from '../../components/Header';
import RouteSelector from '../../components/RouteSelector';
import FareCard from '../../components/FareCard';
import Button from '../../components/Button';
import { COLORS, SPACING } from '../../theme/colors';
import { type } from '../../theme/typography';
import { RouteInfo } from '../../types';
import { useTabBarPadding } from '../../navigation/FloatingTabBar';

const BookTripScreen = ({ navigation }: { navigation: any }) => {
  const tabPad = useTabBarPadding();
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
      <Header
        title="Where to?"
        onBack={(navigation.getState()?.index ?? 0) > 0 ? () => navigation.goBack() : undefined}
        transparent
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabPad }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={styles.label}>Choose your route</Text>
          <Text style={styles.sublabel}>Pick campus pickup and drop-off</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(80).duration(450)}
          style={styles.selectorWrapper}
        >
          <RouteSelector onRouteChange={setSelectedRoute} />
        </Animated.View>

        {canContinue && (
          <Animated.View
            entering={FadeInUp.duration(350)}
            layout={LinearTransition.springify()}
            style={styles.fareSection}
          >
            <FareCard
              from={selectedRoute.from}
              to={selectedRoute.to}
              fare={selectedRoute.route!.fare}
            />
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.delay(140).duration(400)}>
          <Button
            title="Continue"
            variant="ink"
            onPress={handleContinue}
            disabled={!canContinue}
            style={styles.btn}
          />

          {!canContinue && (
            <Text style={styles.tip}>Select pickup and drop-off to continue.</Text>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg },
  label: { ...type.heading },
  sublabel: { ...type.body, marginTop: 6 },
  selectorWrapper: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  fareSection: {
    marginBottom: SPACING.xl,
  },
  btn: { marginTop: SPACING.sm },
  tip: {
    ...type.caption,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});

export default BookTripScreen;
