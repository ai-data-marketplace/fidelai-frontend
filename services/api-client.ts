import axios from 'axios';
import { API_ENDPOINTS } from './endpoints';
import tokenUtils from '../lib/utils/token-utils';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use((config) => {
  const { access } = tokenUtils.getTokens();
  if (access && config.headers) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for error handling globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Attempt token refresh once when access token expired
    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refresh } = tokenUtils.getTokens();
      if (!refresh) {
        tokenUtils.clearTokens();
        return Promise.reject(error);
      }

      try {
        const refreshUrl = `${apiClient.defaults.baseURL?.replace(/\/+$/, '') || ''}${API_ENDPOINTS.AUTH.REFRESH}`;
        const { data } = await axios.post(refreshUrl, { refresh }, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (data?.access && data?.refresh) {
          tokenUtils.storeTokens(data.access, data.refresh);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.access}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        tokenUtils.clearTokens();
        return Promise.reject(refreshError);
      }
    }

    // For specific auth-related responses, clear tokens and surface a friendly error upstream
    if (status === 401 || status === 403 || status === 423) {
      tokenUtils.clearTokens();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
