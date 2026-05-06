export const TOKEN_KEYS = {
  ACCESS: 'fidelai_access',
  REFRESH: 'fidelai_refresh',
};

export const TOKEN_EXPIRY_BUFFER_SECONDS = 60; // refresh 60s before expiry

export const API_USERS_BASE = '/users';

export const COOKIE_OPTIONS = {
  path: '/',
  // Note: This cookie is not HttpOnly because backend isn't setting it.
  // It's mirrored for middleware checks. Consider server-side HttpOnly cookies later.
};
