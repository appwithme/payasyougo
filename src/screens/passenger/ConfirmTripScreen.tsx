import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
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

const ConfirmTripScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { from, to, fare, driver } = route.params;
  const { currentUser, refreshTrips } = useApp();

  const [provider, setProvider] = useState<MoMoProvider>('MTN');
  const [momoPhone, setMomoPhone] = useState(currentUser?.phone || '');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');

  const providers: { id: MoMoProvider; name: string; color: string }[] = [
    { id: 'MTN', name: 'MTN MoMo', color: '#FFCC00' },
    { id: 'VODAFONE', name: 'Telecel Cash', color: '#E60000' },
    { id: 'AIRTELTIGO', name: 'AT Money', color: '#003399' },
  ];

  const handlePay = async () => {
    if (!momoPhone.trim() || momoPhone.length < 9) {
      setError('Please enter a valid Mobile Money number');
      return;
    }
    if (!currentUser) {
      setError('User session expired. Please log in again.');
      return;
    }
    setError('');
    setLoading(true);
    setLoadingStep(`Authorizing on ${provider}...`);

    try {
      const paymentResult = await paymentService.processMoMoPayment({
        provider,
        phone: momoPhone,
        amount: fare,
        driverCode: driver.id,
        from,
        to,
        onStatus: setLoadingStep,
      });

      if (!paymentResult.success || !paymentResult.transaction) {
        setError(paymentResult.error || 'Payment failed.');
        setLoading(false);
        return;
      }

      await refreshTrips();
      setLoading(false);

      navigation.navigate('PaymentSuccess', {
        transaction: paymentResult.transaction,
        driver,
      });
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'An unexpected error occurred.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <Header title="Confirm payment" onBack={() => navigation.goBack()} transparent />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(350)} style={styles.section}>
          <Text style={styles.sectionLabel}>Trip</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryRoute}>
              {from} → {to}
            </Text>
            <Text style={styles.summaryFare}>GH₵{fare}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(60).duration(400)} style={styles.section}>
          <Text style={styles.sectionLabel}>Driver</Text>
          <DriverCard driver={driver} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(120).duration(400)} style={styles.section}>
          <Text style={styles.sectionLabel}>Mobile money</Text>
          <View style={styles.providerGrid}>
            {providers.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.providerBtn,
                  provider === p.id && styles.providerBtnActive,
                  provider === p.id && { borderColor: p.color },
                ]}
                onPress={() => setProvider(p.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.radio,
                    provider === p.id && { borderColor: p.color },
                  ]}
                >
                  {provider === p.id && (
                    <View style={[styles.radioFill, { backgroundColor: p.color }]} />
                  )}
                </View>
                <Text style={styles.providerName}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Mobile money number"
            placeholder="+233 XX XXX XXXX"
            value={momoPhone}
            onChangeText={setMomoPhone}
            keyboardType="phone-pad"
            iconName="call-outline"
            style={{ marginTop: SPACING.md }}
          />

          <View style={styles.securityNote}>
            <Ionicons name="lock-closed-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.securityText}>
              A prompt will appear on your phone. We never store your PIN.
            </Text>
          </View>
        </Animated.View>

        {!!error && (
          <Animated.View entering={FadeInDown.duration(250)} style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.delay(180).duration(400)} style={styles.footer}>
          <Button
            title={loading ? loadingStep : `Pay GH₵${fare} with MoMo`}
            onPress={handlePay}
            loading={loading}
            style={styles.btn}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 40 },

  section: {
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  sectionLabel: { ...type.label },

  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryRoute: { ...type.bodyBold, flex: 1, marginRight: SPACING.md },
  summaryFare: {
    fontFamily: 'Sora_700Bold',
    fontSize: 20,
    color: COLORS.ink,
  },

  providerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  providerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  providerBtnActive: {
    backgroundColor: COLORS.surfaceAlt,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: COLORS.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  providerName: { ...type.label, fontSize: 13 },

  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  securityText: {
    ...type.caption,
    flex: 1,
    color: COLORS.textSecondary,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.errorLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.error + '44',
  },
  errorText: {
    ...type.caption,
    flex: 1,
    color: COLORS.error,
    fontFamily: 'DMSans_700Bold',
  },

  footer: {
    marginTop: SPACING.sm,
  },
  btn: { marginBottom: SPACING.md },
});

export default ConfirmTripScreen;
