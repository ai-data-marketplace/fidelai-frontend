// ─── Annotator Mock Data ────────────────────────────────────────────────────

export const annotatorStats = {
  tasksCompleted: 32,
  accuracyPercent: 91.4,
  currentStreak: 7,
  totalPoints: 2_840,
};

export const recentActivity = [
  {
    id: "act-001",
    action: "Validated",
    taskId: "TASK-1082",
    domain: "Health",
    result: "Agreed",
    timestamp: "2026-04-14T14:35:00Z",
  },
  {
    id: "act-002",
    action: "Validated",
    taskId: "TASK-1079",
    domain: "Legal",
    result: "Escalated",
    timestamp: "2026-04-14T12:10:00Z",
  },
  {
    id: "act-003",
    action: "Validated",
    taskId: "TASK-1071",
    domain: "Finance",
    result: "Agreed",
    timestamp: "2026-04-13T17:50:00Z",
  },
  {
    id: "act-004",
    action: "Validated",
    taskId: "TASK-1065",
    domain: "Tech",
    result: "Pending",
    timestamp: "2026-04-13T09:15:00Z",
  },
  {
    id: "act-005",
    action: "Validated",
    taskId: "TASK-1058",
    domain: "Health",
    result: "Agreed",
    timestamp: "2026-04-12T16:00:00Z",
  },
];

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Task {
  id: string;
  domain: string;
  chunks: number;
  estimatedMinutes: number;
  difficulty: Difficulty;
  description: string;
}

export const taskQueue: Task[] = [
  {
    id: "TASK-1095",
    domain: "Health",
    chunks: 12,
    estimatedMinutes: 20,
    difficulty: "Easy",
    description:
      "Review and validate Amharic medical transcription segments for accuracy.",
  },
  {
    id: "TASK-1096",
    domain: "Legal",
    chunks: 8,
    estimatedMinutes: 35,
    difficulty: "Hard",
    description: "Annotate legal clauses in translated contract documents.",
  },
  {
    id: "TASK-1097",
    domain: "Finance",
    chunks: 15,
    estimatedMinutes: 25,
    difficulty: "Medium",
    description: "Verify numerical entities in financial report translations.",
  },
  {
    id: "TASK-1098",
    domain: "Tech",
    chunks: 10,
    estimatedMinutes: 18,
    difficulty: "Easy",
    description: "Label named entities in software documentation chunks.",
  },
  {
    id: "TASK-1099",
    domain: "Agriculture",
    chunks: 20,
    estimatedMinutes: 40,
    difficulty: "Medium",
    description:
      "Validate crop-disease terminology in field report translations.",
  },
];

export type ConsensusStatus =
  | "Agreed"
  | "Partially Agreed"
  | "Disputed (Escalated)";

export interface CompletedTask {
  id: string;
  domain: string;
  chunksCompleted: number;
  accuracy: number;
  date: string;
  consensusStatus: ConsensusStatus;
}

export const completedTasks: CompletedTask[] = [
  {
    id: "TASK-1082",
    domain: "Health",
    chunksCompleted: 12,
    accuracy: 94.2,
    date: "2026-04-14",
    consensusStatus: "Agreed",
  },
  {
    id: "TASK-1079",
    domain: "Legal",
    chunksCompleted: 8,
    accuracy: 78.5,
    date: "2026-04-14",
    consensusStatus: "Disputed (Escalated)",
  },
  {
    id: "TASK-1071",
    domain: "Finance",
    chunksCompleted: 15,
    accuracy: 96.0,
    date: "2026-04-13",
    consensusStatus: "Agreed",
  },
  {
    id: "TASK-1065",
    domain: "Tech",
    chunksCompleted: 10,
    accuracy: 88.3,
    date: "2026-04-13",
    consensusStatus: "Partially Agreed",
  },
  {
    id: "TASK-1058",
    domain: "Health",
    chunksCompleted: 9,
    accuracy: 91.7,
    date: "2026-04-12",
    consensusStatus: "Agreed",
  },
  {
    id: "TASK-1050",
    domain: "Agriculture",
    chunksCompleted: 20,
    accuracy: 85.0,
    date: "2026-04-11",
    consensusStatus: "Agreed",
  },
  {
    id: "TASK-1044",
    domain: "Legal",
    chunksCompleted: 6,
    accuracy: 72.0,
    date: "2026-04-10",
    consensusStatus: "Disputed (Escalated)",
  },
];

export const accuracyOverTime = [
  { week: "W1 Mar", accuracy: 82 },
  { week: "W2 Mar", accuracy: 85 },
  { week: "W3 Mar", accuracy: 88 },
  { week: "W4 Mar", accuracy: 86 },
  { week: "W1 Apr", accuracy: 90 },
  { week: "W2 Apr", accuracy: 91.4 },
];

export const tasksPerWeek = [
  { week: "W1 Mar", tasks: 3 },
  { week: "W2 Mar", tasks: 5 },
  { week: "W3 Mar", tasks: 6 },
  { week: "W4 Mar", tasks: 4 },
  { week: "W1 Apr", tasks: 7 },
  { week: "W2 Apr", tasks: 7 },
];

export const pointsEarned = [
  { week: "W1 Mar", points: 320 },
  { week: "W2 Mar", points: 510 },
  { week: "W3 Mar", points: 620 },
  { week: "W4 Mar", points: 400 },
  { week: "W1 Apr", points: 490 },
  { week: "W2 Apr", points: 500 },
];

export interface TaskChunk {
  id: string;
  text: string;
}

export const mockTaskChunks: Record<string, TaskChunk[]> = {
  "TASK-1095": [
    {
      id: "chunk-1",
      text: "የህክምና መረጃ በግልጽ መቀመጥ አለበት። ይህ በሽተኞች ስለ ጤንነታቸው ሙሉ መረጃ እንዲያገኙ ይረዳል።",
    },
    {
      id: "chunk-2",
      text: "የደም ግፊት መጨመር ብዙ ጊዜ ምልክት አያሳይም፤ ስለዚህ መደበኛ ምርመራ ማድረግ አስፈላጊ ነው።",
    },
    {
      id: "chunk-3",
      text: "ስኳር በሽታን ለመቆጣጠር አመጋገብ እና የአካል ብቃት እንቅስቃሴ ወሳኝ ድርሻ አላቸው።",
    },
  ],
  default: [
    {
      id: "c-1",
      text: "በአዲስ አበባ ከተማ አስተዳደር የትራፊክ ፍሰት ለማሻሻል አዳዲስ መንገዶች እየተገነቡ ነው።",
    },
    { id: "c-2", text: "የቴክኖሎጂ እድገት በኢኮኖሚው ላይ ትልቅ ተጽዕኖ እያሳደረ ይገኛል።" },
    { id: "c-3", text: "የአየር ንብረት ለውጥ በአለም አቀፍ ደረጃ ከፍተኛ ስጋት እየፈጠረ ነው።" },
    { id: "c-4", text: "ባህላዊ እሴቶቻችንን በመጠበቅ ለቀጣይ ትውልድ ማስተላለፍ የሁላችንም ሃላፊነት ነው።" },
    { id: "c-5", text: "በገጠር አካባቢዎች የንጹህ መጠጥ ውሃ አቅርቦት ለማስፋፋት ጥረቶች እየተደረጉ ነው።" },
  ],
};
