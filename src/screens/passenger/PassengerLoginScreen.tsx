import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import AuthSheetScreen from '../../components/AuthSheetScreen';
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
    <AuthSheetScreen
      eyebrow="Passenger"
      title="Welcome back"
      subtitle="Sign in to pay campus fares with MoMo."
      onBack={() => navigation.goBack()}
      footer={
        <>
          <Button title="Sign in" onPress={handleLogin} loading={loading} variant="ink" />
          <TouchableOpacity
            onPress={() => navigation.navigate('PassengerSignup')}
            style={styles.link}
          >
            <Text style={styles.linkText}>New here? </Text>
            <Text style={styles.linkAccent}>Create account</Text>
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

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider} />
      </View>

      <GoogleSignInButton onError={setError} />
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
  autofillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  autofillText: {
    ...type.caption,
    color: COLORS.ink,
    fontFamily: 'DMSans_700Bold',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: SPACING.sm,
  },
  divider: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { ...type.caption, color: COLORS.textMuted },
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

export default PassengerLoginScreen;
