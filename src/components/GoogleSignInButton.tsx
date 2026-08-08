import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGoogleIdTokenRequest } from '../services/googleAuth';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS, SPACING } from '../theme/colors';
import { type } from '../theme/typography';

type Props = {
  onError?: (message: string) => void;
};

export default function GoogleSignInButton({ onError }: Props) {
  const { loginPassengerWithGoogle } = useApp();
  const { configured, ready, promptAsync } = useGoogleIdTokenRequest();
  const [busy, setBusy] = useState(false);

  if (!configured) {
    return (
      <View style={styles.disabledBox}>
        <Text style={styles.disabledText}>
          Google sign-in ready — add client IDs to `.env` to enable
        </Text>
      </View>
    );
  }

  const handlePress = async () => {
    setBusy(true);
    try {
      const result = await promptAsync();
      if (result.type !== 'success') {
        if (result.type === 'error') {
          onError?.(result.error?.message || 'Google sign-in failed');
        }
        return;
      }
      const idToken = result.params.id_token;
      if (!idToken) {
        onError?.('Google did not return an ID token');
        return;
      }
      const auth = await loginPassengerWithGoogle(idToken);
      if (!auth.success) onError?.(auth.error || 'Google sign-in failed');
    } catch (err: any) {
      onError?.(err?.message || 'Google sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.btn, (!ready || busy) && styles.btnDisabled]}
      onPress={handlePress}
      disabled={!ready || busy}
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
