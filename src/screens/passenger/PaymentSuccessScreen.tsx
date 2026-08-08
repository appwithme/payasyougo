import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Button from '../../components/Button';
import { rateDriverTrip } from '../../services/paymentsService';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { type } from '../../theme/typography';

const PaymentSuccessScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { transaction, driver } = route.params;

  const alreadyRated = transaction?.passengerRating != null;
  const [stars, setStars] = useState<number>(transaction?.passengerRating ?? 0);
  const [submitted, setSubmitted] = useState(alreadyRated);
  const [submitting, setSubmitting] = useState(false);
  const [rateError, setRateError] = useState('');

  const amountLabel = `GH₵${Number(transaction?.amount ?? 0).toFixed(2)}`;
  const driverName = driver?.name ?? 'the driver';
  const firstName = driverName.split(' ')[0];
  const refShort = String(transaction?.paymentRef || transaction?.id || '')
    .replace(/^PAY_/, '')
    .slice(0, 12)
    .toUpperCase();
  const whenLabel =
    [transaction?.date, transaction?.time].filter(Boolean).join(' · ') || '—';

  const line = useSharedValue(0);
  useEffect(() => {
    line.value = withDelay(
      280,
      withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) })
    );
  }, [line]);

  const amberLine = useAnimatedStyle(() => ({
    width: 12 + line.value * 36,
    opacity: 0.35 + line.value * 0.65,
  }));

  const handleSubmitRating = async () => {
    if (!stars || !transaction?.id || submitting) return;
    setRateError('');
    setSubmitting(true);
    try {
      await rateDriverTrip(transaction.id, stars);
      setSubmitted(true);
    } catch (err: any) {
      setRateError(err?.message || 'Could not submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const goHome = () => {
    navigation.popToTop();
    navigation.navigate('HomeTab' as never);
  };
  const goHistory = () => {
    navigation.popToTop();
    navigation.navigate('HistoryTab' as never);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['#15233F', COLORS.ink, '#243654']}
        locations={[0, 0.55, 1]}
        style={styles.hero}
      >
        <SafeAreaView edges={['top']} style={styles.heroSafe}>
          <Animated.Text entering={FadeIn.duration(400)} style={styles.brand}>
            payasyou<Text style={styles.brandGo}>go</Text>
          </Animated.Text>

          <Animated.View entering={FadeInDown.delay(80).duration(450)} style={styles.heroCopy}>
            <Text style={styles.heroStatus}>Payment received</Text>
            <Text style={styles.amount}>{amountLabel}</Text>
            <Animated.View style={[styles.amberRule, amberLine]} />
            <Text style={styles.paidTo}>
              to <Text style={styles.paidName}>{driverName}</Text>
            </Text>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.sheet}>
        <SafeAreaView edges={['bottom']} style={styles.sheetInner}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            bounces={false}
          >
            <Animated.View entering={FadeInUp.delay(120).duration(400)} style={styles.routeRow}>
              <View style={styles.routeCol}>
                <Text style={styles.routeCap}>From</Text>
                <Text style={styles.routeVal} numberOfLines={2}>
                  {transaction?.from}
                </Text>
              </View>
              <Text style={styles.routeSep}>→</Text>
              <View style={[styles.routeCol, styles.routeColEnd]}>
                <Text style={styles.routeCap}>To</Text>
                <Text style={[styles.routeVal, styles.routeValEnd]} numberOfLines={2}>
                  {transaction?.to}
                </Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(180).duration(400)} style={styles.rateBlock}>
              <Text style={styles.sectionTitle}>
                {submitted ? 'Thanks for the rating' : `Rate ${firstName}`}
              </Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <TouchableOpacity
                    key={n}
                    onPress={() => !submitted && setStars(n)}
                    disabled={submitted || submitting}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={`Rate ${n} stars`}
                  >
                    <Ionicons
                      name={n <= stars ? 'star' : 'star-outline'}
                      size={30}
                      color={n <= stars ? COLORS.primary : COLORS.borderStrong}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {!!rateError && <Text style={styles.rateError}>{rateError}</Text>}
              {!submitted && stars > 0 ? (
                <TouchableOpacity
                  style={[styles.submitRate, submitting && styles.submitRateDisabled]}
                  onPress={handleSubmitRating}
                  disabled={submitting}
                  activeOpacity={0.85}
                >
                  {submitting ? (
                    <ActivityIndicator color={COLORS.ink} />
                  ) : (
                    <Text style={styles.submitRateText}>Submit rating</Text>
                  )}
                </TouchableOpacity>
              ) : null}
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(240).duration(400)} style={styles.meta}>
              <MetaRow label="Reference" value={refShort || '—'} />
              <MetaRow label="Driver ID" value={driver?.id || '—'} />
              <MetaRow label="When" value={whenLabel} />
            </Animated.View>
          </ScrollView>

          <Animated.View entering={FadeIn.delay(280).duration(350)} style={styles.footer}>
            <Button title="Back to home" variant="ink" onPress={goHome} />
            <Button title="View trip history" variant="ghost" onPress={goHistory} />
          </Animated.View>
        </SafeAreaView>
      </View>
    </View>
  );
};

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.ink,
  },

  hero: {
    paddingBottom: SPACING.xl,
  },
  heroSafe: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  brand: {
    fontFamily: 'Sora_700Bold',
    fontSize: 15,
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  brandGo: {
    color: COLORS.primary,
  },
  heroCopy: {
    marginTop: SPACING.xl,
    gap: 6,
  },
  heroStatus: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
  },
  amount: {
    fontFamily: 'Sora_700Bold',
    fontSize: 48,
    color: COLORS.white,
    letterSpacing: -1.8,
    marginTop: 2,
  },
  amberRule: {
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  paidTo: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  paidName: {
    fontFamily: 'DMSans_700Bold',
    color: COLORS.white,
  },

  sheet: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    marginTop: -4,
  },
  sheetInner: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.xl,
  },

  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeCol: {
    flex: 1,
    gap: 3,
  },
  routeColEnd: {
    alignItems: 'flex-end',
  },
  routeCap: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: COLORS.textMuted,
  },
  routeVal: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 16,
    color: COLORS.ink,
    letterSpacing: -0.2,
  },
  routeValEnd: {
    textAlign: 'right',
  },
  routeSep: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 16,
    color: COLORS.textMuted,
    marginHorizontal: 4,
    marginTop: 14,
  },

  rateBlock: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 17,
    color: COLORS.ink,
    letterSpacing: -0.2,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 4,
  },
  rateError: {
    ...type.caption,
    color: COLORS.error,
  },
  submitRate: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 4,
  },
  submitRateDisabled: { opacity: 0.5 },
  submitRateText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    color: COLORS.ink,
  },

  meta: {
    gap: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    gap: SPACING.md,
  },
  metaLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: COLORS.textMuted,
  },
  metaValue: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    color: COLORS.ink,
    flexShrink: 1,
    textAlign: 'right',
  },

  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    gap: 2,
  },
});

export default PaymentSuccessScreen;
