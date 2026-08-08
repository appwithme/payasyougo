import { apiRequest, setToken } from './apiClient';
import { Driver, Passenger } from '../types';

export type AuthUser = (Passenger | Driver) & { role: 'passenger' | 'driver' };

type AuthResponse = {
  token: string;
  user: AuthUser;
};

export async function registerPassenger(input: {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    auth: false,
    body: {
      role: 'PASSENGER',
      fullName: input.fullName,
      phone: input.phone,
      email: input.email || '',
      password: input.password,
    },
  });
  await setToken(res.token);
  return res;
}

export async function registerDriver(input: {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  vehicleInfo: string;
}): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    auth: false,
    body: {
      role: 'DRIVER',
      fullName: input.fullName,
      phone: input.phone,
      email: input.email || '',
      password: input.password,
      vehicleInfo: input.vehicleInfo,
    },
  });
  await setToken(res.token);
  return res;
}

export async function login(phone: string, password: string): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    auth: false,
    body: { phone, password },
  });
  await setToken(res.token);
  return res;
}

export async function loginWithGoogle(idToken: string): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>('/api/auth/google', {
    method: 'POST',
    auth: false,
    body: { idToken },
  });
  await setToken(res.token);
  return res;
}

export async function loginWithGoogleCode(
  code: string,
  redirectUri: string
): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>('/api/auth/google/code', {
    method: 'POST',
    auth: false,
    body: { code, redirectUri },
  });
  await setToken(res.token);
  return res;
}

export async function fetchMe(): Promise<AuthUser> {
  const res = await apiRequest<{ user: AuthUser }>('/api/auth/me');
  return res.user;
}

export async function updateAvatar(avatarUrl: string): Promise<AuthUser> {
  const res = await apiRequest<{ user: AuthUser }>('/api/auth/me/avatar', {
    method: 'PATCH',
    body: { avatarUrl },
  });
  return res.user;
}

export async function updateProfile(input: {
  fullName?: string;
  phone?: string;
}): Promise<AuthUser> {
  const res = await apiRequest<{ user: AuthUser }>('/api/auth/me', {
    method: 'PATCH',
    body: input,
  });
  return res.user;
}

export async function logout(): Promise<void> {
  await setToken(null);
}
