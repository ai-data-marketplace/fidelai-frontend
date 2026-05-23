import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
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

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface DeleteAccountRequest {
  password: string;
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

export interface AdminRoleApplicationUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_verified: boolean;
}

export interface AdminRoleApplicationReviewer {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export interface AdminRoleApplication {
  id: string;
  user: AdminRoleApplicationUser;
  role_applied_for: string;
  application_data: Record<string, unknown>;
  status: string;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: AdminRoleApplicationReviewer | null;
  documents?: Array<{
    id: string;
    file: string;
    file_type: string;
    uploaded_at: string;
    purpose?: string;
  }>;
}

export interface PaginatedAdminRoleApplicationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminRoleApplication[];
}

export interface AdminPlatformUser {
  id: string;
  user: string;
  email?: string;
  role: string;
  status: string;
  verification: boolean;
  joined_date: string;
}

export interface PaginatedAdminPlatformUsersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminPlatformUser[];
}

export function useAdminPlatformUsers(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['adminPlatformUsers', page, pageSize],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedAdminPlatformUsersResponse>(API_ENDPOINTS.ADMIN.USERS, {
        params: {
          page,
          page_size: pageSize,
        },
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useDeactivateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await apiClient.post(API_ENDPOINTS.ADMIN.DEACTIVATE_USER(userId));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPlatformUsers'] });
      toast.success('User deactivated');
    },
    onError: (err: any) => {
      toast.error(getUserFriendlyErrorMessage(err, 'Failed to deactivate user'));
    },
  });
}

export function useReactivateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await apiClient.post(API_ENDPOINTS.ADMIN.REACTIVATE_USER(userId));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPlatformUsers'] });
      toast.success('User reactivated');
    },
    onError: (err: any) => {
      toast.error(getUserFriendlyErrorMessage(err, 'Failed to reactivate user'));
    },
  });
}

export interface OnboardingCompleteResponse {
  message?: string;
  [key: string]: unknown;
}

export interface DocumentSubmission {
  id: string;
  title: string;
  description?: string;
  domain: string;
  subdomain?: string;
  language: string;
  data_type?: string;
  consent_given?: boolean;
  processing_status: string;
  review_status: string;
  validation_notes?: string;
  files?: Array<{
    id: number;
    file_name: string;
    file_type: string;
    file_size: number;
    checksum: string;
    uploaded_at: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface MyAssignment {
  assignment_id: string;
  task_id: string;
  task_name: string;
  domain: string;
  description: string;
  status: string;
  assigned_at: string;
  started_at: string | null;
  completed_at: string | null;
  total_chunks: number;
  annotated_chunks: number;
  progress_percentage: number;
}

export interface PaginatedAssignmentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MyAssignment[];
}

export interface NlpTask {
  task_id: string;
  name: string;
  domain: string;
  task_type: string;
  status: string;
  total_chunks: number;
}

export interface NlpChunk {
  chunk_id: string;
  order_index: number;
  text: string;
  previous_annotation: {
    annotation_id: string;
    labels: Record<string, string>;
    confidence_score: string | number;
    time_spent_seconds: number;
    notes: string;
    created_at: string;
  } | null;
}

export interface NlpTaskDetail {
  task_id: string;
  name: string;
  domain: string;
  task_type: string;
  status: string;
  total_chunks: number;
  chunks: NlpChunk[];
}

export interface NlpTaskProgress {
  task_id: string;
  total_chunks: number;
  annotated_chunks: number;
  remaining_chunks: number;
  completion_percentage: number;
}

export interface DatasetPurchaseResponse {
  order_number: string;
  tx_ref: string;
  checkout_url: string;
  amount: string;
  currency: string;
  dataset_id: string;
  dataset_title: string;
}

export interface PurchaseAsset {
  id: string;
  file_format: string;
  file_size_bytes: number;
}

export interface Purchase {
  id: string;
  order_number: string;
  dataset_id: string;
  dataset_title: string;
  purchased_at: string;
  price: string;
  license: string;
  status: string;
  assets: PurchaseAsset[];
  download_count: number;
  last_downloaded_at: string | null;
}

export interface PaginatedPurchasesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Purchase[];
}

export interface PaginatedNlpTasksResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NlpTask[];
}

export interface ProfileResponse {
  id: string;
  email: string;
  full_name: string;
  role: string;
  profile_picture: string | null;
  phone_number: string | null;
  bio: string | null;
  country: string | null;
  native_language: string | null;
  notification_preferences: unknown | null;
}

export interface ExpertTask {
  id: string;
  name: string;
  domain: string;
  status: 'assigned' | 'in_progress' | 'submitted';
  assigned_at: string;
  total_chunks: number;
}

export interface PaginatedExpertTasksResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ExpertTask[];
}

export interface AssignmentChunk {
  chunk_id: string;
  order_index: number;
  text: string;
  token_count: number;
  metadata?: Record<string, any>;
  domain?: string;
  annotation_exists: boolean;
  annotation_id: string | null;
  annotation?: {
    annotation_id: string;
    domain_match: string;
    is_amharic: boolean;
    readability: string;
    safety_label: string;
    confidence: string;
    notes: string;
    time_spent_seconds: number;
    is_skipped: boolean;
    created_at: string;
  } | null;
}

export interface AssignmentProgress {
  assignment_id: string;
  total_chunks: number;
  completed_annotations: number;
  skipped_annotations: number;
  remaining_chunks: number;
  progress_percentage: number;
  assignment_status: string;
}

export interface AnnotationPayload {
  task_assignment: string;
  domain_match: string;
  is_amharic: boolean;
  readability: string;
  safety_label: string;
  confidence: string;
  notes: string;
  time_spent_seconds: number;
  is_skipped: false;
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

export function useAdminRoleApplications(options?: { page?: number; pageSize?: number; status?: string; enabled?: boolean }) {
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 10;
  const status = options?.status;

  return useQuery({
    queryKey: ['adminRoleApplications', page, pageSize, status ?? 'pending'],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedAdminRoleApplicationsResponse>(API_ENDPOINTS.ADMIN.ROLE_APPLICATIONS, {
        params: {
          page,
          page_size: pageSize,
          ...(status ? { status } : { status: 'pending' }),
        },
      });
      return data;
    },
    placeholderData: keepPreviousData,
    retry: false,
    enabled: options?.enabled ?? true,
  });
}

function updateAdminRoleApplicationCache(
  queryClient: ReturnType<typeof useQueryClient>,
  updatedApplication: AdminRoleApplication,
) {
  queryClient.setQueriesData<PaginatedAdminRoleApplicationsResponse>(
    { queryKey: ['adminRoleApplications'] },
    (current) => {
      if (!current) return current;

      return {
        ...current,
        results: current.results.map((application) =>
          application.id === updatedApplication.id ? updatedApplication : application,
        ),
      };
    },
  );
}

export function useApproveAdminRoleApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationId: string) => {
      const { data } = await apiClient.post<AdminRoleApplication>(API_ENDPOINTS.ADMIN.APPROVE_ROLE_APPLICATION(applicationId));
      return data;
    },
    onMutate: async (applicationId: string) => {
      await queryClient.cancelQueries({ queryKey: ['adminRoleApplications'] });

      const previous = queryClient.getQueriesData<PaginatedAdminRoleApplicationsResponse>({ queryKey: ['adminRoleApplications'] });

      for (const [queryKey, data] of previous) {
        queryClient.setQueryData(queryKey, (current: PaginatedAdminRoleApplicationsResponse | undefined) => {
          if (!current) return current;

          return {
            ...current,
            count: Math.max(0, current.count - 1),
            results: current.results.filter((a) => a.id !== applicationId),
          };
        });
      }

      return { previous };
    },
    onError: (_error, applicationId, context: any) => {
      if (!context?.previous) return;

      for (const [queryKey, data] of context.previous) {
        queryClient.setQueryData(queryKey, data);
      }
    },
    onSuccess: async (updatedApplication) => {
      queryClient.setQueryData(['adminRoleApplication', updatedApplication.id], updatedApplication);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['adminRoleApplications'] });
    },
  });
}

export function useRejectAdminRoleApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationId: string) => {
      const { data } = await apiClient.post<AdminRoleApplication>(API_ENDPOINTS.ADMIN.REJECT_ROLE_APPLICATION(applicationId));
      return data;
    },
    onMutate: async (applicationId: string) => {
      await queryClient.cancelQueries({ queryKey: ['adminRoleApplications'] });

      const previous = queryClient.getQueriesData<PaginatedAdminRoleApplicationsResponse>({ queryKey: ['adminRoleApplications'] });

      for (const [queryKey, data] of previous) {
        queryClient.setQueryData(queryKey, (current: PaginatedAdminRoleApplicationsResponse | undefined) => {
          if (!current) return current;

          return {
            ...current,
            count: Math.max(0, current.count - 1),
            results: current.results.filter((a) => a.id !== applicationId),
          };
        });
      }

      return { previous };
    },
    onError: (_error, applicationId, context: any) => {
      if (!context?.previous) return;

      for (const [queryKey, data] of context.previous) {
        queryClient.setQueryData(queryKey, data);
      }
    },
    onSuccess: async (updatedApplication) => {
      queryClient.setQueryData(['adminRoleApplication', updatedApplication.id], updatedApplication);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['adminRoleApplications'] });
    },
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

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordRequest) => {
      const { data } = await apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
      return data;
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: async (payload: DeleteAccountRequest) => {
      const { data } = await apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.DELETE_ACCOUNT, payload);
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

export function usePurchaseDataset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (datasetId: string) => {
      const { data } = await apiClient.post<DatasetPurchaseResponse>(API_ENDPOINTS.DATASETS.PURCHASE(datasetId), {});
      return data;
    },
    onSuccess: async (_data, datasetId) => {
      await queryClient.invalidateQueries({ queryKey: ['dataset', datasetId] });
      await queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
  });
}

export function usePurchases(page: number = 1) {
  return useQuery({
    queryKey: ['purchases', page],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedPurchasesResponse>(API_ENDPOINTS.PURCHASES.LIST, {
        params: { page },
      });
      return data;
    },
  });
}

export function useUploadDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await apiClient.post(API_ENDPOINTS.DOCUMENTS.SUBMIT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
  });
}

export function useMySubmissions() {
  return useQuery({
    queryKey: ['documentSubmissions'],
    queryFn: async () => {
      const { data } = await apiClient.get<DocumentSubmission[]>(API_ENDPOINTS.DOCUMENTS.MY_SUBMISSIONS);
      return data;
    },
  });
}

export function useMySubmission(id: string) {
  return useQuery({
    queryKey: ['documentSubmission', id],
    queryFn: async () => {
      const { data } = await apiClient.get<DocumentSubmission>(API_ENDPOINTS.DOCUMENTS.MY_SUBMISSION_DETAIL(id));
      return data;
    },
    enabled: !!id,
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await apiClient.get<ProfileResponse>(API_ENDPOINTS.AUTH.PROFILE);
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<ProfileResponse> & { profile_picture_file?: File | null }) => {
      const formData = new FormData();
      if (payload.full_name !== undefined) formData.append('full_name', payload.full_name);
      if (payload.phone_number !== undefined) formData.append('phone_number', payload.phone_number ?? '');
      if (payload.country !== undefined) formData.append('country', payload.country ?? '');
      if (payload.native_language !== undefined) formData.append('native_language', payload.native_language ?? '');
      if (payload.bio !== undefined) formData.append('bio', payload.bio ?? '');
      if (payload.profile_picture_file) {
        formData.append('profile_picture', payload.profile_picture_file);
      }
      const { data } = await apiClient.patch<ProfileResponse>(API_ENDPOINTS.AUTH.PROFILE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      toast.success('Profile updated');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });
}

/* Notifications */
export interface NotificationItemResponse {
  id: string;
  category: string;
  notification_type: string;
  title: string;
  message: string;
  metadata: unknown | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface PaginatedNotificationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NotificationItemResponse[];
}

export function useNotifications(params?: { page?: number; page_size?: number }) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedNotificationsResponse>(API_ENDPOINTS.NOTIFICATIONS.LIST, { params });
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'unread_count'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ unread_count: number }>(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
      return data.unread_count;
    },
    placeholderData: 0,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread_count'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread_count'] });
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
      const { data } = await apiClient.get<PaginatedAssignmentsResponse>(API_ENDPOINTS.TASKS.MY_ASSIGNMENTS, { params });
      return data;
    },
  });
}

export function useMyAssignments(params?: { page?: number; page_size?: number; status?: string }) {
  return useQuery({
    queryKey: ['myAssignments', params],
    queryFn: async () => {
      const requestParams = {
        page: params?.page,
        page_size: params?.page_size,
        ...(params?.status && { status: params.status }),
      };

      const { data } = await apiClient.get<PaginatedAssignmentsResponse>(API_ENDPOINTS.TASKS.MY_ASSIGNMENTS, {
        params: requestParams,
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useNlpTasks(params?: { page?: number; page_size?: number; status?: string }) {
  return useQuery({
    queryKey: ['nlpTasks', params],
    queryFn: async () => {
      const requestParams = {
        page: params?.page,
        page_size: params?.page_size,
        ...(params?.status && { status: params.status }),
      };

      const { data } = await apiClient.get<PaginatedNlpTasksResponse>(API_ENDPOINTS.TASKS.NLP_TASKS, {
        params: requestParams,
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useAcceptNlpTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { data } = await apiClient.post(API_ENDPOINTS.TASKS.NLP_ACCEPT_TASK(taskId));
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['nlpTasks'] });
    },
  });
}

export function useDeclineNlpTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { data } = await apiClient.post(API_ENDPOINTS.TASKS.NLP_DECLINE_TASK(taskId));
      return data;
    },
    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey: ['nlpTasks'] });

      const previousTasks = queryClient.getQueriesData<PaginatedNlpTasksResponse>({ queryKey: ['nlpTasks'] });

      queryClient.setQueriesData<PaginatedNlpTasksResponse>({ queryKey: ['nlpTasks'] }, (current) => {
        if (!current) return current;

        return {
          ...current,
          count: Math.max(0, current.count - 1),
          results: current.results.filter((task) => task.task_id !== taskId),
        };
      });

      return { previousTasks };
    },
    onError: (_error, _taskId, context) => {
      if (!context?.previousTasks) return;

      for (const [queryKey, data] of context.previousTasks) {
        queryClient.setQueryData(queryKey, data);
      }

      toast.error('Could not decline the task. Please try again.');
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['nlpTasks'] });
    },
  });
}

export function useNlpTaskDetail(taskId: string) {
  return useQuery({
    queryKey: ['nlpTaskDetail', taskId],
    queryFn: async () => {
      const { data } = await apiClient.get<NlpTaskDetail>(API_ENDPOINTS.TASKS.NLP_TASK_DETAIL(taskId));
      return data;
    },
    enabled: !!taskId,
  });
}

export function useNlpTaskProgress(taskId: string) {
  return useQuery({
    queryKey: ['nlpTaskProgress', taskId],
    queryFn: async () => {
      const { data } = await apiClient.get<NlpTaskProgress>(API_ENDPOINTS.TASKS.NLP_TASK_PROGRESS(taskId));
      return data;
    },
    enabled: !!taskId,
  });
}

export function useAnnotateNlpChunk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chunkId, payload }: { chunkId: string; payload: any }) => {
      const { data } = await apiClient.post(API_ENDPOINTS.TASKS.NLP_ANNOTATE_CHUNK(chunkId), payload);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['nlpTaskDetail'] });
      await queryClient.invalidateQueries({ queryKey: ['nlpTaskProgress'] });
    },
  });
}

export function useAcceptAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmentId: string) => {
      const { data } = await apiClient.post(API_ENDPOINTS.TASKS.ACCEPT_ASSIGNMENT(assignmentId));
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['myAssignments'] });
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeclineAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmentId: string) => {
      const { data } = await apiClient.post(API_ENDPOINTS.TASKS.DECLINE_ASSIGNMENT(assignmentId));
      return data;
    },
    onMutate: async (assignmentId: string) => {
      await queryClient.cancelQueries({ queryKey: ['myAssignments'] });

      const previousAssignments = queryClient.getQueriesData<PaginatedAssignmentsResponse>({ queryKey: ['myAssignments'] });

      queryClient.setQueriesData<PaginatedAssignmentsResponse>({ queryKey: ['myAssignments'] }, (current) => {
        if (!current) return current;

        return {
          ...current,
          count: Math.max(0, current.count - 1),
          results: current.results.filter((assignment) => assignment.assignment_id !== assignmentId),
        };
      });

      return { previousAssignments };
    },
    onError: (_error, _assignmentId, context) => {
      if (!context?.previousAssignments) return;

      for (const [queryKey, data] of context.previousAssignments) {
        queryClient.setQueryData(queryKey, data);
      }

      toast.error('Could not decline the assignment. Please try again.');
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['myAssignments'] });
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
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

export function useAssignmentChunks(assignmentId: string) {
  return useQuery({
    queryKey: ['assignmentChunks', assignmentId],
    queryFn: async () => {
      const { data } = await apiClient.get<AssignmentChunk[]>(API_ENDPOINTS.TASKS.GET_CHUNKS(assignmentId));
      return data;
    },
    enabled: !!assignmentId,
  });
}

export function useAssignmentProgress(assignmentId: string) {
  return useQuery({
    queryKey: ['assignmentProgress', assignmentId],
    queryFn: async () => {
      const { data } = await apiClient.get<AssignmentProgress>(API_ENDPOINTS.TASKS.GET_PROGRESS(assignmentId));
      return data;
    },
    enabled: !!assignmentId,
  });
}

export function useSubmitAnnotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chunkId, payload }: { chunkId: string; payload: AnnotationPayload }) => {
      const { data } = await apiClient.post(API_ENDPOINTS.TASKS.SUBMIT_ANNOTATION(chunkId), payload);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['assignmentChunks'] });
      await queryClient.invalidateQueries({ queryKey: ['assignmentProgress'] });
    },
  });
}

/* ─────────────────────────────────────
   Expert Hooks
   ───────────────────────────────────── */

export function useExpertTasks(params?: { page?: number; page_size?: number; status?: string }) {
  return useQuery({
    queryKey: ['expertTasks', params],
    queryFn: async () => {
      const requestParams = {
        page: params?.page,
        page_size: params?.page_size,
        ...(params?.status && { status: params.status }),
      };

      const { data } = await apiClient.get<PaginatedExpertTasksResponse>(API_ENDPOINTS.EXPERT.QUEUE, {
        params: requestParams,
      });
      return data;
    },
  });
}

export function useAcceptExpertTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { data } = await apiClient.post(API_ENDPOINTS.EXPERT.ACCEPT_TASK(taskId));
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['expertTasks'] });
    },
  });
}

export function useDeclineExpertTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { data } = await apiClient.post(API_ENDPOINTS.EXPERT.DECLINE_TASK(taskId));
      return data;
    },
    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey: ['expertTasks'] });

      const previousTasks = queryClient.getQueriesData<PaginatedExpertTasksResponse>({ queryKey: ['expertTasks'] });

      queryClient.setQueriesData<PaginatedExpertTasksResponse>({ queryKey: ['expertTasks'] }, (current) => {
        if (!current) return current;

        return {
          ...current,
          count: Math.max(0, current.count - 1),
          results: current.results.filter((task) => task.id !== taskId),
        };
      });

      return { previousTasks };
    },
    onError: (_error, _taskId, context) => {
      if (!context?.previousTasks) return;

      for (const [queryKey, data] of context.previousTasks) {
        queryClient.setQueryData(queryKey, data);
      }

      toast.error('Could not decline the task. Please try again.');
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['expertTasks'] });
    },
  });
}

export interface ExpertChunkConsensus {
  final_domain_match: string;
  final_is_amharic: boolean;
  final_readability: string;
  final_safety_label: string;
  agreement_score: number;
  requires_expert_review: boolean;
  total_annotations: number;
  computed_at: string;
}

export interface ExpertChunkSource {
  raw_document_id: number;
  title: string;
}

export interface ExpertChunk {
  chunk_id: number;
  text: string;
  domain: string;
  metadata: Record<string, any>;
  quality_score: number;
  consensus: ExpertChunkConsensus;
  source: ExpertChunkSource;
  annotation_count: number;
}

export interface ExpertChunksResponse {
  task_id: string;
  name: string;
  domain: string;
  task_chunks: ExpertChunk[];
}

export interface ExpertProgress {
  assignment_id: string;
  total_chunks: number;
  reviewed_chunks: number;
  remaining_chunks: number;
  progress_percentage: number;
  assignment_status: string;
}

export interface ExpertResolvePayload {
  domain_match: 'match' | 'not_match' | 'uncertain';
  is_amharic: boolean;
  readability: 'high' | 'medium' | 'low';
  safety_label: 'safe' | 'unsafe';
  confidence: 'high' | 'medium' | 'low';
  notes?: string;
  resolution_reasoning: string;
  final_decision: 'approved' | 'rejected';
}

export function useExpertChunks(taskId: string) {
  return useQuery({
    queryKey: ['expertChunks', taskId],
    queryFn: async () => {
      const { data } = await apiClient.get<ExpertChunksResponse>(API_ENDPOINTS.EXPERT.GET_CHUNKS(taskId));
      return data;
    },
    enabled: !!taskId,
  });
}

export function useResolveExpertChunk(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chunkId, payload }: { chunkId: string | number; payload: ExpertResolvePayload }) => {
      const { data } = await apiClient.post(API_ENDPOINTS.EXPERT.RESOLVE_CHUNK(chunkId), payload);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['expertChunks', taskId] });
      await queryClient.invalidateQueries({ queryKey: ['expertProgress', taskId] });
      await queryClient.invalidateQueries({ queryKey: ['expertTasks'] });
    },
  });
}

export function useExpertProgress(taskId: string) {
  return useQuery({
    queryKey: ['expertProgress', taskId],
    queryFn: async () => {
      const { data } = await apiClient.get<ExpertProgress>(API_ENDPOINTS.EXPERT.GET_PROGRESS(taskId));
      return data;
    },
    enabled: !!taskId,
  });
}

/* ─────────────────────────────────────
   Payments Hooks
   ───────────────────────────────────── */

export interface WalletDetails {
  available_points: number;
  total_points: number;
  locked_points: number;
  conversion_rate: number;
  withdrawable_amount: number;
  minimum_amount: number;
  meets_minimum: boolean;
  currency: string;
  wallet_available_balance: number;
  wallet_pending_balance: number;
  wallet_total_earned: number;
  wallet_total_withdrawn: number;
}

export interface PaymentBank {
  bank_code: number;
  name: string;
  slug: string;
  acct_length: number;
  swift: string;
  currency: string;
  can_process_payouts: number;
  is_active: number;
}

export interface BanksResponse {
  detail?: string;
  banks: PaymentBank[];
  provider_response?: unknown;
}

export function useWalletDetails() {
  return useQuery({
    queryKey: ['walletDetails'],
    queryFn: async () => {
      const { data } = await apiClient.get<WalletDetails>(API_ENDPOINTS.PAYMENTS.WALLET_DETAILS);
      return data;
    },
  });
}

export function usePaymentBanks() {
  return useQuery({
    queryKey: ['paymentBanks'],
    queryFn: async () => {
      const { data } = await apiClient.get<BanksResponse>(API_ENDPOINTS.PAYMENTS.BANKS);
      return data;
    },
  });
}

export interface WithdrawalRequest {
  bank_code: string;
  account_number: string;
  account_name: string;
  amount: string;
}

export interface WithdrawalResponse {
  detail?: string;
  id?: string;
  status?: string;
  [key: string]: unknown;
}

export interface WithdrawalListItem {
  id: string;
  amount: string;
  payment_method: string;
  payment_details: unknown;
  status: string;
  requested_at: string;
  processed_at: string | null;
  metadata: unknown;
}

export interface WithdrawalsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WithdrawalListItem[];
}

export function useWithdrawalsList(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['withdrawalsList', page, pageSize],
    queryFn: async () => {
      const { data } = await apiClient.get<WithdrawalsListResponse>(API_ENDPOINTS.PAYMENTS.WITHDRAWALS_LIST, {
        params: {
          page,
          page_size: pageSize,
        },
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

/* ─────────────────────────────────────
   Scoring Hooks
   ───────────────────────────────────── */

export interface ScoreConfig {
  id: number;
  action_type: string;
  points_value: number;
  description: string | null;
}

export interface PayoutRule {
  id: string;
  role: string;
  minimum_points_required: number;
  minimum_withdrawal_amount: string | number;
  score_to_currency_rate: string | number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnnotatorOverviewCard {
  key: string;
  label: string;
  value: number;
  display_value: string;
  delta?: {
    value: number;
    label: string;
  } | null;
}

export interface AnnotatorOverviewGraphs {
  weekly_performance: Array<{ period: string; tasks_completed: number; points_earned: number }>;
  confidence_distribution: Array<{ label: string; value: number }>;
  readability_distribution: Array<{ label: string; value: number }>;
  avg_time_trend: Array<{ period: string; avg_time_minutes: number }>;
}

export interface AnnotatorOverviewResponse {
  cards: AnnotatorOverviewCard[];
  graphs: AnnotatorOverviewGraphs;
}

export interface AnnotatorDashboardHighlight {
  key: string;
  label: string;
  value: number;
  display_value: string;
}

export interface AnnotatorDashboardActivity {
  id: string;
  task_name: string;
  status: string;
  assigned_at: string;
  completed_at: string;
}

export interface AnnotatorDashboardResponse {
  highlights: AnnotatorDashboardHighlight[];
  recent_activity: AnnotatorDashboardActivity[];
}

export interface ContributorDashboardCard {
  key: string;
  label: string;
  value: number;
  display_value: string;
}

export interface ContributorDashboardGraphPoint {
  period: string;
  total_submissions: number;
  pending_review: number;
  approved: number;
  rejected: number;
}

export interface ContributorDashboardResponse {
  cards: ContributorDashboardCard[];
  graphs: {
    submissions_over_time: ContributorDashboardGraphPoint[];
  };
}

export interface ExpertOverviewCard {
  key: string;
  label: string;
  value: number;
  display_value: string;
}

export interface ExpertOverviewGraphPoint {
  period: string;
  total_reviews: number;
}

export interface ExpertOverviewResponse {
  cards: ExpertOverviewCard[];
  graphs: {
    review_trend: ExpertOverviewGraphPoint[];
  };
}

export function useAnnotatorOverview() {
  return useQuery({
    queryKey: ['annotatorOverview'],
    queryFn: async () => {
      const { data } = await apiClient.get<AnnotatorOverviewResponse>(API_ENDPOINTS.ANALYTICS.ANNOTATOR_OVERVIEW);
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useAnnotatorDashboard() {
  return useQuery({
    queryKey: ['annotatorDashboard'],
    queryFn: async () => {
      const { data } = await apiClient.get<AnnotatorDashboardResponse>(API_ENDPOINTS.ANALYTICS.ANNOTATOR_DASHBOARD);
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useContributorDashboard() {
  return useQuery({
    queryKey: ['contributorDashboard'],
    queryFn: async () => {
      const { data } = await apiClient.get<ContributorDashboardResponse>(API_ENDPOINTS.ANALYTICS.CONTRIBUTOR_DASHBOARD);
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export interface ExpertDashboardHighlight {
  key: string;
  label: string;
  value: number;
  display_value: string;
}

export interface ExpertDashboardActivity {
  id: string;
  task_name: string;
  status: string;
  assigned_at: string;
  completed_at: string;
}

export interface ExpertDashboardResponse {
  highlights: ExpertDashboardHighlight[];
  recent_activity: ExpertDashboardActivity[];
}

export function useExpertOverview() {
  return useQuery({
    queryKey: ['expertOverview'],
    queryFn: async () => {
      const { data } = await apiClient.get<ExpertOverviewResponse>(API_ENDPOINTS.ANALYTICS.EXPERT_OVERVIEW);
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useExpertDashboard() {
  return useQuery({
    queryKey: ['expertDashboard'],
    queryFn: async () => {
      const { data } = await apiClient.get<ExpertDashboardResponse>(API_ENDPOINTS.ANALYTICS.EXPERT_DASHBOARD);
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export interface AdminDashboardCard {
  key: string;
  label: string;
  value: number;
  display_value: string;
  delta?: {
    value: number;
    label: string;
  };
}

export interface AdminDashboardActivity {
  id: string;
  activity_type: string;
  title: string;
  status: string;
  timestamp: string;
}

export interface AdminDashboardResponse {
  cards: AdminDashboardCard[];
  recent_activity: AdminDashboardActivity[];
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      const { data } = await apiClient.get<AdminDashboardResponse>(API_ENDPOINTS.ANALYTICS.ADMIN_DASHBOARD);
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export interface BuyerDashboardAsset {
  id: string;
  file_format: string;
  file_size_bytes: number;
}

export interface BuyerDashboardMetrics {
  total_documents: number;
  chunk_count: number;
  token_count: number;
  avg_qc_score: number;
  annotation_coverage: number;
  expert_validation_ratio: number;
  dataset_size_bytes: number;
  label_distribution: Record<string, number> | null;
  domain_distribution: Record<string, number> | null;
  computed_at: string;
}

export interface BuyerDashboardDataset {
  id: string;
  title: string;
  description: string;
  domain: string;
  subdomain: string;
  language: string;
  license_type: string;
  nlp_task_type: string;
  price: string;
  version: string;
  status: string;
  collection_year: number;
  created_at: string;
  created_by: string;
  metrics: BuyerDashboardMetrics;
  assets: BuyerDashboardAsset[];
}

export interface BuyerDashboardResponse {
  datasets: BuyerDashboardDataset[];
  recent_datasets: BuyerDashboardDataset[];
}

export function useBuyerDashboard() {
  return useQuery({
    queryKey: ['buyerDashboard'],
    queryFn: async () => {
      const { data } = await apiClient.get<BuyerDashboardResponse>(API_ENDPOINTS.ANALYTICS.BUYER_DASHBOARD);
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useScoreConfigs() {
  return useQuery({
    queryKey: ['scoreConfigs'],
    queryFn: async () => {
      const { data } = await apiClient.get<ScoreConfig[]>(API_ENDPOINTS.SCORING.SCORE_CONFIGS);
      return data;
    },
  });
}

export function useCreateScoreConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<ScoreConfig, 'id'>) => {
      const { data } = await apiClient.post<ScoreConfig>(API_ENDPOINTS.SCORING.SCORE_CONFIGS, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scoreConfigs'] });
      toast.success('Score config created');
    },
    onError: (err: any) => {
      toast.error(getUserFriendlyErrorMessage(err, 'Failed to create score config'));
    },
  });
}

export function useUpdateScoreConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<ScoreConfig> }) => {
      const { data } = await apiClient.patch<ScoreConfig>(`${API_ENDPOINTS.SCORING.SCORE_CONFIGS}${id}/`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scoreConfigs'] });
      toast.success('Score config updated');
    },
    onError: (err: any) => {
      toast.error(getUserFriendlyErrorMessage(err, 'Failed to update score config'));
    },
  });
}

export function usePayoutRules() {
  return useQuery({
    queryKey: ['payoutRules'],
    queryFn: async () => {
      const { data } = await apiClient.get<PayoutRule[]>(API_ENDPOINTS.PAYMENTS.PAYOUT_RULES);
      return data;
    },
  });
}

export function useUpdatePayoutRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Omit<PayoutRule, 'id' | 'created_at' | 'updated_at'>> }) => {
      const { data } = await apiClient.patch<PayoutRule>(API_ENDPOINTS.PAYMENTS.PAYOUT_RULES_UPDATE(id), payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payoutRules'] });
      toast.success('Payout rule updated');
    },
    onError: (err: any) => {
      toast.error(getUserFriendlyErrorMessage(err, 'Failed to update payout rule'));
    },
  });
}

function getFirstString(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = getFirstString(item);
      if (found) return found;
    }
  }
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) {
      const found = getFirstString(item);
      if (found) return found;
    }
  }
  return null;
}

function parseEmbeddedJsonText(rawText: string): string | null {
  const jsonStart = rawText.indexOf('{');
  const jsonEnd = rawText.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) return null;

  const jsonText = rawText.slice(jsonStart, jsonEnd + 1);
  try {
    const parsed = JSON.parse(jsonText) as Record<string, unknown>;
    const candidate = getFirstString(parsed?.message) || getFirstString(parsed?.detail) || getFirstString(parsed?.error);
    return candidate;
  } catch {
    return null;
  }
}

function normalizeDetailMessage(detail: string): string {
  const trimmed = detail.trim();

  const embeddedJsonMessage = parseEmbeddedJsonText(trimmed);
  if (embeddedJsonMessage) return embeddedJsonMessage;

  // Handle Django/DRF string representation like: ErrorDetail(string='...', code='invalid')
  const errorDetailMatch = trimmed.match(/ErrorDetail\(string='([\s\S]*?)',\s*code='[^']*'\)/);
  if (errorDetailMatch?.[1]) {
    const wrapped = errorDetailMatch[1].trim();
    const nestedJsonMessage = parseEmbeddedJsonText(wrapped);
    if (nestedJsonMessage) return nestedJsonMessage;
    return wrapped;
  }

  return trimmed;
}

export function getUserFriendlyErrorMessage(
  error: unknown,
  fallback = 'Unable to process your request right now. Please try again.'
) {
  const data = (error as any)?.response?.data;
  const message = data?.message;
  const detail = data?.detail;
  const rawError = data?.error;

  if (typeof detail === 'string' && detail.trim()) return normalizeDetailMessage(detail);
  if (Array.isArray(detail) && detail.length > 0) {
    const first = getFirstString(detail);
    if (first) return normalizeDetailMessage(first);
  }

  if (typeof message === 'string' && message.trim()) return message;
  if (typeof rawError === 'string' && rawError.trim()) return rawError;

  if (data && typeof data === 'object') {
    const first = getFirstString(data);
    if (first) return normalizeDetailMessage(first);
  }

  return fallback;
}

export function useWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: WithdrawalRequest) => {
      const { data } = await apiClient.post<WithdrawalResponse>(API_ENDPOINTS.PAYMENTS.WITHDRAWALS, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletDetails'] });
      toast.success('Withdrawal request submitted successfully');
    },
    onError: (error: any) => {
      const message = getUserFriendlyErrorMessage(error, 'Failed to submit withdrawal request');
      toast.error(message);
    },
  });
}
