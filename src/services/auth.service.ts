import { api } from '../lib/api';
import { tokens } from '../lib/storage';

export async function login(username: string, password: string) {
  const { data } = await api.post('/auth', { username, password });
  tokens.access = data.access_token;
  tokens.refresh = data.refresh_token;
  return data;
}

export async function logout() {
  await api.post('/auth/logout', {
    access_token: tokens.access,
    refresh_token: tokens.refresh,
  });
  tokens.clear();
}
