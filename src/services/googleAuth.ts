import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { ResponseType } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

/** Expo Go / AuthSession proxy redirect — must match Google Console */
export const GOOGLE_REDIRECT_URI = 'https://auth.expo.io/@flowifyhack/payasyougo';

function cleanClientId(value?: string | null): string | undefined {
  const v = (value || '').trim();
  if (!v || v.includes('replace') || v.length < 20) return undefined;
  return v;
}

export function getGoogleClientIds() {
  return {
    webClientId: cleanClientId(process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID),
    iosClientId: cleanClientId(process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID),
    androidClientId: cleanClientId(process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID),
  };
}

export function isGoogleConfigured(): boolean {
  return !!getGoogleClientIds().webClientId;
}

/**
 * Passenger Google ID-token sign-in for Expo Go.
 * Uses the Web client ID on all platforms (Expo Go cannot use native Google clients).
 * Forces response_type=id_token so we don't need a client secret code exchange.
 */
export function useGoogleIdTokenRequest() {
  const ids = getGoogleClientIds();
  const configured = isGoogleConfigured();
  const webId = ids.webClientId;

  // Expo's Google provider requires platform-specific client IDs.
  // In Expo Go, reuse the Web client ID for ios/android so the hook can load.
  const iosId = ids.iosClientId || webId;
  const androidId = ids.androidClientId || webId;

  const [request, , promptAsync] = Google.useAuthRequest({
    clientId: webId,
    webClientId: webId,
    iosClientId: iosId,
    androidClientId: androidId,
    redirectUri: GOOGLE_REDIRECT_URI,
    responseType: ResponseType.IdToken,
    scopes: ['openid', 'profile', 'email'],
    shouldAutoExchangeCode: false,
    selectAccount: true,
  });

  return {
    configured,
    ready: configured && !!request,
    redirectUri: GOOGLE_REDIRECT_URI,
    platform: Platform.OS,
    promptAsync,
  };
}
