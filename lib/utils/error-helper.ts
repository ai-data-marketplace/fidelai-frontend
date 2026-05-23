import { AxiosError } from 'axios';

type BackendError = {
  message?: string;
  detail?: string;
  [key: string]: unknown;
};

export function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<BackendError>;
  const status = axiosError?.response?.status;
  const data = axiosError?.response?.data;

  if (status === 401) return 'Invalid email or password.';
  if (status === 403) return 'Please verify your email before logging in.';
  if (status === 423) return 'Your account is temporarily locked. Try again later.';
  if (status === 429) return 'Too many requests. Please wait and try again.';

  if (data?.message && typeof data.message === 'string') return data.message;
  if (data?.detail && typeof data.detail === 'string') return data.detail;

  return 'Something went wrong. Please try again.';
}

export function getFieldErrors(error: unknown): Record<string, string> {
  const axiosError = error as AxiosError<Record<string, unknown>>;
  const data = axiosError?.response?.data;
  if (!data) return {};

  const fieldMap: Record<string, string> = {
    full_name: 'fullName',
    new_password: 'password',
    current_password: 'current',
  };

  const errors: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === 'message' || key === 'detail') continue;
    const mappedKey = fieldMap[key] ?? key;
    if (Array.isArray(value) && value[0]) {
      errors[mappedKey] = String(value[0]);
    }
  }

  return errors;
}