const KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
};

export const tokens = {
  get access() {
    return sessionStorage.getItem(KEYS.ACCESS) || '';
  },
  set access(v: string) {
    sessionStorage.setItem(KEYS.ACCESS, v);
  },
  get refresh() {
    return localStorage.getItem(KEYS.REFRESH) || '';
  },
  set refresh(v: string) {
    localStorage.setItem(KEYS.REFRESH, v);
  },
  clear() {
    sessionStorage.removeItem(KEYS.ACCESS);
    localStorage.removeItem(KEYS.REFRESH);
  },
};
