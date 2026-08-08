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
import { useApp } from '../../context/AppContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../../theme/colors';

const PassengerSignupScreen = ({ navigation }: { navigation: any }) => {
  const { registerPassenger } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
  }>();

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
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <View style={styles.backIconWrap}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </View>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Enter your details to get started</Text>
        </View>

        {!!errors?.form && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color={COLORS.error} />
            <Text style={styles.errorText}>{errors.form}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="e.g. Kofi Mensah"
            value={name}
            onChangeText={setName}
            iconName="person-outline"
            error={errors?.name}
          />
          <Input
            label="Phone Number"
            placeholder="055 XXX XXXX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            iconName="call-outline"
            error={errors?.phone}
            autoCapitalize="none"
          />
          <Input
            label="Email (optional)"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            iconName="mail-outline"
            autoCapitalize="none"
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
          />
          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            iconName="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
            error={errors?.confirmPassword}
          />

          <Button title="Create Account" onPress={handleRegister} loading={loading} style={styles.btn} />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <GoogleSignInButton
            onError={(msg) => setErrors((prev) => ({ ...prev, form: msg }))}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('PassengerLogin')}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>Already have an account? </Text>
            <Text style={[styles.loginLinkText, styles.linkAccent]}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, flexGrow: 1 },
  back: { marginBottom: SPACING.lg, alignSelf: 'flex-start' },
  backIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: { marginBottom: SPACING.xl },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.base,
    marginTop: SPACING.sm,
    fontWeight: '500',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.errorLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  errorText: { color: COLORS.error, flex: 1, fontWeight: '700', fontSize: FONT_SIZE.sm },
  form: { gap: SPACING.md },
  btn: { marginTop: SPACING.md },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: SPACING.md,
  },
  divider: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  loginLinkText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.base,
    fontWeight: '500',
  },
  linkAccent: {
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
});

export default PassengerSignupScreen;
