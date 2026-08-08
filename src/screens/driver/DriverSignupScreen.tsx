import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import * as authService from '../../services/authService';
import Button from '../../components/Button';
import Input from '../../components/Input';
import IdCaptureSlot from '../../components/IdCaptureSlot';
import { makeDriverSignupSample } from '../../data/qaAccounts';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../../theme/colors';
import { type } from '../../theme/typography';

const GHANA_CARD_FRONT = require('../../../assets/id/ghana-card-front.png');
const GHANA_CARD_BACK = require('../../../assets/id/ghana-card-back.png');

const STEPS = [
  {
    key: 'account',
    label: 'Account',
    title: 'Create driver account',
    subtitle: 'Enter your contact details to get started.',
  },
  {
    key: 'ghana_card',
    label: 'ID',
    title: 'Verify Ghana Card',
    subtitle: 'Photograph the front and back of your national ID.',
  },
  {
    key: 'license',
    label: 'Licence',
    title: 'Verify licence',
    subtitle: 'Enter your DVLA driver licence number.',
  },
  {
    key: 'vehicle',
    label: 'Vehicle',
    title: 'Vehicle details',
    subtitle: 'Add your car info and finish registration.',
  },
] as const;

type StepKey = (typeof STEPS)[number]['key'];

function SignupStepper({ activeIndex }: { activeIndex: number }) {
  return (
    <View style={styles.stepper}>
      {STEPS.map((s, i) => {
        const done = i < activeIndex;
        const current = i === activeIndex;
        const reached = done || current;
        return (
          <React.Fragment key={s.key}>
            {i > 0 ? (
              <View style={[styles.stepLine, reached && styles.stepLineActive]} />
            ) : null}
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  reached && styles.stepCircleActive,
                  current && styles.stepCircleCurrent,
                ]}
              >
                {done ? (
                  <Ionicons name="checkmark" size={14} color={COLORS.white} />
                ) : (
                  <Text style={[styles.stepNumber, reached && styles.stepNumberActive]}>
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[styles.stepLabel, reached && styles.stepLabelActive]}
                numberOfLines={1}
              >
                {s.label}
              </Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
}

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

  const fillSignupSample = () => {
    const sample = makeDriverSignupSample();
    setName(sample.name);
    setPhone(sample.phone);
    setEmail(sample.email);
    setPassword(sample.password);
    setConfirmPassword(sample.password);
    setGhanaCard(sample.ghanaCard);
    setGhanaVerified(false);
    setGhanaNormalized('');
    setLicense(sample.license);
    setLicenseVerified(false);
    setLicenseNormalized('');
    setVehicle(sample.vehicle);
    setErrors({});
  };

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
            autoComplete="name"
            textContentType="name"
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
            autoComplete="tel"
            textContentType="telephoneNumber"
          />
          <Input
            label="Email Address"
            placeholder="driver@payasyougo.com"
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
            onChangeText={(v) => {
              setPassword(v);
              clearFieldError('password');
            }}
            iconName="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
            error={errors.password}
            autoComplete="new-password"
            textContentType="newPassword"
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
          <TouchableOpacity
            style={styles.autofillBtn}
            onPress={fillSignupSample}
            accessibilityRole="button"
            accessibilityLabel="Autofill Ghana Card sample"
          >
            <Ionicons name="flash-outline" size={16} color={COLORS.ink} />
            <Text style={styles.autofillText}>Autofill sample details</Text>
          </TouchableOpacity>
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
          <TouchableOpacity
            style={styles.autofillBtn}
            onPress={fillSignupSample}
            accessibilityRole="button"
            accessibilityLabel="Autofill licence sample"
          >
            <Ionicons name="flash-outline" size={16} color={COLORS.ink} />
            <Text style={styles.autofillText}>Autofill sample details</Text>
          </TouchableOpacity>
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
        <TouchableOpacity
          style={styles.autofillBtn}
          onPress={fillSignupSample}
          accessibilityRole="button"
          accessibilityLabel="Autofill vehicle sample"
        >
          <Ionicons name="flash-outline" size={16} color={COLORS.ink} />
          <Text style={styles.autofillText}>Autofill sample details</Text>
        </TouchableOpacity>
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
          <SignupStepper activeIndex={step} />
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.subtitle}>{current.subtitle}</Text>
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
  header: { marginBottom: SPACING.lg, gap: 8 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    paddingHorizontal: 2,
  },
  stepItem: {
    alignItems: 'center',
    width: 56,
    gap: 6,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.borderStrong,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  stepCircleCurrent: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  stepNumber: {
    fontFamily: 'Sora_700Bold',
    fontSize: 13,
    color: COLORS.textMuted,
  },
  stepNumberActive: {
    color: COLORS.white,
  },
  stepLabel: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: COLORS.ink,
    fontFamily: 'DMSans_700Bold',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
    marginTop: 15,
    marginHorizontal: -4,
  },
  stepLineActive: {
    backgroundColor: COLORS.ink,
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
    lineHeight: 22,
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
  autofillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: SPACING.xs,
  },
  autofillText: {
    ...type.caption,
    color: COLORS.ink,
    fontFamily: 'DMSans_700Bold',
  },
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
