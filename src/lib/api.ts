import axios from 'axios';
import { tokens } from './storage';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {};
  if (tokens.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  return config;
});

let refreshing: Promise<void> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && tokens.refresh) {
      original._retry = true;
      refreshing ||= (async () => {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
            {
              access_token: tokens.access,
              refresh_token: tokens.refresh,
            }
          );
          tokens.access = data.access_token;
          if (data.refresh_token) {
            tokens.refresh = data.refresh_token;
          }
        } finally {
          refreshing = null;
        }
      })();
      await refreshing;
      return api(original);
    }
    return Promise.reject(error);
  }
);
