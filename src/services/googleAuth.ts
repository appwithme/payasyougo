import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

/** Must match Google Console → Authorized redirect URIs */
export const GOOGLE_REDIRECT_URI = 'https://auth.expo.io/@flowifyhack/payasyougo';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  userInfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
};

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

function parseIdTokenFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url.replace('#', '?'));
    return (
      parsed.searchParams.get('id_token') ||
      parsed.searchParams.get('idToken') ||
      null
    );
  } catch {
    const hash = url.split('#')[1] || '';
    const query = url.split('?')[1] || '';
    const params = new URLSearchParams(hash || query);
    return params.get('id_token');
  }
}

function parseCodeFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url.replace('#', '?'));
    return parsed.searchParams.get('code');
  } catch {
    const params = new URLSearchParams(url.split('?')[1] || url.split('#')[1] || '');
    return params.get('code');
  }
}

/**
 * Builds a Google auth request that Expo Go can complete:
 * openAuthSessionAsync closes when Google hits the Expo proxy HTTPS redirect,
 * so we can read id_token/code from the returned URL.
 */
export function useGoogleIdTokenRequest() {
  const ids = getGoogleClientIds();
  const configured = isGoogleConfigured();
  const webId = ids.webClientId;
  const iosId = ids.iosClientId || webId;
  const androidId = ids.androidClientId || webId;

  const [request, , ] = Google.useAuthRequest({
    clientId: webId,
    webClientId: webId,
    iosClientId: iosId,
    androidClientId: androidId,
    redirectUri: GOOGLE_REDIRECT_URI,
    responseType: AuthSession.ResponseType.IdToken,
    scopes: ['openid', 'profile', 'email'],
    shouldAutoExchangeCode: false,
    selectAccount: true,
    usePKCE: false,
  });

  const promptGoogleAsync = async (): Promise<
    | { type: 'success'; idToken: string }
    | { type: 'success_code'; code: string }
    | { type: 'cancel' }
    | { type: 'error'; message: string }
  > => {
    if (!request || !webId) {
      return { type: 'error', message: 'Google sign-in is still loading. Try again.' };
    }

    const authUrl = await request.makeAuthUrlAsync(discovery);
    if (!authUrl) {
      return { type: 'error', message: 'Could not start Google sign-in.' };
    }

    const result = await WebBrowser.openAuthSessionAsync(authUrl, GOOGLE_REDIRECT_URI, {
      preferEphemeralSession: false,
      showInRecents: true,
    });

    if (result.type === 'cancel' || result.type === 'dismiss') {
      return { type: 'cancel' };
    }

    if (result.type !== 'success' || !('url' in result) || !result.url) {
      return { type: 'error', message: 'Google sign-in did not complete.' };
    }

    const idToken = parseIdTokenFromUrl(result.url);
    if (idToken) return { type: 'success', idToken };

    const code = parseCodeFromUrl(result.url);
    if (code) return { type: 'success_code', code };

    return {
      type: 'error',
      message:
        'Google returned no token. Confirm redirect URI is exactly https://auth.expo.io/@flowifyhack/payasyougo',
    };
  };

  return {
    configured,
    ready: configured && !!request,
    redirectUri: GOOGLE_REDIRECT_URI,
    platform: Platform.OS,
    promptGoogleAsync,
  };
}
