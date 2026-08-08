import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import AccountCreatedView from '../../components/AccountCreatedView';
import AuthSheetScreen from '../../components/AuthSheetScreen';
import { makePassengerSignupSample } from '../../data/qaAccounts';
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { type } from '../../theme/typography';

const PassengerSignupScreen = ({ navigation }: { navigation: any }) => {
  const { registerPassenger } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
  }>();

  const fillSignupSample = () => {
    const sample = makePassengerSignupSample();
    setName(sample.name);
    setPhone(sample.phone);
    setEmail(sample.email);
    setPassword(sample.password);
    setConfirmPassword(sample.password);
    setErrors(undefined);
  };

  const handleRegister = async () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Full name is required';
    if (!phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\+?\d{9,13}$/.test(phone.replace(/\s/g, '')))
      e.phone = 'Enter a valid phone number';
    if (!password.trim()) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!confirmPassword.trim()) e.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    const result = await registerPassenger({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (!result.success) {
      setErrors({ form: result.error || 'Failed to create account.' });
      return;
    }
    setCreated(true);
  };

  if (created) {
    return (
      <AccountCreatedView
        role="passenger"
        name={name.trim()}
        phone={phone.trim()}
        onGoToLogin={() => navigation.navigate('PassengerLogin')}
      />
    );
  }

  return (
    <AuthSheetScreen
      eyebrow="Passenger"
      title="Create account"
      subtitle="Enter your details to start paying campus fares."
      onBack={() => navigation.goBack()}
      footer={
        <>
          <Button
            title="Create account"
            onPress={handleRegister}
            loading={loading}
            variant="ink"
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('PassengerLogin')}
            style={styles.link}
          >
            <Text style={styles.linkText}>Already have an account? </Text>
            <Text style={styles.linkAccent}>Login</Text>
          </TouchableOpacity>
        </>
      }
    >
      {!!errors?.form && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={18} color={COLORS.error} />
          <Text style={styles.errorText}>{errors.form}</Text>
        </View>
      )}

      <Input
        label="Full name"
        placeholder="e.g. Kofi Mensah"
        value={name}
        onChangeText={setName}
        iconName="person-outline"
        error={errors?.name}
        autoComplete="name"
        textContentType="name"
      />
      <Input
        label="Phone number"
        placeholder="055 XXX XXXX"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        iconName="call-outline"
        error={errors?.phone}
        autoCapitalize="none"
        autoComplete="tel"
        textContentType="telephoneNumber"
      />
      <Input
        label="Email (optional)"
        placeholder="your@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        iconName="mail-outline"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <Input
        label="Password"
        placeholder="Create a password (min. 6 chars)"
        value={password}
        onChangeText={setPassword}
        iconName="lock-closed-outline"
        secureTextEntry
        autoCapitalize="none"
        error={errors?.password}
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <Input
        label="Confirm password"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        iconName="lock-closed-outline"
        secureTextEntry
        autoCapitalize="none"
        error={errors?.confirmPassword}
        autoComplete="new-password"
        textContentType="newPassword"
      />

      <TouchableOpacity
        style={styles.autofillBtn}
        onPress={fillSignupSample}
        accessibilityRole="button"
        accessibilityLabel="Autofill registration sample"
      >
        <Ionicons name="flash-outline" size={16} color={COLORS.ink} />
        <Text style={styles.autofillText}>Autofill sample details</Text>
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider} />
      </View>

      <GoogleSignInButton
        onError={(msg) => setErrors((prev) => ({ ...prev, form: msg }))}
      />
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

export default PassengerSignupScreen;
