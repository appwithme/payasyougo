import React, { useMemo, useRef, useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';
import {
  buildGoogleAuthUrl,
  extractGoogleResult,
  GOOGLE_REDIRECT_URI,
  isGoogleConfigured,
} from '../services/googleAuth';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS, SPACING } from '../theme/colors';
import { type } from '../theme/typography';

type Props = {
  onError?: (message: string) => void;
};

export default function GoogleSignInButton({ onError }: Props) {
  const { loginPassengerWithGoogle, loginPassengerWithGoogleCode } = useApp();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const handled = useRef(false);
  const authUrl = useMemo(() => buildGoogleAuthUrl(), [open]);

  if (!isGoogleConfigured()) {
    return (
      <View style={styles.disabledBox}>
        <Text style={styles.disabledText}>
          Google sign-in ready — add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to `.env`
        </Text>
      </View>
    );
  }

  const finishWithUrl = async (url: string) => {
    if (handled.current) return;
    const result = extractGoogleResult(url);
    if (!result.idToken && !result.code && !result.error) return;

    handled.current = true;
    setOpen(false);
    setBusy(true);
    try {
      if (result.error) {
        onError?.(result.error === 'access_denied' ? 'Google sign-in was cancelled' : result.error);
        return;
      }
      if (result.idToken) {
        const auth = await loginPassengerWithGoogle(result.idToken);
        if (!auth.success) onError?.(auth.error || 'Google sign-in failed');
        return;
      }
      if (result.code) {
        const auth = await loginPassengerWithGoogleCode(result.code, GOOGLE_REDIRECT_URI);
        if (!auth.success) onError?.(auth.error || 'Google sign-in failed');
      }
    } catch (err: any) {
      onError?.(err?.message || 'Google sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  const onShouldStart = (req: ShouldStartLoadRequest) => {
    const url = req.url || '';
    if (
      url.startsWith('https://localhost') ||
      url.startsWith('http://localhost') ||
      url.includes('id_token=') ||
      url.includes('error=')
    ) {
      finishWithUrl(url);
      return false;
    }
    return true;
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.btn, busy && styles.btnDisabled]}
        onPress={() => {
          handled.current = false;
          setOpen(true);
        }}
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

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sign in with Google</Text>
            <Pressable
              onPress={() => setOpen(false)}
              hitSlop={12}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={22} color={COLORS.ink} />
            </Pressable>
          </View>
          {authUrl ? (
            <WebView
              source={{ uri: authUrl }}
              onShouldStartLoadWithRequest={onShouldStart}
              onNavigationStateChange={(nav) => {
                if (nav.url) finishWithUrl(nav.url);
              }}
              startInLoadingState
              renderLoading={() => (
                <View style={styles.loading}>
                  <ActivityIndicator color={COLORS.ink} />
                </View>
              )}
              style={styles.webview}
            />
          ) : (
            <View style={styles.loading}>
              <Text style={styles.disabledText}>Missing Google client ID</Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </>
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
  modal: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontFamily: 'Sora_700Bold',
    fontSize: 16,
    color: COLORS.ink,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  webview: { flex: 1 },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
