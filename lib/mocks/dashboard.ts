export type UserRole =
  | "contributor"
  | "annotator"
  | "expert"
  | "buyer"
  | "admin";

export interface DashboardUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  language: string;
  role: UserRole;
  status: "active" | "pending" | "suspended";
  joinedDate: string;
  avatar?: string;
}

export const mockUser: DashboardUser = {
  id: "user_123",
  fullName: "Aman Solomon",
  email: "aman@fidelai.com",
  phone: "+251 911 234 567",
  country: "Ethiopia",
  language: "Amharic",
  role: "expert",
  status: "active",
  joinedDate: "March 15, 2026",
};

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "system" | "task" | "marketplace" | "account";
  isRead: boolean;
}

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Account Approved",
    description: "Welcome to FidelAI! Your expert account has been verified.",
    time: "2 hours ago",
    type: "account",
    isRead: false,
  },
  {
    id: "n2",
    title: "New Adjudication Task",
    description: "A new dataset requires your expert review.",
    time: "5 hours ago",
    type: "task",
    isRead: true,
  },
  {
    id: "n3",
    title: "Marketplace Update",
    description: 'The "Amharic News Corpus" was successfully purchased.',
    time: "Yesterday",
    type: "marketplace",
    isRead: true,
  },
  {
    id: "n4",
    title: "System Maintenance",
    description: "Platform will be down for 1 hour on Sunday.",
    time: "2 days ago",
    type: "system",
    isRead: true,
  },
];

export const mockDocuments = [
  {
    id: "doc1",
    title: "Certification Proof",
    type: "Expert",
    date: "2026-03-15",
  },
  {
    id: "doc2",
    title: "Terms of Service Agreement",
    type: "Legal",
    date: "2026-03-15",
  },
];

export const mockFaqs = [
  {
    question: "What is FidelAI?",
    answer:
      "FidelAI is an AI-powered crowdsourcing platform dedicated to the collection, annotation, and quality control of Amharic datasets.",
  },
  {
    question: "How do contributors earn?",
    answer:
      "Contributors earn by uploading high-quality datasets that pass our automated and expert verification pipelines.",
  },
  {
    question: "How does annotation work?",
    answer:
      "Annotators label data based on specific project requirements, such as sentiment analysis, entity extraction, or translation.",
  },
  {
    question: "How are datasets validated?",
    answer:
      "We use a multi-step validation process involving automated checks, peer reviews by other annotators, and final adjudication by experts.",
  },
];
