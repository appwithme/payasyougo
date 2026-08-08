import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import BrandLogo from '../../components/BrandLogo';
import { QA_DRIVER_DEFAULT, QA_DRIVERS } from '../../data/qaAccounts';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { type } from '../../theme/typography';

const DriverLoginScreen = ({ navigation }: { navigation: any }) => {
  const { loginDriver } = useApp();
  const [phone, setPhone] = useState(QA_DRIVER_DEFAULT.phone);
  const [password, setPassword] = useState(QA_DRIVER_DEFAULT.password);
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color={COLORS.ink} />
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <BrandLogo size="sm" />
          <Text style={styles.title}>Driver portal</Text>
          <Text style={styles.subtitle}>Track fares, wallet, and daily earnings</Text>
        </Animated.View>

        {!!error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
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
            <Text style={styles.autofillLabel}>Autofill</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.autofillChips}
            >
              {QA_DRIVERS.map((account) => (
                <TouchableOpacity
                  key={account.code}
                  style={[
                    styles.chip,
                    phone === account.phone && styles.chipActive,
                  ]}
                  onPress={() => fillAccount(account)}
                  accessibilityRole="button"
                  accessibilityLabel={`Autofill ${account.label}`}
                >
                  <Text
                    style={[
                      styles.chipText,
                      phone === account.phone && styles.chipTextActive,
                    ]}
                  >
                    {account.code}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Button title="Sign in" onPress={handleLogin} loading={loading} variant="ink" />

          <TouchableOpacity
            onPress={() => navigation.navigate('DriverSignup')}
            style={styles.link}
          >
            <Text style={styles.linkText}>New driver? </Text>
            <Text style={styles.linkAccent}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, flexGrow: 1 },
  back: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  header: { marginBottom: SPACING.lg, gap: SPACING.sm },
  title: { ...type.title, marginTop: SPACING.sm },
  subtitle: { ...type.body },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.errorLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  errorText: { ...type.caption, color: COLORS.error, flex: 1, fontFamily: 'DMSans_700Bold' },
  form: { gap: 4 },
  autofillRow: {
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  autofillLabel: { ...type.label, color: COLORS.textMuted },
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
  chipText: { ...type.caption, color: COLORS.textPrimary, fontFamily: 'DMSans_700Bold' },
  chipTextActive: { color: COLORS.white },
  link: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  linkText: { ...type.body },
  linkAccent: { ...type.bodyBold },
});

export default DriverLoginScreen;
