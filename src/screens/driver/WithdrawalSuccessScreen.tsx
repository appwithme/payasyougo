import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
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
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { MoMoProvider } from '../../types';

type Params = {
  amount: number;
  provider: MoMoProvider;
  momoPhone: string;
  reference?: string;
  demo?: boolean;
  walletBalance?: number;
  createdAt?: string;
};

const PROVIDER_LABEL: Record<MoMoProvider, string> = {
  MTN: 'MTN MoMo',
  TELECEL: 'Telecel Cash',
};

function formatWhen(iso?: string) {
  if (!iso) return 'Just now';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Just now';
  return d.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const WithdrawalSuccessScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: { params: Params };
}) => {
  const {
    amount,
    provider,
    momoPhone,
    reference,
    demo,
    walletBalance,
    createdAt,
  } = route.params;

  const amountLabel = `GH₵${Number(amount || 0).toFixed(2)}`;
  const network = PROVIDER_LABEL[provider] || provider;
  const refShort = String(reference || '')
    .replace(/^wd_test_/, '')
    .replace(/^wd_/, '')
    .slice(0, 14)
    .toUpperCase();

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

  const goWallet = () => {
    navigation.navigate('WalletHome');
  };

  const goHistory = () => {
    navigation.getParent()?.navigate('TxnTab');
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
            <Text style={styles.heroStatus}>
              {demo ? 'Test withdrawal sent' : 'Withdrawal sent'}
            </Text>
            <Text style={styles.amount}>{amountLabel}</Text>
            <Animated.View style={[styles.amberRule, amberLine]} />
            <Text style={styles.paidTo}>
              to <Text style={styles.paidName}>{network}</Text>
            </Text>
            <Text style={styles.phone}>{momoPhone}</Text>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.sheet}>
        <SafeAreaView edges={['bottom']} style={styles.sheetInner}>
          <Animated.View entering={FadeInUp.delay(120).duration(400)} style={styles.body}>
            <Text style={styles.sectionTitle}>Payout details</Text>
            <View style={styles.meta}>
              <MetaRow label="Network" value={network} />
              <MetaRow label="MoMo number" value={momoPhone} />
              <MetaRow label="Reference" value={refShort || '—'} />
              <MetaRow label="When" value={formatWhen(createdAt)} />
              {walletBalance != null ? (
                <MetaRow
                  label="Wallet left"
                  value={`GH₵${Number(walletBalance).toFixed(2)}`}
                />
              ) : null}
            </View>

            {demo ? (
              <Text style={styles.demoHint}>
                Simulated in test mode — wallet was debited; no real MoMo transfer.
              </Text>
            ) : (
              <Text style={styles.demoHint}>
                Funds usually arrive in your MoMo wallet within a few minutes.
              </Text>
            )}
          </Animated.View>

          <Animated.View entering={FadeIn.delay(280).duration(350)} style={styles.footer}>
            <Button title="Back to wallet" variant="ink" onPress={goWallet} />
            <Button title="View transactions" variant="ghost" onPress={goHistory} />
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
  phone: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 18,
    color: COLORS.white,
    letterSpacing: -0.3,
    marginTop: 2,
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
    justifyContent: 'space-between',
  },
  body: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    gap: SPACING.md,
  },
  sectionTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 17,
    color: COLORS.ink,
    letterSpacing: -0.2,
  },
  meta: {
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
  demoHint: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    gap: 2,
  },
});

export default WithdrawalSuccessScreen;
