export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register/',
    VERIFY_EMAIL: '/auth/verify-email/',
    RESEND_CODE: '/auth/resend-code/',
    LOGIN: '/auth/login/',
    ONBOARDING_COMPLETE: '/auth/onboarding/complete/',
    APPLICATION_STATUS: '/auth/application-status/',
    REFRESH: '/auth/token/refresh/',
    VERIFY_TOKEN: '/auth/token/verify/',
    ME: '/auth/me/',
    FORGOT_PASSWORD: '/auth/forgot-password/',
    RESET_PASSWORD: '/auth/reset-password/',
  },
  DATASETS: {
    LIST: '/marketplace/datasets/',
    DETAIL: (id: string) => `/marketplace/datasets/${id}/`,
    UPLOAD: '/marketplace/datasets/upload/',
  },
  DOCUMENTS: {
    SUBMIT: '/documents/submit/',
    MY_SUBMISSIONS: '/documents/my-submissions/',
    MY_SUBMISSION_DETAIL: (id: string) => `/documents/my-submissions/${id}/`,
  },
  TASKS: {
    QUEUE: '/processing/my-assignments/',
    MY_ASSIGNMENTS: '/processing/my-assignments/',
    ACCEPT_ASSIGNMENT: (id: string) => `/processing/assignments/${id}/accept/`,
    DECLINE_ASSIGNMENT: (id: string) => `/processing/assignments/${id}/decline/`,
    SUBMIT: (id: string) => `/processing/tasks/${id}/submit/`,
  },
};
