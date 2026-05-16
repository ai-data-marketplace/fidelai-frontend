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
  previous_annotation: string | null;
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

export interface PaginatedNlpTasksResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NlpTask[];
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
