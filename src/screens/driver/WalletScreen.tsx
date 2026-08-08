// ============================================================
// WALLET SCREEN (Driver)
// ============================================================
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import WalletCard from '../../components/WalletCard';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { useTabBarPadding } from '../../navigation/FloatingTabBar';

const WalletScreen = ({ navigation }: { navigation: any }) => {
  const { getDriverData, withdrawDriverFunds } = useApp();
  const tabPad = useTabBarPadding();
  const driver = getDriverData();

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [network, setNetwork]               = useState('');
  const [phone, setPhone]                   = useState('');
  const [loading, setLoading]               = useState(false);

  const handleWithdraw = () => {
    const result = withdrawDriverFunds(parseFloat(withdrawAmount) || 0);
    Alert.alert('Withdrawals', result.error || 'Coming soon');
  };

  if (!driver) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <Header title="Wallet" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabPad }]}
        showsVerticalScrollIndicator={false}
      >
        <WalletCard
          balance={driver.walletBalance}
          todayEarnings={driver.todayEarnings}
          totalTrips={driver.totalTrips}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings Summary</Text>
          <View style={styles.earningsGrid}>
            {[
              { label: 'Today', value: driver.todayEarnings, color: COLORS.textPrimary },
              { label: 'This Week', value: driver.todayEarnings * 5.5, color: COLORS.textPrimary },
              { label: 'This Month', value: driver.walletBalance, color: COLORS.success },
            ].map((item, idx) => (
              <View key={item.label} style={styles.earningCard}>
                <Text style={[styles.earningValue, { color: item.color }]}>
                  GH₵{item.value.toFixed(2)}
                </Text>
                <Text style={styles.earningLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Withdraw Funds</Text>
          <View style={styles.withdrawCard}>
            <View style={styles.withdrawHeader}>
              <Ionicons name="phone-portrait" size={20} color={COLORS.primaryDark} />
              <Text style={styles.withdrawHeaderText}>Mobile Money Transfer</Text>
            </View>

            <Input
              label="Amount (GH₵)"
              placeholder={`Max: GH₵${driver.walletBalance.toFixed(2)}`}
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              keyboardType="numeric"
              iconName="cash-outline"
            />
            <Input
              label="Network"
              placeholder="e.g. MTN, Vodafone, AirtelTigo"
              value={network}
              onChangeText={setNetwork}
              iconName="wifi-outline"
            />
            <Input
              label="Mobile Money Number"
              placeholder="+233 XX XXX XXXX"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              iconName="call-outline"
              autoCapitalize="none"
            />

            <Button
              title="Request Withdrawal"
              onPress={handleWithdraw}
              loading={loading}
              icon={<Ionicons name="arrow-up-circle" size={20} color={COLORS.textPrimary} />}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, gap: SPACING.xl },

  section: { gap: SPACING.md },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
  },

  earningsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  earningCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  earningValue: {
    fontSize: FONT_SIZE.base,
    fontWeight: '900',
  },
  earningLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  withdrawCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  withdrawHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  withdrawHeaderText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.base,
    fontWeight: '800',
  },
});

export default WalletScreen;
