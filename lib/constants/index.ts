export const APP_NAME = "FidelAI";
export const APP_DESCRIPTION =
  "Amharic AI Data Marketplace & Crowdsourcing Platform";

export const USER_ROLES = {
  CONTRIBUTOR: "contributor",
  ANNOTATOR: "annotator",
  EXPERT: "expert",
  BUYER: "buyer",
  ADMIN: "admin",
} as const;

export type UserRoleValue = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_DASHBOARD_ROUTES: Record<UserRoleValue, string> = {
  contributor: "/contributor",
  annotator: "/annotator",
  expert: "/expert",
  buyer: "/buyer",
  admin: "/admin",
};

export const ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Profile Information",
    description: "Tell us about yourself",
  },
  { id: 2, title: "Role Selection", description: "Choose your platform role" },
  { id: 3, title: "Preferences", description: "Set up your preferences" },
] as const;

export const DATASET_CATEGORIES = [
  "text",
  "audio",
  "image",
  "multimodal",
  "translation",
  "sentiment",
  "ner",
  "pos-tagging",
] as const;

export const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  NEEDS_REVIEW: "needs_review",
  REJECTED: "rejected",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;
