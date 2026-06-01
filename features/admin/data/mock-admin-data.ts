export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "Contributor" | "Annotator" | "Expert" | "Buyer" | "Admin";
  status: "Active" | "Pending" | "Suspended" | "Deactivated";
  verificationStatus: "Verified" | "Unverified" | "Pending";
  joinedDate: string;
};

export type RoleApplication = {
  id: string;
  userId: string;
  userName: string;
  roleApplied: "Annotator" | "Expert Reviewer";
  documents: { name: string; url: string; type: string }[];
  status: "Pending" | "Approved" | "Rejected";
  date: string;
};

export type DatasetApproval = {
  id: string;
  name: string;
  contributor: string;
  domain: string;
  qcScore: number;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
  metadata: {
    chunkCount: number;
    tokenCount: number;
    summary: string;
  };
};

export type Payout = {
  id: string;
  userName: string;
  role: string;
  amount: number;
  status: "Pending" | "Approved" | "Paid";
  date: string;
};

export type AuditLogEntry = {
  id: string;
  action: string;
  target: string;
  admin: string;
  timestamp: string;
};

export const mockAdminUsers: AdminUser[] = [
  { id: "1", name: "Amanuel Kebede", email: "amanuel@example.com", role: "Contributor", status: "Active", verificationStatus: "Verified", joinedDate: "2024-01-15" },
  { id: "2", name: "Sara Tesfaye", email: "sara.t@example.com", role: "Annotator", status: "Pending", verificationStatus: "Unverified", joinedDate: "2024-03-20" },
  { id: "3", name: "Dawit Haile", email: "dawit.h@example.com", role: "Expert", status: "Suspended", verificationStatus: "Verified", joinedDate: "2023-11-05" },
  { id: "4", name: "Elias Belay", email: "elias@example.com", role: "Buyer", status: "Active", verificationStatus: "Verified", joinedDate: "2024-02-10" },
  { id: "5", name: "Helen Mengistu", email: "helen.m@example.com", role: "Annotator", status: "Deactivated", verificationStatus: "Unverified", joinedDate: "2024-01-05" },
];

export const mockRoleApplications: RoleApplication[] = [
  { 
    id: "app-1", 
    userId: "2", 
    userName: "Sara Tesfaye", 
    roleApplied: "Annotator", 
    documents: [{ name: "ID_Card.pdf", url: "#", type: "ID" }], 
    status: "Pending", 
    date: "2024-03-22" 
  },
  { 
    id: "app-2", 
    userId: "6", 
    userName: "Mekdes Abebe", 
    roleApplied: "Expert Reviewer", 
    documents: [{ name: "CV_Linguistics.pdf", url: "#", type: "CV" }, { name: "PhD_Certificate.pdf", url: "#", type: "Cert" }], 
    status: "Pending", 
    date: "2024-03-21" 
  },
];

export const mockDatasetApprovals: DatasetApproval[] = [
  { 
    id: "ds-1", 
    name: "Amharic News Corpus 2024", 
    contributor: "Amanuel Kebede", 
    domain: "Politics", 
    qcScore: 94.5, 
    status: "Pending", 
    date: "2024-03-22",
    metadata: { chunkCount: 12500, tokenCount: 4500000, summary: "Aggregated news articles from 5 major Ethiopian broadcasters." }
  },
  { 
    id: "ds-2", 
    name: "Legal Proceedings Archive", 
    contributor: "Tadesse W.", 
    domain: "Law", 
    qcScore: 88.2, 
    status: "Approved", 
    date: "2024-03-15",
    metadata: { chunkCount: 8200, tokenCount: 2100000, summary: "High-court transcripts with expert annotation." }
  },
];

export const mockPayouts: Payout[] = [
  { id: "p-1", userName: "Amanuel K.", role: "Contributor", amount: 12500.00, status: "Pending", date: "2024-03-20" },
  { id: "p-2", userName: "Sara T.", role: "Annotator", amount: 1450.50, status: "Approved", date: "2024-03-18" },
  { id: "p-3", userName: "Dawit H.", role: "Expert", amount: 4200.00, status: "Paid", date: "2024-03-10" },
];

export const mockAuditLogs: AuditLogEntry[] = [
  { id: "log-1", action: "User Suspended", target: "Dawit Haile", admin: "SuperAdmin", timestamp: "2024-03-22 14:30:12" },
  { id: "log-2", action: "Dataset Approved", target: "Legal Proceedings Archive", admin: "SuperAdmin", timestamp: "2024-03-15 09:15:45" },
  { id: "log-3", action: "Payout Processed", target: "Dawit Haile", admin: "SuperAdmin", timestamp: "2024-03-10 11:45:00" },
  { id: "log-4", action: "Role Granted", target: "Sara Tesfaye", admin: "SuperAdmin", timestamp: "2024-03-05 16:20:33" },
];

export const mockSystemSettings = {
  platformCommission: 15,
  contributorShare: 85,
  minPayoutThreshold: 500,
  defaultDatasetPrice: 1200,
  qcThreshold: 85,
};
