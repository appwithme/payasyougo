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
import { COLORS, SPACING, RADIUS } from '../../theme/colors';
import { type } from '../../theme/typography';

const PassengerLoginScreen = ({ navigation }: { navigation: any }) => {
  const { loginPassenger } = useApp();
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
      const result = loginPassenger(phone.trim(), password);
      setLoading(false);
      if (!result.success) setError(result.error || 'Invalid credentials');
    }, 800);
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

        <View style={styles.hint}>
          <Ionicons name="key-outline" size={18} color={COLORS.ink} />
          <Text style={styles.hintText}>
            Demo · <Text style={styles.hintBold}>0551002000</Text> /{' '}
            <Text style={styles.hintBold}>pass1234</Text>
          </Text>
        </View>

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
          />
          <Input
            label="Password"
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            iconName="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
          />
          <Button title="Sign in" onPress={handleLogin} loading={loading} variant="ink" />

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
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.primaryMuted,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  hintText: { ...type.caption, color: COLORS.textSecondary, flex: 1 },
  hintBold: { fontFamily: 'DMSans_700Bold', color: COLORS.ink },
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
  link: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  linkText: { ...type.body },
  linkAccent: { ...type.bodyBold },
});

export default PassengerLoginScreen;
