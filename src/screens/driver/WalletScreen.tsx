import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';
import InkSheetScreen from '../../components/InkSheetScreen';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';
import { useTabBarPadding } from '../../navigation/FloatingTabBar';
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

const WalletScreen = () => {
  const { getDriverData, withdrawDriverFunds, refreshDriverWallet } = useApp();
  const tabPad = useTabBarPadding();
  const driver = getDriverData();

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [provider, setProvider] = useState<MoMoProvider>('MTN');
  const [phone, setPhone] = useState('0551234987');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      refreshDriverWallet();
    }, [refreshDriverWallet])
  );

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    const balance = Number(driver?.walletBalance || 0);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (amount < 1) {
      setError('Minimum withdrawal is GH₵1.00');
      return;
    }
    if (amount > balance + 0.001) {
      setError(`Insufficient balance. Available: GH₵${balance.toFixed(2)}`);
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 9) {
      setError('Enter a valid Mobile Money number');
      return;
    }

    setError('');
    setLoading(true);
    setLoadingStep('Requesting withdrawal…');

    const result = await withdrawDriverFunds({
      amount,
      provider,
      momoPhone: phone.trim(),
      onStatus: setLoadingStep,
    });

    setLoading(false);
    setLoadingStep('');

    if (!result.success) {
      setError(result.error || 'Withdrawal failed');
      return;
    }

    setWithdrawAmount('');
    Alert.alert(
      'Withdrawal sent',
      `GH₵${amount.toFixed(2)} is on its way to your ${provider === 'MTN' ? 'MTN MoMo' : 'Telecel Cash'} wallet.`
    );
  };

  if (!driver) return null;

  const balance = Number(driver.walletBalance || 0);
  const today = Number(driver.todayEarnings || 0);

  return (
    <InkSheetScreen
      hero={
        <Animated.View entering={FadeInDown.delay(60).duration(420)} style={styles.heroBody}>
          <Text style={styles.heroTitle}>Wallet</Text>

          <View style={styles.heroBalance}>
            <Text style={styles.balanceLabel}>Available</Text>
            <Text style={styles.balanceValue}>GH₵{balance.toFixed(2)}</Text>
            <Text style={styles.balanceToday}>
              GH₵{today.toFixed(2)} earned today
            </Text>
          </View>
        </Animated.View>
      }
      heroBottom={SPACING.lg}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabPad }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInUp.delay(80).duration(420)} style={styles.stats}>
          <View style={[styles.statTile, styles.statAccent]}>
            <Text style={styles.statValue}>GH₵{today.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>{driver.totalTrips ?? 0}</Text>
            <Text style={styles.statLabel}>Paid trips</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>GH₵{balance.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(140).duration(420)} style={styles.section}>
          <Text style={styles.sectionTitle}>Withdraw</Text>
          <Text style={styles.sectionHint}>
            Cash out to Mobile Money. Minimum GH₵1.00.
          </Text>

          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <View style={styles.panelIcon}>
                <Ionicons name="phone-portrait-outline" size={16} color={COLORS.ink} />
              </View>
              <Text style={styles.panelHeaderText}>Mobile Money</Text>
            </View>

            <Input
              label="Amount (GH₵)"
              placeholder={`Max GH₵${balance.toFixed(2)}`}
              value={withdrawAmount}
              onChangeText={(v) => {
                setWithdrawAmount(v);
                if (error) setError('');
              }}
              keyboardType="numeric"
              iconName="cash-outline"
            />

            <Text style={styles.fieldLabel}>Network</Text>
            <View style={styles.providerRow}>
              {PROVIDERS.map((p) => {
                const selected = provider === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.providerTile, selected && styles.providerTileOn]}
                    onPress={() => setProvider(p.id)}
                    activeOpacity={0.85}
                    accessibilityLabel={p.name}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <Image source={p.logo} style={styles.providerLogo} resizeMode="cover" />
                  </TouchableOpacity>
                );
              })}
            </View>

            <Input
              label="MoMo number"
              placeholder="0551234987"
              value={phone}
              onChangeText={(v) => {
                setPhone(v);
                if (error) setError('');
              }}
              keyboardType="phone-pad"
              iconName="call-outline"
              autoCapitalize="none"
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {loading && loadingStep ? (
              <Text style={styles.loadingText}>{loadingStep}</Text>
            ) : null}

            <Button
              title={loading ? 'Processing…' : 'Request withdrawal'}
              variant="ink"
              onPress={handleWithdraw}
              loading={loading}
              disabled={loading || balance < 1}
              icon={
                loading ? undefined : (
                  <Ionicons name="arrow-up-outline" size={18} color={COLORS.white} />
                )
              }
            />
          </View>
        </Animated.View>
      </ScrollView>
    </InkSheetScreen>
  );
};

const styles = StyleSheet.create({
  heroBody: {
    marginTop: SPACING.md,
    gap: SPACING.lg,
  },
  heroTitle: {
    fontFamily: 'Sora_700Bold',
    fontSize: 28,
    color: COLORS.white,
    letterSpacing: -0.8,
  },
  heroBalance: {
    gap: 6,
  },
  balanceLabel: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: COLORS.primary,
  },
  balanceValue: {
    fontFamily: 'Sora_700Bold',
    fontSize: 42,
    color: COLORS.white,
    letterSpacing: -1.4,
  },
  balanceToday: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    gap: SPACING.lg,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
  },
  statTile: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  statAccent: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: 'rgba(245,184,0,0.35)',
  },
  statValue: {
    fontFamily: 'Sora_700Bold',
    fontSize: 18,
    color: COLORS.ink,
    letterSpacing: -0.4,
  },
  statLabel: {
    ...type.caption,
    marginTop: 4,
    fontSize: 11,
  },
  section: { gap: 8 },
  sectionTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 17,
    color: COLORS.ink,
  },
  sectionHint: {
    ...type.caption,
    marginBottom: 4,
  },
  panel: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  panelIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelHeaderText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 15,
    color: COLORS.ink,
  },
  fieldLabel: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: -4,
  },
  providerRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  providerTile: {
    width: 64,
    height: 64,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  providerTileOn: {
    borderColor: COLORS.ink,
  },
  providerLogo: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
    color: COLORS.error,
  },
  loadingText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
    color: COLORS.textMuted,
  },
});

export default WalletScreen;
