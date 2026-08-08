import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';
import paymentService from '../../services/paymentService';
import Header from '../../components/Header';
import DriverCard from '../../components/DriverCard';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { type } from '../../theme/typography';
import { MoMoProvider } from '../../types';

const PROVIDERS: {
  id: MoMoProvider;
  name: string;
  logo: ImageSourcePropType;
}[] = [
  {
    id: 'MTN',
    name: 'MTN MoMo',
    logo: require('../../../assets/brand/mtn-momo.png'),
  },
  {
    id: 'TELECEL',
    name: 'Telecel Cash',
    logo: require('../../../assets/brand/telecel-cash.png'),
  },
];

const ConfirmTripScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { from, to, fare, driver } = route.params;
  const { currentUser, refreshTrips } = useApp();

  const [provider, setProvider] = useState<MoMoProvider>('MTN');
  const [momoPhone, setMomoPhone] = useState('0551234987');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');

  const fareLabel = `GH₵${Number(fare).toFixed(2)}`;

  const handlePay = async () => {
    if (!momoPhone.trim() || momoPhone.length < 9) {
      setError('Enter a valid Mobile Money number');
      return;
    }
    if (!currentUser) {
      setError('Session expired. Please log in again.');
      return;
    }
    setError('');
    setLoading(true);
    setLoadingStep('Starting MoMo charge…');

    try {
      const paymentResult = await paymentService.processMoMoPayment({
        provider,
        phone: momoPhone,
        amount: fare,
        driverCode: driver.id,
        from,
        to,
        onStatus: (msg) => setLoadingStep(msg),
      });

      if (!paymentResult.success || !paymentResult.transaction) {
        setError(paymentResult.error || 'Payment failed.');
        setLoading(false);
        setLoadingStep('');
        return;
      }

      setLoadingStep('Confirming payment…');
      await refreshTrips();
      setLoading(false);
      setLoadingStep('');

      navigation.navigate('PaymentSuccess', {
        transaction: paymentResult.transaction,
        driver,
      });
    } catch (err: any) {
      setLoading(false);
      setLoadingStep('');
      setError(err?.message || 'Something went wrong. Try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <Header title="Confirm payment" onBack={() => navigation.goBack()} transparent />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(350)} style={styles.amountHero}>
            <Text style={styles.amountLabel}>You are paying</Text>
            <Text style={styles.amountValue}>{fareLabel}</Text>
            <Text style={styles.amountHint}>to {driver?.name ?? 'driver'}</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(40).duration(400)} style={styles.card}>
            <Text style={styles.cardLabel}>Route</Text>
            <View style={styles.stops}>
              <View style={styles.stopRow}>
                <View style={styles.iconWell}>
                  <Ionicons name="locate-outline" size={14} color={COLORS.textSecondary} />
                </View>
                <View style={styles.stopCopy}>
                  <Text style={styles.stopCaption}>From</Text>
                  <Text style={styles.stopText} numberOfLines={1}>
                    {from}
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
                    {to}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(80).duration(400)} style={styles.block}>
            <Text style={styles.cardLabel}>Paying</Text>
            <DriverCard driver={driver} />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(120).duration(400)} style={styles.block}>
            <Text style={styles.cardLabel}>Pay with</Text>
            <View style={styles.providerRow}>
              {PROVIDERS.map((p) => {
                const active = provider === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.providerTile, active && styles.providerTileActive]}
                    onPress={() => setProvider(p.id)}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel={p.name}
                    accessibilityState={{ selected: active }}
                  >
                    <Image source={p.logo} style={styles.providerLogo} resizeMode="cover" />
                  </TouchableOpacity>
                );
              })}
            </View>

            <Input
              label="Mobile money number"
              placeholder="+233 XX XXX XXXX"
              value={momoPhone}
              onChangeText={(t) => {
                setMomoPhone(t);
                if (error) setError('');
              }}
              keyboardType="phone-pad"
              iconName="call-outline"
              style={{ marginTop: SPACING.md }}
              editable={!loading}
            />

            <View style={styles.securityNote}>
              <Ionicons name="lock-closed-outline" size={14} color={COLORS.textMuted} />
              <Text style={styles.securityText}>
                Test mode: select MTN and use 0551234987. Telecel needs live Paystack keys + a real Telecel number.
              </Text>
            </View>
          </Animated.View>

          {!!error && (
            <Animated.View entering={FadeInDown.duration(220)} style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          )}
        </ScrollView>

        <Animated.View entering={FadeInUp.delay(160).duration(400)} style={styles.footer}>
          <Button
            title={loading ? loadingStep || 'Processing…' : `Pay ${fareLabel}`}
            variant="ink"
            onPress={handlePay}
            loading={loading}
            disabled={loading}
            icon={
              !loading ? (
                <Ionicons name="phone-portrait-outline" size={18} color={COLORS.white} />
              ) : undefined
            }
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    gap: SPACING.lg,
  },

  amountHero: {
    alignItems: 'center',
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
    gap: 4,
  },
  amountLabel: { ...type.caption },
  amountValue: {
    fontFamily: 'Sora_700Bold',
    fontSize: 40,
    color: COLORS.ink,
    letterSpacing: -1.2,
  },
  amountHint: { ...type.body, color: COLORS.textSecondary },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  cardLabel: { ...type.label },
  block: { gap: SPACING.sm },

  stops: { gap: 0 },
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
    height: 14,
    backgroundColor: COLORS.border,
    marginLeft: 15,
    marginVertical: 4,
    borderRadius: 1,
  },

  providerRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  providerTile: {
    width: 72,
    height: 72,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  providerTileActive: {
    borderColor: COLORS.ink,
  },
  providerLogo: {
    width: '100%',
    height: '100%',
  },

  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 4,
  },
  securityText: {
    ...type.caption,
    flex: 1,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.errorLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.error + '33',
  },
  errorText: {
    ...type.caption,
    flex: 1,
    color: COLORS.error,
    fontFamily: 'DMSans_700Bold',
  },

  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
});

export default ConfirmTripScreen;
