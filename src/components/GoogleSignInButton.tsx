import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GOOGLE_REDIRECT_URI, useGoogleIdTokenRequest } from '../services/googleAuth';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS, SPACING } from '../theme/colors';
import { type } from '../theme/typography';

type Props = {
  onError?: (message: string) => void;
};

export default function GoogleSignInButton({ onError }: Props) {
  const { loginPassengerWithGoogle, loginPassengerWithGoogleCode } = useApp();
  const { configured, ready, promptGoogleAsync } = useGoogleIdTokenRequest();
  const [busy, setBusy] = useState(false);

  if (!configured) {
    return (
      <View style={styles.disabledBox}>
        <Text style={styles.disabledText}>
          Google sign-in ready — add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to `.env`
        </Text>
      </View>
    );
  }

  const handlePress = async () => {
    if (!ready) {
      onError?.('Google sign-in is still loading. Wait a second and try again.');
      return;
    }
    setBusy(true);
    try {
      const result = await promptGoogleAsync();

      if (result.type === 'cancel') {
        onError?.(
          'Sign-in closed before finishing. Stay on the Google page until it redirects back.'
        );
        return;
      }

      if (result.type === 'error') {
        onError?.(result.message);
        return;
      }

      if (result.type === 'success') {
        const auth = await loginPassengerWithGoogle(result.idToken);
        if (!auth.success) onError?.(auth.error || 'Google sign-in failed');
        return;
      }

      if (result.type === 'success_code') {
        const auth = await loginPassengerWithGoogleCode(result.code, GOOGLE_REDIRECT_URI);
        if (!auth.success) onError?.(auth.error || 'Google sign-in failed');
      }
    } catch (err: any) {
      onError?.(err?.message || 'Google sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.btn, busy && styles.btnDisabled]}
      onPress={handlePress}
      disabled={busy}
      activeOpacity={0.85}
    >
      {busy ? (
        <ActivityIndicator color={COLORS.ink} />
      ) : (
        <>
          <Ionicons name="logo-google" size={18} color={COLORS.ink} />
          <Text style={styles.label}>Continue with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginTop: SPACING.md,
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.borderStrong,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  btnDisabled: { opacity: 0.55 },
  label: {
    ...type.bodyBold,
    color: COLORS.ink,
  },
  disabledBox: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  disabledText: {
    ...type.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
