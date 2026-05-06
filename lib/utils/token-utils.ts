import { TOKEN_KEYS, TOKEN_EXPIRY_BUFFER_SECONDS, COOKIE_OPTIONS } from '../constants/auth';

type Tokens = { access: string | null; refresh: string | null };

function safeParseBase64Json(str: string) {
  try {
    const payload = str.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(decoded)));
  } catch (e) {
    return null;
  }
}

export function storeTokens(access: string, refresh: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEYS.ACCESS, access);
  localStorage.setItem(TOKEN_KEYS.REFRESH, refresh);
  // Mirror access token into a cookie for middleware SSR checks (non-HttpOnly)
  const maxAge = 60 * 60; // 1 hour (approx)
  document.cookie = `${TOKEN_KEYS.ACCESS}=${access}; path=${COOKIE_OPTIONS.path}; max-age=${maxAge}`;
}

export function getTokens(): Tokens {
  if (typeof window === 'undefined') return { access: null, refresh: null };
  return {
    access: localStorage.getItem(TOKEN_KEYS.ACCESS),
    refresh: localStorage.getItem(TOKEN_KEYS.REFRESH),
  };
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEYS.ACCESS);
  localStorage.removeItem(TOKEN_KEYS.REFRESH);
  // clear cookie
  document.cookie = `${TOKEN_KEYS.ACCESS}=; path=${COOKIE_OPTIONS.path}; max-age=0`;
}

export function decodeToken(token: string | null) {
  if (!token) return null;
  return safeParseBase64Json(token);
}

export function getTokenExpiry(token: string | null): number | null {
  const decoded = decodeToken(token);
  if (!decoded || typeof decoded.exp !== 'number') return null;
  return decoded.exp * 1000; // ms
}

export function isTokenExpired(token: string | null, bufferSeconds = TOKEN_EXPIRY_BUFFER_SECONDS) {
  const exp = getTokenExpiry(token);
  if (!exp) return true;
  const now = Date.now();
  return now >= exp - bufferSeconds * 1000;
}

export default {
  storeTokens,
  getTokens,
  clearTokens,
  decodeToken,
  getTokenExpiry,
  isTokenExpired,
};
