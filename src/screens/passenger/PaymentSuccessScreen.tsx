import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { rateDriverTrip } from '../../services/paymentsService';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';

const PaymentSuccessScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { transaction, driver } = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const alreadyRated = transaction?.passengerRating != null;
  const [stars, setStars] = useState<number>(transaction?.passengerRating ?? 0);
  const [submitted, setSubmitted] = useState(alreadyRated);
  const [submitting, setSubmitting] = useState(false);
  const [rateError, setRateError] = useState('');

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 45,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

  const ReceiptRow = ({
    label,
    value,
    highlight = false,
  }: {
    label: string;
    value: string;
    highlight?: boolean;
  }) => (
    <View style={styles.receiptRow}>
      <Text style={styles.receiptLabel}>{label}</Text>
      <Text style={[styles.receiptValue, highlight && styles.receiptHighlight]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.successSection}>
          <Animated.View style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}>
            <Ionicons name="checkmark" size={48} color={COLORS.white} />
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
            <Text style={styles.successTitle}>Payment sent</Text>
            <Text style={styles.successSubtitle}>
              Fare delivered to {driver?.name ?? 'the driver'}
            </Text>
          </Animated.View>
        </View>

        <Animated.View style={[styles.rateCard, { opacity: fadeAnim }]}>
          <Text style={styles.rateTitle}>
            {submitted ? 'Thanks for rating' : 'Rate your driver'}
          </Text>
          <Text style={styles.rateSubtitle}>
            {submitted
              ? `You rated ${driver?.name ?? 'this driver'} ${stars} out of 5`
              : `How was your ride with ${driver?.name ?? 'this driver'}?`}
          </Text>

          <View style={styles.starsPicker}>
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
                  size={36}
                  color={n <= stars ? COLORS.primaryDark : COLORS.borderStrong}
                />
              </TouchableOpacity>
            ))}
          </View>

          {!!rateError && <Text style={styles.rateError}>{rateError}</Text>}

          {!submitted ? (
            <TouchableOpacity
              style={[styles.submitRate, (!stars || submitting) && styles.submitRateDisabled]}
              onPress={handleSubmitRating}
              disabled={!stars || submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.submitRateText}>Submit rating</Text>
              )}
            </TouchableOpacity>
          ) : null}
        </Animated.View>

        <Animated.View style={[styles.receipt, { opacity: fadeAnim }]}>
          <View style={styles.receiptHeader}>
            <Ionicons name="receipt-outline" size={22} color={COLORS.ink} />
            <Text style={styles.receiptTitle}>Receipt</Text>
          </View>

          <ReceiptRow label="Transaction" value={transaction.id} />
          <View style={styles.divider} />
          <ReceiptRow label="Route" value={`${transaction.from} → ${transaction.to}`} />
          <ReceiptRow label="Driver" value={driver?.name} />
          <ReceiptRow label="Driver ID" value={driver?.id} />
          <ReceiptRow label="Date" value={transaction.date} />
          <ReceiptRow label="Time" value={transaction.time} />
          <View style={styles.divider} />
          <ReceiptRow
            label="Amount paid"
            value={`GH₵${Number(transaction.amount).toFixed(2)}`}
            highlight
          />
          <ReceiptRow label="Status" value="Completed" />
        </Animated.View>

        <Animated.View style={[styles.buttons, { opacity: fadeAnim }]}>
          <Button
            title="View trip history"
            variant="secondary"
            onPress={() => {
              navigation.popToTop();
              navigation.navigate('TripHistory');
            }}
          />
          <Button title="Back to home" variant="ink" onPress={() => navigation.popToTop()} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 40 },
  successSection: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
    gap: SPACING.lg,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 32,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.md,
  },
  successTitle: { ...type.title, textAlign: 'center' },
  successSubtitle: { ...type.body, textAlign: 'center', marginTop: 6 },

  rateCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  rateTitle: { ...type.subheading, textAlign: 'center' },
  rateSubtitle: { ...type.caption, textAlign: 'center', marginBottom: SPACING.sm },
  starsPicker: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: SPACING.sm,
  },
  rateError: {
    ...type.caption,
    color: COLORS.error,
    textAlign: 'center',
  },
  submitRate: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.ink,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: SPACING.xl,
    minWidth: 160,
    alignItems: 'center',
  },
  submitRateDisabled: { opacity: 0.45 },
  submitRateText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    color: COLORS.white,
  },

  receipt: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  receiptTitle: { ...type.subheading },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  receiptLabel: { ...type.caption },
  receiptValue: {
    ...type.label,
    maxWidth: '60%',
    textAlign: 'right',
  },
  receiptHighlight: {
    fontFamily: 'Sora_700Bold',
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  buttons: { gap: SPACING.md },
});

export default PaymentSuccessScreen;
