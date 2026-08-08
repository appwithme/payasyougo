import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

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
 * Passenger Google ID-token sign-in.
 * Expo Go uses the Web client ID + Expo auth proxy redirect
 * (native iOS/Android clients are optional for later store builds).
 */
export function useGoogleIdTokenRequest() {
  const ids = getGoogleClientIds();
  const configured = isGoogleConfigured();
  const inExpoGo = Constants.appOwnership === 'expo';

  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    // Always prefer the real Web client for Expo Go / browser sheet
    clientId: ids.webClientId,
    webClientId: ids.webClientId,
    // Only pass native IDs when they are real (not placeholders)
    iosClientId: inExpoGo ? undefined : ids.iosClientId,
    androidClientId: inExpoGo ? undefined : ids.androidClientId,
    redirectUri: GOOGLE_REDIRECT_URI,
    scopes: ['openid', 'profile', 'email'],
  });

  return {
    configured,
    ready: configured && !!request,
    redirectUri: GOOGLE_REDIRECT_URI,
    promptAsync,
  };
}
