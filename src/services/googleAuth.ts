import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { apiRequest, setToken } from './apiClient';
import { AuthUser } from './authService';

WebBrowser.maybeCompleteAuthSession();

type AuthResponse = {
  token: string;
  user: AuthUser;
};

export function getGoogleClientIds() {
  return {
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '',
  };
}

export function isGoogleConfigured(): boolean {
  const { webClientId, iosClientId, androidClientId } = getGoogleClientIds();
  const ids = [webClientId, iosClientId, androidClientId].filter(
    (id) => id && !id.includes('replace')
  );
  return ids.length > 0;
}

export async function loginWithGoogleIdToken(idToken: string): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>('/api/auth/google', {
    method: 'POST',
    auth: false,
    body: { idToken },
  });
  await setToken(res.token);
  return res;
}

/**
 * Hook for passenger Google sign-in.
 * Uses Expo AuthSession + Google ID token → backend JWT.
 */
export function usePassengerGoogleAuth(onSuccess: (user: AuthUser) => void, onError: (msg: string) => void) {
  const ids = getGoogleClientIds();
  const configured = isGoogleConfigured();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: ids.webClientId || undefined,
    iosClientId: ids.iosClientId || undefined,
    androidClientId: ids.androidClientId || undefined,
    webClientId: ids.webClientId || undefined,
  });

  useEffect(() => {
    (async () => {
      if (response?.type !== 'success') {
        if (response?.type === 'error') {
          onError(response.error?.message || 'Google sign-in failed');
        }
        return;
      }
      const idToken = response.params.id_token;
      if (!idToken) {
        onError('Google did not return an ID token');
        return;
      }
      try {
        const { user } = await loginWithGoogleIdToken(idToken);
        if (user.role !== 'passenger') {
          onError('Google sign-in is only for passengers');
          return;
        }
        onSuccess(user);
      } catch (err: any) {
        onError(err?.message || 'Google sign-in failed');
      }
    })();
  }, [response]);

  return {
    configured,
    ready: configured && !!request,
    promptAsync,
  };
}
