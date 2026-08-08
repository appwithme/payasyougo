import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
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
  const refShort = String(transaction?.paymentRef || transaction?.id || '')
    .replace(/^PAY_/, '')
    .slice(0, 12)
    .toUpperCase();

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

  const goHome = () => navigation.popToTop();
  const goHistory = () => {
    navigation.popToTop();
    navigation.navigate('TripHistory');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(400)} style={styles.hero}>
          <View style={styles.checkWrap}>
            <Ionicons name="checkmark" size={22} color={COLORS.white} />
          </View>
          <Text style={styles.heroLabel}>Payment sent</Text>
          <Text style={styles.amount}>{amountLabel}</Text>
          <Text style={styles.heroHint}>to {driverName}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(60).duration(400)} style={styles.card}>
          <View style={styles.stopRow}>
            <View style={styles.iconWell}>
              <Ionicons name="locate-outline" size={14} color={COLORS.textSecondary} />
            </View>
            <View style={styles.stopCopy}>
              <Text style={styles.stopCaption}>From</Text>
              <Text style={styles.stopText} numberOfLines={1}>
                {transaction?.from}
              </Text>
            </View>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.stopRow}>
            <View style={styles.iconWell}>
              <Ionicons name="flag-outline" size={14} color={COLORS.textSecondary} />
            </View>
            <View style={styles.stopCopy}>
              <Text style={styles.stopCaption}>To</Text>
              <Text style={styles.stopText} numberOfLines={1}>
                {transaction?.to}
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.card}>
          <View style={styles.rateHeader}>
            <Text style={styles.cardLabel}>
              {submitted ? 'Thanks for rating' : 'Rate your driver'}
            </Text>
            {submitted ? (
              <Text style={styles.rateDone}>{stars}.0</Text>
            ) : (
              <Text style={styles.rateHint}>{driverName.split(' ')[0]}</Text>
            )}
          </View>

          <View style={styles.starsPicker}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity
                key={n}
                onPress={() => !submitted && setStars(n)}
                disabled={submitted || submitting}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={`Rate ${n} stars`}
              >
                <Ionicons
                  name={n <= stars ? 'star' : 'star-outline'}
                  size={32}
                  color={n <= stars ? COLORS.primaryDark : COLORS.borderStrong}
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
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.submitRateText}>Submit {stars}-star rating</Text>
              )}
            </TouchableOpacity>
          ) : null}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(140).duration(400)} style={styles.card}>
          <Text style={styles.cardLabel}>Receipt</Text>

          <MetaRow label="Reference" value={refShort || '—'} mono />
          <MetaRow label="Driver" value={driverName} />
          <MetaRow label="Driver ID" value={driver?.id || '—'} mono />
          <MetaRow
            label="When"
            value={[transaction?.date, transaction?.time].filter(Boolean).join(' · ') || '—'}
          />
          <View style={styles.amountRow}>
            <Text style={styles.amountRowLabel}>Amount</Text>
            <Text style={styles.amountRowValue}>{amountLabel}</Text>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Completed</Text>
          </View>
        </Animated.View>
      </ScrollView>

      <Animated.View entering={FadeIn.delay(200).duration(350)} style={styles.footer}>
        <Button title="Back to home" variant="ink" onPress={goHome} />
        <Button title="View trip history" variant="secondary" onPress={goHistory} />
      </Animated.View>
    </SafeAreaView>
  );
};

function MetaRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={[styles.metaValue, mono && styles.metaMono]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    gap: SPACING.md,
  },

  hero: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.sm,
    gap: 6,
  },
  checkWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  heroLabel: { ...type.caption },
  amount: {
    fontFamily: 'Sora_700Bold',
    fontSize: 40,
    color: COLORS.ink,
    letterSpacing: -1.2,
  },
  heroHint: { ...type.body, color: COLORS.textSecondary },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  cardLabel: { ...type.label },

  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWell: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopCopy: { flex: 1, gap: 1 },
  stopCaption: { ...type.caption, fontSize: 11 },
  stopText: { ...type.bodyBold },
  routeLine: {
    width: 2,
    height: 12,
    backgroundColor: COLORS.border,
    marginLeft: 15,
    borderRadius: 1,
  },

  rateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rateHint: { ...type.caption },
  rateDone: {
    fontFamily: 'Sora_700Bold',
    fontSize: 16,
    color: COLORS.ink,
  },
  starsPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: SPACING.sm,
  },
  rateError: {
    ...type.caption,
    color: COLORS.error,
    textAlign: 'center',
  },
  submitRate: {
    backgroundColor: COLORS.ink,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitRateDisabled: { opacity: 0.5 },
  submitRateText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    color: COLORS.white,
  },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    gap: SPACING.md,
  },
  metaLabel: { ...type.caption },
  metaValue: {
    ...type.label,
    flexShrink: 1,
    textAlign: 'right',
  },
  metaMono: {
    fontFamily: 'DMSans_700Bold',
    letterSpacing: 0.3,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  amountRowLabel: { ...type.label },
  amountRowValue: {
    fontFamily: 'Sora_700Bold',
    fontSize: 20,
    color: COLORS.ink,
  },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 12,
    color: COLORS.success,
  },

  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
    gap: SPACING.sm,
  },
});

export default PaymentSuccessScreen;
