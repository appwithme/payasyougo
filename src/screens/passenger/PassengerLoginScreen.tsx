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
import GoogleSignInButton from '../../components/GoogleSignInButton';
import { QA_PASSENGER } from '../../data/qaAccounts';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { type } from '../../theme/typography';

const PassengerLoginScreen = ({ navigation }: { navigation: any }) => {
  const { loginPassenger } = useApp();
  const [phone, setPhone] = useState(QA_PASSENGER.phone);
  const [password, setPassword] = useState(QA_PASSENGER.password);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fillQaAccount = () => {
    setPhone(QA_PASSENGER.phone);
    setPassword(QA_PASSENGER.password);
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
    const result = await loginPassenger(phone.trim(), password);
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
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to pay campus fares with MoMo</Text>
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
            placeholder="055 XXX XXXX"
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

          <TouchableOpacity
            style={styles.autofillBtn}
            onPress={fillQaAccount}
            accessibilityRole="button"
            accessibilityLabel="Autofill test passenger account"
          >
            <Ionicons name="flash-outline" size={16} color={COLORS.ink} />
            <Text style={styles.autofillText}>Autofill test account</Text>
          </TouchableOpacity>

          <Button title="Sign in" onPress={handleLogin} loading={loading} variant="ink" />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <GoogleSignInButton onError={setError} />

          <TouchableOpacity
            onPress={() => navigation.navigate('PassengerSignup')}
            style={styles.link}
          >
            <Text style={styles.linkText}>New here? </Text>
            <Text style={styles.linkAccent}>Create account</Text>
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
  autofillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  autofillText: { ...type.caption, color: COLORS.ink, fontFamily: 'DMSans_700Bold' },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: SPACING.lg,
  },
  divider: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { ...type.caption, color: COLORS.textMuted },
  link: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  linkText: { ...type.body },
  linkAccent: { ...type.bodyBold },
});

export default PassengerLoginScreen;
