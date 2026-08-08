import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, LinearTransition } from 'react-native-reanimated';
import InkSheetScreen from '../../components/InkSheetScreen';
import RouteSelector from '../../components/RouteSelector';
import FareCard from '../../components/FareCard';
import Button from '../../components/Button';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { type } from '../../theme/typography';
import { RouteInfo } from '../../types';
import { useTabBarPadding } from '../../navigation/FloatingTabBar';

const BookTripScreen = ({ navigation }: { navigation: any }) => {
  const tabPad = useTabBarPadding();
  const canGoBack = (navigation.getState()?.index ?? 0) > 0;
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
  const fareLabel = canContinue
    ? `GH₵${Number(selectedRoute.route!.fare).toFixed(2)}`
    : null;

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
    <InkSheetScreen
      hero={
        <Animated.View entering={FadeInDown.delay(60).duration(420)} style={styles.heroBody}>
          {canGoBack ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={20} color={COLORS.white} />
            </TouchableOpacity>
          ) : null}
          <Text style={styles.heroTitle}>Where to?</Text>
          <Text style={styles.heroSub}>Pick campus pickup and drop-off</Text>
          {fareLabel ? (
            <Text style={styles.heroFare}>{fareLabel}</Text>
          ) : null}
        </Animated.View>
      }
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabPad }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.delay(100).duration(420)} style={styles.block}>
          <Text style={styles.panelTitle}>Choose route</Text>
          <RouteSelector onRouteChange={setSelectedRoute} />
        </Animated.View>

        {canContinue ? (
          <Animated.View
            entering={FadeInUp.duration(350)}
            layout={LinearTransition.springify()}
          >
            <FareCard
              from={selectedRoute.from}
              to={selectedRoute.to}
              fare={selectedRoute.route!.fare}
            />
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInUp.delay(160).duration(400)} style={styles.footer}>
          <Button
            title={canContinue ? `Continue · ${fareLabel}` : 'Continue'}
            variant="ink"
            onPress={handleContinue}
            disabled={!canContinue}
            icon={
              canContinue ? (
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              ) : undefined
            }
          />
          {!canContinue ? (
            <Text style={styles.tip}>Select pickup and drop-off to continue.</Text>
          ) : null}
        </Animated.View>
      </ScrollView>
    </InkSheetScreen>
  );
};

const styles = StyleSheet.create({
  heroBody: {
    marginTop: SPACING.lg,
    gap: 6,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: 'Sora_700Bold',
    fontSize: 28,
    color: COLORS.white,
    letterSpacing: -0.8,
  },
  heroSub: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
  },
  heroFare: {
    marginTop: 6,
    fontFamily: 'Sora_700Bold',
    fontSize: 20,
    color: COLORS.primary,
    letterSpacing: -0.4,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    gap: SPACING.lg,
  },
  block: {
    gap: 10,
  },
  panelTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 15,
    color: COLORS.ink,
  },
  footer: {
    gap: 10,
  },
  tip: {
    ...type.caption,
    textAlign: 'center',
  },
});

export default BookTripScreen;
