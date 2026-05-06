import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api-client';
import { API_ENDPOINTS } from '@/services/endpoints';
import tokenUtils from '@/lib/utils/token-utils';
import { useAuth } from '@/context/auth-context';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ResendCodeRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  uid: string;
  token: string;
  new_password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_verified?: boolean;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface ApplicationStatusResponse {
  role: string;
  is_verified: boolean;
  has_application: boolean;
  application_id: string | null;
  application_status: string | null;
  role_applied_for: string | null;
  submitted_at: string | null;
}

export interface OnboardingCompleteResponse {
  message?: string;
  [key: string]: unknown;
}

/* ─────────────────────────────────────
   Auth Hooks
   ───────────────────────────────────── */

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await apiClient.get<AuthUser>(API_ENDPOINTS.AUTH.ME);
      return data;
    },
    retry: false,
  });
}

export function useApplicationStatus(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['applicationStatus'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApplicationStatusResponse>(API_ENDPOINTS.AUTH.APPLICATION_STATUS);
      return data;
    },
    retry: false,
    enabled: options?.enabled ?? true,
  });
}

export function useSubmitOnboardingComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await apiClient.post<OnboardingCompleteResponse>(API_ENDPOINTS.AUTH.ONBOARDING_COMPLETE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['applicationStatus'] }),
        queryClient.invalidateQueries({ queryKey: ['currentUser'] }),
      ]);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const { data } = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
      return data;
    },
    onSuccess: async (data) => {
      tokenUtils.storeTokens(data.access, data.refresh);
      await auth.login(data.access, data.refresh, data.user);
      queryClient.setQueryData(['currentUser'], data.user);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterRequest) => {
      const { data } = await apiClient.post<{ message: string; email: string }>(API_ENDPOINTS.AUTH.REGISTER, payload);
      return data;
    },
  });
}

export function useVerifyEmail() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (payload: VerifyEmailRequest) => {
      const { data } = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, payload);
      return data;
    },
    onSuccess: async (data) => {
      tokenUtils.storeTokens(data.access, data.refresh);
      await auth.login(data.access, data.refresh, data.user);
      queryClient.setQueryData(['currentUser'], data.user);
    },
  });
}

export function useResendCode() {
  return useMutation({
    mutationFn: async (payload: ResendCodeRequest) => {
      const { data } = await apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.RESEND_CODE, payload);
      return data;
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: ForgotPasswordRequest) => {
      const { data } = await apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload);
      return data;
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: ResetPasswordRequest) => {
      const { data } = await apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
      return data;
    },
  });
}

/* ─────────────────────────────────────
   Dataset Hooks
   ───────────────────────────────────── */

export function useDatasets(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['datasets', params],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.DATASETS.LIST, { params });
      return data;
    },
  });
}

export function useDataset(id: string) {
  return useQuery({
    queryKey: ['dataset', id],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.DATASETS.DETAIL(id));
      return data;
    },
    enabled: !!id,
  });
}

export function useUploadDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await apiClient.post(API_ENDPOINTS.DATASETS.UPLOAD, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
  });
}

/* ─────────────────────────────────────
   Task Hooks
   ───────────────────────────────────── */

export function useTasks(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.TASKS.QUEUE, { params });
      return data;
    },
  });
}

export function useSubmitTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: unknown }) => {
      const { data } = await apiClient.post(API_ENDPOINTS.TASKS.SUBMIT(id), payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
