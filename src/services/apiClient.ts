import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/env';

const TOKEN_KEY = 'payasyougo_jwt';

let memoryToken: string | null = null;

async function readPersistedToken(): Promise<string | null> {
  try {
    const secure = await SecureStore.getItemAsync(TOKEN_KEY);
    if (secure) return secure;
  } catch {
    // fall through to AsyncStorage
  }
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

async function writePersistedToken(token: string | null): Promise<void> {
  try {
    if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
    else await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    // SecureStore can fail on some runtimes — AsyncStorage is the backup
  }
  try {
    if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
    else await AsyncStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export async function getToken(): Promise<string | null> {
  if (memoryToken) return memoryToken;
  memoryToken = await readPersistedToken();
  return memoryToken;
}

export async function setToken(token: string | null): Promise<void> {
  memoryToken = token;
  await writePersistedToken(token);
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = await getToken();
    if (!token) {
      throw new ApiError('Please sign in again to continue.', 401);
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data: any = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!res.ok) {
    throw new ApiError(data?.error || `Request failed (${res.status})`, res.status);
  }

  return data as T;
}
