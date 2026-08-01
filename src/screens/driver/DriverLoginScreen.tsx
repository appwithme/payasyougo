// ============================================================
// DRIVER LOGIN SCREEN
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

const DriverLoginScreen = ({ navigation }: { navigation: any }) => {
  const { loginDriver } = useApp();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
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

    setTimeout(() => {
      const result = loginDriver(phone.trim(), password);
      setLoading(false);
      if (!result.success) {
        setError(result.error || 'Invalid credentials');
      }
    }, 1000);
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
          <View style={styles.icon}>
            <Ionicons name="car-sport" size={32} color={COLORS.textPrimary} />
          </View>
          <Text style={styles.title}>Driver Portal</Text>
          <Text style={styles.subtitle}>
            Sign in to access your driver dashboard
          </Text>
        </View>

        <View style={styles.hint}>
          <Ionicons name="information-circle" size={24} color={COLORS.primaryDark} />
          <View style={styles.hintBody}>
            <Text style={styles.hintTitle}>Demo Credentials</Text>
            <Text style={styles.hintText}>
              Phone: <Text style={styles.hintCode}>+233 24 000 0001</Text>{' '}| Pass: <Text style={styles.hintCode}>driver123</Text>{' '}(Kwame){'\n'}
              Phone: <Text style={styles.hintCode}>+233 20 000 0002</Text>{' '}| Pass: <Text style={styles.hintCode}>driver456</Text>{' '}(Ama)
            </Text>
          </View>
        </View>

        {!!error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="Phone Number"
            placeholder="+233 XX XXX XXXX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            iconName="call-outline"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            iconName="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
          />

          <Button
            title="Login as Driver"
            onPress={handleLogin}
            loading={loading}
            style={styles.btn}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('DriverSignup')}
            style={styles.link}
          >
            <Text style={styles.linkText}>Don't have an account? </Text>
            <Text style={[styles.linkText, styles.linkAccent]}>Sign Up</Text>
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
  header: {
    marginBottom: SPACING.lg,
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...SHADOW.md,
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
  hint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primaryLight + '33',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  hintBody: { flex: 1, gap: SPACING.xs },
  hintTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    marginBottom: 2,
  },
  hintText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 22,
    fontWeight: '500',
  },
  hintCode: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.errorLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.error + '44',
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  form: { gap: SPACING.md },
  btn: { marginTop: SPACING.md },
  link: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  linkText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.base,
    fontWeight: '500',
  },
  linkAccent: {
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
});

export default DriverLoginScreen;
