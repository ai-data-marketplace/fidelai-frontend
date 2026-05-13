// ─── Expert Mock Data ─────────────────────────────────────────────────────────

export const expertStats = {
  pendingReviews: 12,
  resolvedCases: 145,
  avgDecisionTime: "3m 45s",
  agreementWithOutcomes: "92.4%",
};

export interface ExpertTask {
  id: string;
  name: string;
  domain: string;
  status: 'assigned' | 'in_progress' | 'submitted';
  assigned_at: string;
  total_chunks: number;
}

export const reviewQueueData: ExpertTask[] = [
  {
    id: "TASK-8021",
    name: "Legal Document Review",
    domain: "Legal",
    status: "assigned",
    assigned_at: "2h ago",
    total_chunks: 10,
  },
  {
    id: "TASK-8034",
    name: "Health Content Analysis",
    domain: "Health",
    status: "in_progress",
    assigned_at: "4h ago",
    total_chunks: 5,
  },
  {
    id: "TASK-8042",
    name: "Finance Report Assessment",
    domain: "Finance",
    status: "assigned",
    assigned_at: "5h ago",
    total_chunks: 15,
  },
  {
    id: "TASK-8055",
    name: "Technical Specification Review",
    domain: "Tech",
    status: "submitted",
    assigned_at: "1d ago",
    total_chunks: 8,
  },
];

export interface ConsensusAnnotation {
  domainMatch: "Match" | "Not Match" | "Uncertain";
  isAmharic: boolean;
  harmful: boolean;
  agreementPct: number;
  status: "Strong Consensus" | "Weak Consensus" | "Conflict";
}

export interface AIOutput {
  predictedDomain: string;
  confidence: number;
  flags: {
    harmful: boolean;
    duplicate: boolean;
    noise: boolean;
  };
}

export interface ResolutionChunk {
  id: string;
  text: string;
  consensusScore: number;
  ai: AIOutput;
  consensus: ConsensusAnnotation;
}

export const mockExpertChunks: Record<string, ResolutionChunk[]> = {
  "TASK-8021": [
    {
      id: "chunk-101",
      text: "ይህ ውል በኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ ህግ መሰረት የሚመራ ይሆናል። አከራይና ተከራይ በስምምነቱ መሠረት ግዴታቸውን መወጣት አለባቸው።",
      consensusScore: 50,
      ai: {
        predictedDomain: "Legal",
        confidence: 0.98,
        flags: { harmful: false, duplicate: false, noise: false },
      },
      consensus: {
        domainMatch: "Uncertain",
        isAmharic: true,
        harmful: false,
        agreementPct: 50,
        status: "Weak Consensus"
      }
    },
    {
      id: "chunk-102",
      text: "የተጠቀሰው መብት በውርስ ሊተላለፍ የሚችለው ሟች ህጋዊ ኑዛዜ ከትቶ ካለፈ ብቻ ነው።",
      consensusScore: 66,
      ai: {
        predictedDomain: "Finance", // AI Conflict here (should be legal)
        confidence: 0.82,
        flags: { harmful: false, duplicate: false, noise: false },
      },
      consensus: {
        domainMatch: "Match",
        isAmharic: true,
        harmful: false,
        agreementPct: 66,
        status: "Weak Consensus"
      }
    },
    {
      id: "chunk-103",
      text: "ማንኛውም ሰው የፍርድ ቤት ትዕዛዝ ሳይኖር በቁጥጥር ስር ሊውል አይችልም - ይህ በመሰረታዊ ሕገ መንግስት ላይ የሰፈረ መብት ነው።",
      consensusScore: 40,
      ai: {
        predictedDomain: "Legal",
        confidence: 0.88,
        flags: { harmful: false, duplicate: false, noise: false },
      },
      consensus: {
        domainMatch: "Uncertain",
        isAmharic: true,
        harmful: false,
        agreementPct: 40,
        status: "Conflict"
      }
    },
    {
      id: "chunk-104",
      text: "ይህ ሰነድ በአጠቃላይ ማህበረሰብ የሚፈጸሙ እኩይ ድርጊቶችን ያበረታታል።",
      consensusScore: 89,
      ai: {
        predictedDomain: "Health",
        confidence: 0.35,
        flags: { harmful: true, duplicate: false, noise: false },
      },
      consensus: {
        domainMatch: "Not Match",
        isAmharic: true,
        harmful: true,
        agreementPct: 89,
        status: "Strong Consensus"
      }
    },
    {
      id: "chunk-105",
      text: "የታክስ ክፍያ ጊዜው ካለፈ በኋላ የሚጨመረው ቅጣት በወለድ መጠን ይሰላል።",
      consensusScore: 60,
      ai: {
        predictedDomain: "Finance",
        confidence: 0.99,
        flags: { harmful: false, duplicate: false, noise: false },
      },
      consensus: {
        domainMatch: "Uncertain",
        isAmharic: true,
        harmful: false,
        agreementPct: 55,
        status: "Weak Consensus"
      }
    }
  ],
  "default": [
    {
      id: "c-def-1",
      text: "አዳዲስ ቴክኖሎጂዎችን በመጠቀም የጤና ስርዓቱን ማሻሻል ይቻላል።",
      consensusScore: 33,
      ai: {
        predictedDomain: "Health",
        confidence: 0.95,
        flags: { harmful: false, duplicate: false, noise: false },
      },
      consensus: {
        domainMatch: "Not Match",
        isAmharic: true,
        harmful: false,
        agreementPct: 66,
        status: "Conflict"
      }
    }
  ]
};

// ─── Performance Records ────────────────────────────────────────────────────

export const resolvedRecords = [
  { id: "TASK-7099", domain: "Tech", chunks: 14, resolution: "Overrides Annotators", date: "2026-04-14" },
  { id: "TASK-7098", domain: "Legal", chunks: 8, resolution: "Validates Annotators", date: "2026-04-13" },
  { id: "TASK-7080", domain: "Finance", chunks: 12, resolution: "Overrides AI", date: "2026-04-12" },
  { id: "TASK-7055", domain: "Health", chunks: 20, resolution: "Content Rejected (Harmful)", date: "2026-04-10" },
];

export const expertAnalytics = {
  decisionsOverTime: [
    { week: "W1 Mar", decisions: 14 },
    { week: "W2 Mar", decisions: 25 },
    { week: "W3 Mar", decisions: 18 },
    { week: "W4 Mar", decisions: 32 },
    { week: "W1 Apr", decisions: 28 },
    { week: "W2 Apr", decisions: 28 },
  ],
  domainPerformance: [
    { domain: "Health", overrideRate: 12, disputes: 45 },
    { domain: "Tech", overrideRate: 8, disputes: 30 },
    { domain: "Legal", overrideRate: 34, disputes: 85 },
  ],
  aiAgreementPct: 76,
  annotatorAgreementPct: 54,
};
