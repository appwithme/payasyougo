import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export function getGoogleClientIds() {
  return {
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '',
  };
}

export function isGoogleConfigured(): boolean {
  const { webClientId, iosClientId, androidClientId } = getGoogleClientIds();
  return [webClientId, iosClientId, androidClientId].some(
    (id) => !!id && !id.includes('replace') && id.length > 10
  );
}

/** Auth request for passenger Google ID token sign-in */
export function useGoogleIdTokenRequest() {
  const ids = getGoogleClientIds();
  const configured = isGoogleConfigured();

  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    clientId: ids.webClientId || undefined,
    iosClientId: ids.iosClientId || undefined,
    androidClientId: ids.androidClientId || undefined,
    webClientId: ids.webClientId || undefined,
  });

  return {
    configured,
    ready: configured && !!request,
    promptAsync,
  };
}
