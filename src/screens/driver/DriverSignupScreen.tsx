import React, { useMemo, useState } from 'react';
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
import * as authService from '../../services/authService';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../../theme/colors';
import { type } from '../../theme/typography';

const STEPS = [
  { key: 'account', title: 'Account', subtitle: 'Your contact details' },
  { key: 'ghana_card', title: 'Ghana Card', subtitle: 'Verify your national ID' },
  { key: 'license', title: 'Licence', subtitle: 'Verify your driver licence' },
  { key: 'vehicle', title: 'Vehicle', subtitle: 'Finish and create account' },
] as const;

type StepKey = (typeof STEPS)[number]['key'];

const DriverSignupScreen = ({ navigation }: { navigation: any }) => {
  const { signupDriver } = useApp();
  const [step, setStep] = useState(0);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [ghanaCard, setGhanaCard] = useState('');
  const [ghanaVerified, setGhanaVerified] = useState(false);
  const [ghanaNormalized, setGhanaNormalized] = useState('');

  const [license, setLicense] = useState('');
  const [licenseVerified, setLicenseVerified] = useState(false);
  const [licenseNormalized, setLicenseNormalized] = useState('');

  const [vehicle, setVehicle] = useState('');

  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const current = STEPS[step];
  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  const clearFieldError = (key: string) => {
    if (errors[key] || errors.form) {
      setErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }));
    }
  };

  const validateAccount = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Full name is required';
    if (!phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\+?\d{9,13}$/.test(phone.replace(/\s/g, ''))) {
      e.phone = 'Enter a valid phone number';
    }
    if (!password.trim()) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!confirmPassword.trim()) e.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateVehicle = () => {
    const e: Record<string, string> = {};
    if (!vehicle.trim()) e.vehicle = 'Vehicle details are required';
    if (!ghanaVerified) e.form = 'Verify your Ghana Card first';
    if (!licenseVerified) e.form = 'Verify your driver licence first';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleBack = () => {
    if (step === 0) {
      navigation.goBack();
      return;
    }
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleNext = () => {
    if (step === 0 && !validateAccount()) return;
    if (step === 1 && !ghanaVerified) {
      setErrors({ ghanaCard: 'Verify your Ghana Card to continue' });
      return;
    }
    if (step === 2 && !licenseVerified) {
      setErrors({ license: 'Verify your driver licence to continue' });
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const verifyGhanaCard = async () => {
    if (!ghanaCard.trim()) {
      setErrors({ ghanaCard: 'Enter your Ghana Card number' });
      return;
    }
    setVerifying(true);
    setErrors({});
    try {
      const result = await authService.verifyDriverIdentity({
        type: 'ghana_card',
        number: ghanaCard.trim(),
      });
      setGhanaVerified(true);
      setGhanaNormalized(result.normalized);
      setGhanaCard(result.normalized);
    } catch (err: any) {
      setGhanaVerified(false);
      setGhanaNormalized('');
      setErrors({ ghanaCard: err?.message || 'Could not verify Ghana Card' });
    } finally {
      setVerifying(false);
    }
  };

  const verifyLicense = async () => {
    if (!license.trim()) {
      setErrors({ license: 'Enter your driver licence number' });
      return;
    }
    setVerifying(true);
    setErrors({});
    try {
      const result = await authService.verifyDriverIdentity({
        type: 'license',
        number: license.trim(),
      });
      setLicenseVerified(true);
      setLicenseNormalized(result.normalized);
      setLicense(result.normalized);
    } catch (err: any) {
      setLicenseVerified(false);
      setLicenseNormalized('');
      setErrors({ license: err?.message || 'Could not verify licence' });
    } finally {
      setVerifying(false);
    }
  };

  const handleRegister = async () => {
    if (!validateVehicle()) return;
    setLoading(true);
    const result = await signupDriver({
      phone: phone.trim(),
      name: name.trim(),
      email: email.trim(),
      vehicle: vehicle.trim(),
      password,
      ghanaCardNumber: ghanaNormalized || ghanaCard.trim(),
      licenseNumber: licenseNormalized || license.trim(),
    });
    setLoading(false);
    if (!result.success) {
      setErrors({ form: result.error || 'Failed to sign up.' });
    }
  };

  const renderStepBody = (key: StepKey) => {
    if (key === 'account') {
      return (
        <>
          <Input
            label="Full Name"
            placeholder="e.g. Kwame Owusu"
            value={name}
            onChangeText={(v) => {
              setName(v);
              clearFieldError('name');
            }}
            iconName="person-outline"
            error={errors.name}
          />
          <Input
            label="Phone Number"
            placeholder="024 XXX XXXX"
            value={phone}
            onChangeText={(v) => {
              setPhone(v);
              clearFieldError('phone');
            }}
            keyboardType="phone-pad"
            iconName="call-outline"
            error={errors.phone}
            autoCapitalize="none"
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
            onChangeText={(v) => {
              setPassword(v);
              clearFieldError('password');
            }}
            iconName="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
            error={errors.password}
          />
          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={(v) => {
              setConfirmPassword(v);
              clearFieldError('confirmPassword');
            }}
            iconName="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
            error={errors.confirmPassword}
          />
        </>
      );
    }

    if (key === 'ghana_card') {
      return (
        <>
          <View style={styles.infoCard}>
            <Ionicons name="card-outline" size={20} color={COLORS.ink} />
            <Text style={styles.infoText}>
              Enter your Ghana Card personal ID. Format: GHA-XXXXXXXXX-X
            </Text>
          </View>
          <Input
            label="Ghana Card number"
            placeholder="GHA-123456789-0"
            value={ghanaCard}
            onChangeText={(v) => {
              setGhanaCard(v);
              setGhanaVerified(false);
              setGhanaNormalized('');
              clearFieldError('ghanaCard');
            }}
            iconName="id-card-outline"
            autoCapitalize="characters"
            error={errors.ghanaCard}
          />
          {ghanaVerified ? (
            <View style={styles.verifiedBox}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={styles.verifiedText}>Ghana Card verified · {ghanaNormalized}</Text>
            </View>
          ) : (
            <Button
              title={verifying ? 'Verifying…' : 'Verify Ghana Card'}
              variant="secondary"
              onPress={verifyGhanaCard}
              loading={verifying}
              disabled={verifying}
            />
          )}
        </>
      );
    }

    if (key === 'license') {
      return (
        <>
          <View style={styles.infoCard}>
            <Ionicons name="document-text-outline" size={20} color={COLORS.ink} />
            <Text style={styles.infoText}>
              Enter your DVLA driver licence number exactly as printed on the card.
            </Text>
          </View>
          <Input
            label="Driver licence number"
            placeholder="e.g. DL1234567"
            value={license}
            onChangeText={(v) => {
              setLicense(v);
              setLicenseVerified(false);
              setLicenseNormalized('');
              clearFieldError('license');
            }}
            iconName="car-outline"
            autoCapitalize="characters"
            error={errors.license}
          />
          {licenseVerified ? (
            <View style={styles.verifiedBox}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={styles.verifiedText}>Licence verified · {licenseNormalized}</Text>
            </View>
          ) : (
            <Button
              title={verifying ? 'Verifying…' : 'Verify licence'}
              variant="secondary"
              onPress={verifyLicense}
              loading={verifying}
              disabled={verifying}
            />
          )}
        </>
      );
    }

    return (
      <>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ready to join</Text>
          <Text style={styles.summaryLine}>{name.trim()}</Text>
          <Text style={styles.summaryMuted}>{phone.trim()}</Text>
          <View style={styles.summaryBadges}>
            <View style={styles.badge}>
              <Ionicons name="checkmark" size={12} color={COLORS.ink} />
              <Text style={styles.badgeText}>Ghana Card</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="checkmark" size={12} color={COLORS.ink} />
              <Text style={styles.badgeText}>Licence</Text>
            </View>
          </View>
        </View>
        <Input
          label="Vehicle Info"
          placeholder="e.g. Toyota Yaris - ER 1234-21"
          value={vehicle}
          onChangeText={(v) => {
            setVehicle(v);
            clearFieldError('vehicle');
          }}
          iconName="car-sport-outline"
          error={errors.vehicle}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={handleBack} style={styles.back}>
          <View style={styles.backIconWrap}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </View>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.stepEyebrow}>
            Step {step + 1} of {STEPS.length}
          </Text>
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.subtitle}>{current.subtitle}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.stepDots}>
            {STEPS.map((s, i) => (
              <View
                key={s.key}
                style={[
                  styles.dot,
                  i <= step && styles.dotActive,
                  i === step && styles.dotCurrent,
                ]}
              />
            ))}
          </View>
        </View>

        {!!errors.form && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color={COLORS.error} />
            <Text style={styles.errorText}>{errors.form}</Text>
          </View>
        )}

        <View style={styles.form}>{renderStepBody(current.key)}</View>

        <View style={styles.footer}>
          {step < STEPS.length - 1 ? (
            <Button title="Continue" variant="ink" onPress={handleNext} />
          ) : (
            <Button
              title="Create driver account"
              variant="ink"
              onPress={handleRegister}
              loading={loading}
            />
          )}

          {step === 0 ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('DriverLogin')}
              style={styles.loginLink}
            >
              <Text style={styles.loginLinkText}>Already have an account? </Text>
              <Text style={[styles.loginLinkText, styles.linkAccent]}>Login</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, flexGrow: 1 },
  back: { marginBottom: SPACING.md, alignSelf: 'flex-start' },
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
  header: { marginBottom: SPACING.lg, gap: 6 },
  stepEyebrow: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: COLORS.primary,
  },
  title: {
    fontFamily: 'Sora_700Bold',
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxl,
    letterSpacing: -1,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.base,
    fontFamily: 'DMSans_400Regular',
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.ink,
    borderRadius: 999,
  },
  stepDots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.ink,
    opacity: 0.35,
  },
  dotCurrent: {
    backgroundColor: COLORS.ink,
    opacity: 1,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.errorLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    flex: 1,
    fontFamily: 'DMSans_700Bold',
    fontSize: FONT_SIZE.sm,
  },
  form: { gap: SPACING.md },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoText: {
    ...type.caption,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textSecondary,
  },
  verifiedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.successLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  verifiedText: {
    flex: 1,
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    color: COLORS.success,
  },
  summaryCard: {
    backgroundColor: COLORS.ink,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: 4,
  },
  summaryTitle: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 11,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: COLORS.primary,
    marginBottom: 4,
  },
  summaryLine: {
    fontFamily: 'Sora_700Bold',
    fontSize: 20,
    color: COLORS.white,
  },
  summaryMuted: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
  },
  summaryBadges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 12,
    color: COLORS.ink,
  },
  footer: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginLinkText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.base,
    fontFamily: 'DMSans_500Medium',
  },
  linkAccent: {
    color: COLORS.textPrimary,
    fontFamily: 'DMSans_700Bold',
  },
});

export default DriverSignupScreen;
