export type UserRole =
  | "contributor"
  | "annotator"
  | "expert"
  | "buyer"
  | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface Dataset {
  id: string;
  title: string;
  description: string;
  category: string;
  language: string;
  tags: string[];
  size: number;
  recordCount: number;
  price: number;
  status: "draft" | "processing" | "published" | "archived";
  qualityScore?: number;
  contributor: Pick<User, "id" | "name" | "avatar">;
  createdAt: string;
  updatedAt: string;
}

export interface DatasetVersion {
  id: string;
  datasetId: string;
  version: string;
  changelog: string;
  recordCount: number;
  createdAt: string;
}

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "needs_review"
  | "rejected";

export interface Task {
  id: string;
  datasetId: string;
  chunkId: string;
  type: "annotation" | "review" | "adjudication";
  status: TaskStatus;
  assignedTo?: string;
  priority: number;
  content: string;
  createdAt: string;
  deadline?: string;
}

export interface Annotation {
  id: string;
  taskId: string;
  annotatorId: string;
  labels: AnnotationLabel[];
  confidence: number;
  submittedAt: string;
}

export interface AnnotationLabel {
  start: number;
  end: number;
  label: string;
  text: string;
}

export interface MarketplaceListing {
  id: string;
  dataset: Dataset;
  price: number;
  currency: string;
  licenseType: "commercial" | "research" | "open";
  downloads: number;
  rating: number;
  reviewCount: number;
}

export interface Purchase {
  id: string;
  buyerId: string;
  datasetId: string;
  price: number;
  status: "pending" | "completed" | "refunded";
  purchasedAt: string;
}

export interface DashboardStats {
  totalDatasets: number;
  totalTasks: number;
  completedTasks: number;
  activeUsers: number;
  revenue: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  category?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}
