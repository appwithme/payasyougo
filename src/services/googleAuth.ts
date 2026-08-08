import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

/**
 * Use localhost redirect (allowed by Google Web clients).
 * ASWebAuthenticationSession / Chrome Custom Tabs capture this URL and
 * return it to the app — works in Expo Go without auth.expo.io.
 * Must match Google Console → Authorized redirect URIs.
 */
export const GOOGLE_REDIRECT_URI = 'https://localhost';

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

function paramsFromUrl(url: string): URLSearchParams {
  const hash = url.includes('#') ? url.split('#')[1] : '';
  const query = url.includes('?') ? url.split('?')[1]?.split('#')[0] : '';
  return new URLSearchParams(hash || query || '');
}

function parseIdTokenFromUrl(url: string): string | null {
  return paramsFromUrl(url).get('id_token');
}

function parseCodeFromUrl(url: string): string | null {
  return paramsFromUrl(url).get('code');
}

/**
 * Google sign-in for Expo Go via WebBrowser auth session.
 * Redirect = https://localhost so the browser session completes with tokens.
 */
export function useGoogleIdTokenRequest() {
  const ids = getGoogleClientIds();
  const configured = isGoogleConfigured();
  const webId = ids.webClientId;
  const iosId = ids.iosClientId || webId;
  const androidId = ids.androidClientId || webId;

  const [request] = Google.useAuthRequest({
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
        'Google returned no token. In Google Console, ensure https://localhost is an Authorized redirect URI.',
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
