// ============================================================
// DRIVER SIGNUP SCREEN
// ============================================================
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
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../../theme/colors';

const DriverSignupScreen = ({ navigation }: { navigation: any }) => {
  const { signupDriver } = useApp();

  const [step, setStep] = useState(1);
  const [name, setName]               = useState('');
  const [phone, setPhone]             = useState('');
  const [email, setEmail]             = useState('');
  const [vehicle, setVehicle]         = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp]                 = useState('');
  const [loading, setLoading]         = useState(false);
  const [errors, setErrors]           = useState<{ name?: string; phone?: string; vehicle?: string; password?: string; confirmPassword?: string; otp?: string }>();

  const validateStep1 = () => {
    const e: { name?: string; phone?: string; vehicle?: string; password?: string; confirmPassword?: string } = {};
    if (!name.trim())  e.name  = 'Full name is required';
    if (!phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\+?\d{9,13}$/.test(phone.replace(/\s/g, '')))
      e.phone = 'Enter a valid phone number';
    if (!vehicle.trim()) e.vehicle = 'Vehicle details are required';
    if (!password.trim()) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!confirmPassword.trim()) e.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSendOtp = () => {
    if (!validateStep1()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 4) {
      setErrors({ otp: 'Enter the 4-digit code sent to your phone' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const result = signupDriver(phone, name, email, vehicle, password);
      if (!result.success) {
        setErrors({ otp: result.error || 'Failed to sign up.' });
      }
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <View style={styles.backIconWrap}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </View>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, step >= 1 && styles.stepActive]} />
            <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
            <View style={[styles.stepDot, step >= 2 && styles.stepActive]} />
          </View>
          <Text style={styles.title}>
            {step === 1 ? 'Driver Registration' : 'Verify Phone'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? 'Enter your details to create a driver account'
              : `We sent a code to ${phone}`}
          </Text>
        </View>

        {step === 1 && (
          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="e.g. Kwame Owusu"
              value={name}
              onChangeText={setName}
              iconName="person-outline"
              error={errors?.name}
            />
            <Input
              label="Phone Number"
              placeholder="+233 XX XXX XXXX"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              iconName="call-outline"
              error={errors?.phone}
              autoCapitalize="none"
            />
            <Input
              label="Vehicle Info"
              placeholder="e.g. Toyota Yaris - ER 1234-21"
              value={vehicle}
              onChangeText={setVehicle}
              iconName="car-outline"
              error={errors?.vehicle}
            />
            <Input
              label="Email Address"
              placeholder="driver@payasyougo.com"
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

            <Button
              title="Send Verification Code"
              onPress={handleSendOtp}
              loading={loading}
              style={styles.btn}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('DriverLogin')}
              style={styles.loginLink}
            >
              <Text style={styles.loginLinkText}>Already have an account? </Text>
              <Text style={[styles.loginLinkText, styles.linkAccent]}>Login</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.form}>
            <View style={styles.otpHint}>
              <View style={styles.otpIconWrap}>
                <Ionicons name="shield-checkmark" size={28} color={COLORS.primaryDark} />
              </View>
              <Text style={styles.otpHintText}>
                Demo mode: Enter any 4 digits to verify
              </Text>
            </View>

            <Input
              label="Verification Code"
              placeholder="_ _ _ _"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              iconName="keypad-outline"
              error={errors?.otp}
            />

            <Button
              title="Verify & Register"
              onPress={handleVerifyOtp}
              loading={loading}
              style={styles.btn}
            />

            <TouchableOpacity onPress={() => setStep(1)} style={styles.loginLink}>
              <Text style={[styles.loginLinkText, styles.linkAccent]}>
                ← Change driver details
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, flexGrow: 1 },
  back: {
    marginBottom: SPACING.lg,
    alignSelf: 'flex-start',
  },
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
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  stepDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  stepActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  stepLine: {
    flex: 1,
    height: 3,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.sm,
    borderRadius: 2,
  },
  stepLineActive: {
    backgroundColor: COLORS.primary,
  },
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
  form: { gap: SPACING.md },
  btn: { marginTop: SPACING.md },
  otpHint: {
    backgroundColor: COLORS.primaryLight + '33',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  otpIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.sm,
  },
  otpHintText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    fontWeight: '700',
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

export default DriverSignupScreen;
