export interface Dataset {
  id: string;
  title: string;
  domain: string;
  subdomain: string;
  size: string;
  qcScore: number;
  chunkCount: number;
  tokenCount: number;
  price: number;
  license: "MIT" | "CC-BY-4.0" | "Commercial" | "Academic";
  language: string;
  createdYear: number;
  status: "Uploaded" | "AI QC" | "Annotation" | "Expert Review" | "Aggregation" | "Published";
  documentsCount: number;
  annotationCoverage: number;
  expertValidation: boolean;
  description: string;
  sampleChunks: {
    id: string;
    text: string;
    source: string;
    qcScore: number;
    tokens: number;
  }[];
}

export const mockDatasets: Dataset[] = [
  {
    id: "ds-1",
    title: "Amharic News Corpus 2024",
    domain: "Politics",
    subdomain: "Journalism",
    size: "1.2 GB",
    qcScore: 94,
    chunkCount: 12500,
    tokenCount: 4500000,
    price: 450.00,
    license: "Commercial",
    language: "Amharic",
    createdYear: 2024,
    status: "Published",
    documentsCount: 4500,
    annotationCoverage: 98,
    expertValidation: true,
    description: "A comprehensive corpus of modern Amharic news articles collected from verified news agencies. Highly suitable for sentiment analysis and named entity recognition tasks.",
    sampleChunks: [
      { id: "ch-1", text: "የኢትዮጵያ ኢኮኖሚ በ2016 በከፍተኛ ሁኔታ እንደሚያድግ ተገልጿል።", source: "EBC", qcScore: 98, tokens: 45 },
      { id: "ch-2", text: "የአዲስ አበባ ከተማ አስተዳደር አዳዲስ የመንገድ ፕሮጀክቶችን አስመረቀ።", source: "Fana", qcScore: 92, tokens: 38 },
      { id: "ch-3", text: "በተለያዩ የሀገሪቱ ክፍሎች ዝናብ እንደሚጥል የሚቲዮሮሎጂ ኤጀንሲ አስታወቀ።", source: "Addis Zemen", qcScore: 95, tokens: 52 },
    ]
  },
  {
    id: "ds-2",
    title: "Legal Proceedings Archive",
    domain: "Law",
    subdomain: "Court Records",
    size: "850 MB",
    qcScore: 97,
    chunkCount: 8200,
    tokenCount: 2100000,
    price: 1200.00,
    license: "Academic",
    language: "Amharic",
    createdYear: 2023,
    status: "Published",
    documentsCount: 1200,
    annotationCoverage: 100,
    expertValidation: true,
    description: "Authenticated court transcripts and legal documentation from various jurisdictional levels. Expert-validated for legal terminology accuracy.",
    sampleChunks: [
      { id: "ch-4", text: "ችሎቱ በጉዳዩ ላይ የቀረቡትን ማስረጃዎች መርምሮ ውሳኔ ለመስጠት ቀጠሮ ይዟል።", source: "High Court", qcScore: 99, tokens: 60 },
      { id: "ch-5", text: "ከሳሽ በበኩላቸው የተከሳሽ ድርጊት በህግ አግባብ እንዳልሆነ ተከራክረዋል።", source: "Supreme Court", qcScore: 96, tokens: 42 },
    ]
  },
  {
    id: "ds-3",
    title: "Amharic Healthcare Dialogues",
    domain: "Health",
    subdomain: "Medical Advice",
    size: "450 MB",
    qcScore: 88,
    chunkCount: 5400,
    tokenCount: 850000,
    price: 350.00,
    license: "MIT",
    language: "Amharic",
    createdYear: 2024,
    status: "Aggregation",
    documentsCount: 850,
    annotationCoverage: 92,
    expertValidation: true,
    description: "De-identified medical dialogues and health advisory texts. Perfect for healthcare chatbot training and medical NLP applications.",
    sampleChunks: [
      { id: "ch-6", text: "የደም ግፊት ምልክቶች ከታዩብዎት በአፋጣኝ ሐኪም ማማከር ይኖርብዎታል።", source: "Health Portal", qcScore: 85, tokens: 32 },
    ]
  },
  {
    id: "ds-4",
    title: "Historical Amharic Texts",
    domain: "General",
    subdomain: "Literature",
    size: "2.5 GB",
    qcScore: 91,
    chunkCount: 22000,
    tokenCount: 9200000,
    price: 800.00,
    license: "CC-BY-4.0",
    language: "Amharic",
    createdYear: 2022,
    status: "Published",
    documentsCount: 15000,
    annotationCoverage: 85,
    expertValidation: false,
    description: "Scan-to-text historical literature and archival texts. Highly valuable for historical linguistics and deep learning models.",
    sampleChunks: []
  }
];
