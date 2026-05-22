"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { ArrowRight, LayoutDashboard, Library, Search, Sparkles, Zap, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { DatasetCard } from "@/features/buyer/components/dataset-card";
import type { Dataset } from "@/features/buyer/data/mock-datasets";
import { useBuyerDashboard, usePurchases } from "@/lib/hooks";

function toNumber(value: string | number | null | undefined) {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(String(value ?? "0"));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatFileSize(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / Math.pow(1024, unitIndex);
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function mapBuyerDataset(dataset: {
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
  metrics: {
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
  };
  assets: Array<{ id: string; file_format: string; file_size_bytes: number }>;
}): Dataset {
  return {
    id: dataset.id,
    title: dataset.title,
    domain: dataset.domain,
    subdomain: dataset.subdomain,
    size: formatFileSize(dataset.metrics.dataset_size_bytes),
    qcScore: dataset.metrics.avg_qc_score,
    chunkCount: dataset.metrics.chunk_count,
    tokenCount: dataset.metrics.token_count,
    price: toNumber(dataset.price),
    license: dataset.license_type.toUpperCase() as Dataset["license"],
    language: dataset.language,
    createdYear: dataset.collection_year,
    status: dataset.status as Dataset["status"],
    documentsCount: dataset.metrics.total_documents,
    annotationCoverage: dataset.metrics.annotation_coverage,
    expertValidation: dataset.metrics.expert_validation_ratio > 0,
    description: dataset.description,
    sampleChunks: [],
  };
}

export default function BuyerDashboard() {
  const { data, isLoading, isError } = useBuyerDashboard();
  const { data: purchasesData, isLoading: isPurchasesLoading } = usePurchases(1);
  const recommendedDatasets = (data?.datasets ?? []).slice(0, 3).map(mapBuyerDataset);
  const recentDatasets = (data?.recent_datasets ?? []).slice(0, 3).map(mapBuyerDataset);
  const purchasedNames = (purchasesData?.results ?? []).slice(0, 4).map((purchase) => purchase.dataset_title);

  return (
    <div className="space-y-10 pb-20">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Buyer Portal
          </div>
          <h1 className="text-4xl font-black tracking-tighter">Welcome back, Amanuel</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Discover and purchase high-quality Amharic NLP datasets for your AI models.
          </p>
        </div>
        <Link href="/buyer/marketplace">
          <Button size="lg" className="h-14 px-8 font-black gap-3 shadow-xl shadow-primary/20 rounded-2xl group transition-all hover:scale-105 active:scale-95">
            <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Go to Marketplace
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </section>

      {isLoading && (
        <div className="flex items-center justify-center p-12">
          <svg className="h-6 w-6 animate-spin text-primary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z" />
          </svg>
        </div>
      )}

      {isError && !isLoading && (
        <Card className="border-dashed border-border/50 bg-card/40">
          <CardContent className="p-8 text-center text-muted-foreground">
            Unable to load buyer dashboard data.
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && (
        <>
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  Recommended for You
                </h2>
                <Link href="/buyer/marketplace" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 group">
                  Browse All
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedDatasets.map((ds) => (
                  <DatasetCard key={ds.id} dataset={ds} />
                ))}
                {!recommendedDatasets.length && (
                  <Card className="md:col-span-2 border-dashed border-border/50 bg-card/40">
                    <CardContent className="p-8 text-center text-muted-foreground">
                      No recommended datasets yet.
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <Library className="w-6 h-6 text-primary" />
                Quick Access
              </h2>
              <Card className="border-primary/20 bg-primary/5 shadow-inner">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary opacity-60">My Library</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isPurchasesLoading ? (
                    <div className="rounded-xl border border-dashed border-border/50 bg-card/60 p-4 text-xs text-muted-foreground">
                      Loading your purchased datasets...
                    </div>
                  ) : purchasedNames.length ? (
                    <div className="space-y-3">
                      {purchasedNames.map((name) => (
                        <div key={name} className="flex items-center justify-between p-3 rounded-xl bg-card border shadow-sm group hover:border-primary transition-all cursor-pointer">
                          <span className="text-xs font-bold truncate pr-4 text-foreground">{name}</span>
                          <ArrowRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border/50 bg-card/60 p-4 text-xs text-muted-foreground">
                      Your purchased datasets will appear here.
                    </div>
                  )}
                  <Link href="/buyer/library" className="block">
                    <Button variant="outline" className="w-full text-xs font-black uppercase tracking-widest gap-2 bg-card border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm">
                      Open Full Library
                      <Library className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <Zap className="w-6 h-6 text-primary" />
              Recently Published
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {recentDatasets.map((ds) => (
                <DatasetCard key={ds.id} dataset={ds} />
              ))}
              {!recentDatasets.length && (
                <Card className="col-span-full border-dashed border-border/50 bg-card/40">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No recent datasets available.
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
