import * as AuthSession from 'expo-auth-session';

/**
 * Must match Google Console → Authorized redirect URIs.
 * WebView intercepts this navigation and reads id_token from the URL.
 */
export const GOOGLE_REDIRECT_URI = 'https://localhost';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
};

function cleanClientId(value?: string | null): string | undefined {
  const v = (value || '').trim();
  if (!v || v.includes('replace') || v.length < 20) return undefined;
  return v;
}

export function getGoogleWebClientId(): string | undefined {
  return cleanClientId(process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);
}

export function isGoogleConfigured(): boolean {
  return !!getGoogleWebClientId();
}

function randomNonce(length = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

/** Build Google OAuth URL (implicit id_token) for embedding in a WebView */
export function buildGoogleAuthUrl(): string | null {
  const clientId = getGoogleWebClientId();
  if (!clientId) return null;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'id_token',
    scope: 'openid profile email',
    nonce: randomNonce(),
    prompt: 'select_account',
  });

  return `${discovery.authorizationEndpoint}?${params.toString()}`;
}

export function paramsFromUrl(url: string): URLSearchParams {
  const hash = url.includes('#') ? url.split('#')[1] : '';
  const query = url.includes('?') ? url.split('?')[1]?.split('#')[0] : '';
  return new URLSearchParams(hash || query || '');
}

export function extractGoogleResult(url: string): {
  idToken?: string;
  code?: string;
  error?: string;
} {
  if (!url) return {};
  const isRedirect =
    url.startsWith(GOOGLE_REDIRECT_URI) ||
    url.startsWith('http://localhost') ||
    url.startsWith('https://localhost') ||
    url.includes('localhost/?') ||
    url.includes('localhost/#');

  if (!isRedirect && !url.includes('id_token') && !url.includes('error=')) {
    return {};
  }

  const params = paramsFromUrl(url);
  return {
    idToken: params.get('id_token') || undefined,
    code: params.get('code') || undefined,
    error: params.get('error') || undefined,
  };
}

// Keep AuthSession import used so Metro doesn't tree-shake oddly in some setups
void AuthSession.ResponseType;
