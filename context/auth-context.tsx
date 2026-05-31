"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import apiClient from "../services/api-client";
import { API_ENDPOINTS } from "../services/endpoints";
import tokenUtils from "../lib/utils/token-utils";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_verified?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isRefreshing: boolean;
  login: (access: string, refresh: string, user?: AuthUser) => Promise<void>;
  logout: () => void;
  refreshTokens: () => Promise<boolean>;
  fetchCurrentUser: () => Promise<AuthUser | null>;
  setUser: (u: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isAuthenticated = !!tokenUtils.getTokens().access;

  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      setUser(data as AuthUser);
      return data as AuthUser;
    } catch (e) {
      setUser(null);
      return null;
    }
  }, []);

  const refreshTokens = useCallback(async (): Promise<boolean> => {
    const { refresh } = tokenUtils.getTokens();
    if (!refresh) return false;
    setIsRefreshing(true);
    try {
      const resp = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
        refresh,
      });
      const { access, refresh: newRefresh } = resp.data;
      if (access && newRefresh) {
        tokenUtils.storeTokens(access, newRefresh);
        setIsRefreshing(false);
        return true;
      }
    } catch (err) {
      tokenUtils.clearTokens();
    }
    setIsRefreshing(false);
    return false;
  }, []);

  const login = useCallback(
    async (access: string, refresh: string, userData?: AuthUser) => {
      tokenUtils.storeTokens(access, refresh);
      if (userData) {
        setUser(userData);
      } else {
        await fetchCurrentUser();
      }
    },
    [fetchCurrentUser],
  );

  const logout = useCallback(() => {
    tokenUtils.clearTokens();
    setUser(null);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { access, refresh } = tokenUtils.getTokens();
      if (!access && !refresh) {
        if (mounted) setIsLoading(false);
        return;
      }

      const shouldRefresh = tokenUtils.isTokenExpired(access);
      if (shouldRefresh && refresh) {
        const ok = await refreshTokens();
        if (ok) {
          await fetchCurrentUser();
        }
      } else if (access) {
        await fetchCurrentUser();
      }

      if (mounted) setIsLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [fetchCurrentUser, refreshTokens]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isRefreshing,
        login,
        logout,
        refreshTokens,
        fetchCurrentUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
