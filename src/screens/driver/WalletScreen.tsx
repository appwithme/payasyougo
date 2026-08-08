import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';
import InkSheetScreen from '../../components/InkSheetScreen';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';
import { useTabBarPadding } from '../../navigation/FloatingTabBar';

const WalletScreen = () => {
  const { getDriverData, withdrawDriverFunds, refreshDriverWallet } = useApp();
  const tabPad = useTabBarPadding();
  const driver = getDriverData();

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [network, setNetwork] = useState('');
  const [phone, setPhone] = useState('');

  useFocusEffect(
    useCallback(() => {
      refreshDriverWallet();
    }, [refreshDriverWallet])
  );

  const handleWithdraw = () => {
    const result = withdrawDriverFunds(parseFloat(withdrawAmount) || 0);
    Alert.alert('Withdrawals', result.error || 'Coming soon');
  };

  if (!driver) return null;

  const balance = Number(driver.walletBalance || 0);
  const today = Number(driver.todayEarnings || 0);

  return (
    <InkSheetScreen
      hero={
        <Animated.View entering={FadeInDown.delay(60).duration(420)} style={styles.heroBody}>
          <Text style={styles.heroTitle}>Wallet</Text>
          <Text style={styles.heroSub}>Campus MoMo earnings</Text>

          <LinearGradient
            colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)']}
            style={styles.balanceHero}
          >
            <Text style={styles.balanceLabel}>Available balance</Text>
            <Text style={styles.balanceValue}>GH₵{balance.toFixed(2)}</Text>
            <View style={styles.balanceMeta}>
              <Ionicons name="sunny-outline" size={14} color={COLORS.primary} />
              <Text style={styles.balanceMetaText}>
                GH₵{today.toFixed(2)} earned today
              </Text>
            </View>
          </LinearGradient>
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
            <Text style={styles.statLabel}>All time</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(140).duration(420)} style={styles.section}>
          <Text style={styles.sectionTitle}>Withdraw</Text>
          <Text style={styles.sectionHint}>
            Cash out to Mobile Money. Withdrawals are coming soon.
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
              onChangeText={setWithdrawAmount}
              keyboardType="numeric"
              iconName="cash-outline"
            />
            <Input
              label="Network"
              placeholder="MTN or Telecel"
              value={network}
              onChangeText={setNetwork}
              iconName="wifi-outline"
            />
            <Input
              label="MoMo number"
              placeholder="e.g. 0550000111"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              iconName="call-outline"
              autoCapitalize="none"
            />

            <Button
              title="Request withdrawal"
              variant="ink"
              onPress={handleWithdraw}
              icon={<Ionicons name="arrow-up-outline" size={18} color={COLORS.white} />}
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
    gap: SPACING.md,
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
    marginTop: -8,
  },
  balanceHero: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 6,
  },
  balanceLabel: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: COLORS.primary,
  },
  balanceValue: {
    fontFamily: 'Sora_700Bold',
    fontSize: 36,
    color: COLORS.white,
    letterSpacing: -1,
  },
  balanceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  balanceMetaText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
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
});

export default WalletScreen;
