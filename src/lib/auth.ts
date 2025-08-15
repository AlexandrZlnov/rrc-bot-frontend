import { tokens } from './storage';
import { api } from './api';
import type { LoginRequest, TokenPair } from '../types/auth';

export async function login(payload: LoginRequest): Promise<TokenPair> {
  const { data } = await api.post<TokenPair>('/auth', payload);
  tokens.access = data.access_token;
  tokens.refresh = data.refresh_token;
  return data;
}

export async function logout(): Promise<void> {
  const { data } = await api.post('/auth/logout', {
    access_token: tokens.access,
    refresh_token: tokens.refresh,
  });
  tokens.clear();
  return data;
}
