// ============================================================
// CONFIRM TRIP SCREEN (MoMo Integration)
// ============================================================
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
import { useApp } from '../../context/AppContext';
import paymentService from '../../services/paymentService';
import Header from '../../components/Header';
import DriverCard from '../../components/DriverCard';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { MoMoProvider } from '../../types';

const ConfirmTripScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { from, to, fare, driver } = route.params;
  const { currentUser, refreshTrips } = useApp();

  // MoMo State
  const [provider, setProvider] = useState<MoMoProvider>('MTN');
  const [momoPhone, setMomoPhone] = useState(currentUser?.phone || '');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(''); // E.g., "Waiting for MoMo prompt..."
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
      // Paystack test MoMo via API — persists PENDING → COMPLETED in Neon
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
      <Header title="Confirm Payment" onBack={() => navigation.goBack()} transparent />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TRIP DETAILS</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryRoute}>{from} → {to}</Text>
            <Text style={styles.summaryFare}>GH₵{fare}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DRIVER</Text>
          <DriverCard driver={driver} />
        </View>

        {/* MOBILE MONEY SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>MOBILE MONEY PROVIDER</Text>
          <View style={styles.providerGrid}>
            {providers.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.providerBtn,
                  provider === p.id && { borderColor: p.color, backgroundColor: p.color + '11' }
                ]}
                onPress={() => setProvider(p.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.radio,
                    provider === p.id && { borderColor: p.color }
                  ]}
                >
                  {provider === p.id && <View style={[styles.radioFill, { backgroundColor: p.color }]} />}
                </View>
                <Text style={styles.providerName}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Mobile Money Number"
            placeholder="+233 XX XXX XXXX"
            value={momoPhone}
            onChangeText={setMomoPhone}
            keyboardType="phone-pad"
            iconName="call-outline"
            style={{ marginTop: SPACING.md }}
          />

          <View style={styles.securityNote}>
            <Ionicons name="lock-closed" size={16} color={COLORS.success} />
            <Text style={styles.securityText}>
              A secure authorization prompt will appear on your phone. We never store your PIN.
            </Text>
          </View>
        </View>

        {!!error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Button
            title={loading ? loadingStep : `Pay GH₵${fare} with MoMo`}
            onPress={handlePay}
            loading={loading}
            style={styles.btn}
          />
        </View>
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
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginLeft: SPACING.xs,
  },

  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  summaryRoute: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.base,
    fontWeight: '800',
  },
  summaryFare: {
    color: COLORS.primaryDark,
    fontSize: FONT_SIZE.lg,
    fontWeight: '900',
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
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    ...SHADOW.sm,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  providerName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },

  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.successLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.success + '44',
  },
  securityText: {
    flex: 1,
    color: COLORS.success,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
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
    flex: 1,
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },

  footer: {
    marginTop: SPACING.sm,
  },
  btn: { marginBottom: SPACING.md },
});

export default ConfirmTripScreen;
