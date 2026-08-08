import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import AuthSheetScreen from '../../components/AuthSheetScreen';
import { QA_DRIVER_DEFAULT, QA_DRIVERS } from '../../data/qaAccounts';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { type } from '../../theme/typography';

const DriverLoginScreen = ({ navigation }: { navigation: any }) => {
  const { loginDriver } = useApp();
  const [phone, setPhone] = useState<string>(QA_DRIVER_DEFAULT.phone);
  const [password, setPassword] = useState<string>(QA_DRIVER_DEFAULT.password);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fillAccount = (account: (typeof QA_DRIVERS)[number]) => {
    setPhone(account.phone);
    setPassword(account.password);
    setError('');
  };

  const handleLogin = async () => {
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }
    setError('');
    setLoading(true);
    const result = await loginDriver(phone.trim(), password);
    setLoading(false);
    if (!result.success) setError(result.error || 'Invalid credentials');
  };

  return (
    <AuthSheetScreen
      eyebrow="Driver portal"
      title="Sign in"
      subtitle="Track fares, wallet, and daily earnings on campus."
      onBack={() => navigation.goBack()}
      footer={
        <>
          <Button title="Sign in" onPress={handleLogin} loading={loading} variant="ink" />
          <TouchableOpacity
            onPress={() => navigation.navigate('DriverSignup')}
            style={styles.link}
          >
            <Text style={styles.linkText}>New driver? </Text>
            <Text style={styles.linkAccent}>Register</Text>
          </TouchableOpacity>
        </>
      }
    >
      {!!error && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={18} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Input
        label="Phone number"
        placeholder="024 XXX XXXX"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        iconName="call-outline"
        autoCapitalize="none"
        autoComplete="tel"
        textContentType="telephoneNumber"
        importantForAutofill="yes"
      />
      <Input
        label="Password"
        placeholder="Your password"
        value={password}
        onChangeText={setPassword}
        iconName="lock-closed-outline"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        textContentType="password"
        importantForAutofill="yes"
      />

      <View style={styles.autofillRow}>
        <Text style={styles.autofillLabel}>Quick fill</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.autofillChips}
        >
          {QA_DRIVERS.map((account) => (
            <TouchableOpacity
              key={account.code}
              style={[styles.chip, phone === account.phone && styles.chipActive]}
              onPress={() => fillAccount(account)}
              accessibilityRole="button"
              accessibilityLabel={`Autofill ${account.label}`}
            >
              <Text
                style={[styles.chipText, phone === account.phone && styles.chipTextActive]}
              >
                {account.code}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </AuthSheetScreen>
  );
};

const styles = StyleSheet.create({
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.errorLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  errorText: {
    ...type.caption,
    color: COLORS.error,
    flex: 1,
    fontFamily: 'DMSans_700Bold',
  },
  autofillRow: {
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  autofillLabel: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: COLORS.textMuted,
  },
  autofillChips: { gap: SPACING.sm, paddingVertical: 2 },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipActive: {
    borderColor: COLORS.ink,
    backgroundColor: COLORS.ink,
  },
  chipText: {
    ...type.caption,
    color: COLORS.textPrimary,
    fontFamily: 'DMSans_700Bold',
  },
  chipTextActive: { color: COLORS.white },
  link: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  linkText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  linkAccent: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
    color: COLORS.ink,
  },
});

export default DriverLoginScreen;
