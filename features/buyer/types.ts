export interface MarketplaceDatasetAsset {
  file_format: string;
  file: string;
  file_size_bytes: number;
}

export interface MarketplaceDatasetSample {
  text: string;
  label: string;
  quality_score: number;
}

export interface MarketplaceDatasetMetrics {
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

export interface MarketplaceDataset {
  id: string | number;
  title: string;
  description: string;
  domain: string;
  subdomain: string;
  language: string;
  license_type: string;
  nlp_task_type: string;
  price: number;
  version: string;
  status: string;
  collection_year: number;
  created_at: string;
  created_by: string;
  approved_by?: string | null;
  approved_at?: string | null;
  build_config?: unknown;
  metrics: MarketplaceDatasetMetrics;
  assets: MarketplaceDatasetAsset[];
  samples: MarketplaceDatasetSample[];
  sample_quality_scores?: number[];
  total_contributors?: number;
}