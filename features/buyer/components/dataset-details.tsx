"use client";

import { useState } from "react";
import { 
  Badge, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
} from "@/components/ui";
import { 
  ShoppingCart, 
  Eye, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Info,
  Layers,
  FileJson,
  FileText,
  Table,
  Cpu,
  Fingerprint
} from "lucide-react";
import { MarketplaceDataset } from "../types";
import { PurchaseModal } from "./purchase-modal";
import { DatasetStats } from "./dataset-stats";
import { SampleChunks } from "./sample-chunks";
import { motion } from "framer-motion";

interface DatasetDetailsProps {
  dataset: MarketplaceDataset;
}

const pipelineSteps = [
  "Uploaded",
  "AI QC",
  "Annotation",
  "Expert Review",
  "NLP Labeling",
  "Aggregation",
  "Published",
];

export function DatasetDetails({ dataset }: DatasetDetailsProps) {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const statusMap: Record<string, number> = {
    draft: 0,
    uploaded: 0,
    processing: 1,
    qc: 1,
    annotation: 2,
    annotated: 2,
    expert_review: 3,
    expert_reviewed: 3,
    nlp_labeling: 4,
    aggregation: 5,
    approved: 6,
    published: 6,
  };
  const currentStepIndex = statusMap[String(dataset.status).toLowerCase()] ?? 5;

  const formatTokenCount = (count: number) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(2)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(2)}K`;
    return `${count.toLocaleString()}`;
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${sizes[index]}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-8 bg-card border rounded-3xl p-8 shadow-xl shadow-primary/5">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1 font-black text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-[10px]">
              {dataset.domain}
            </Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm font-medium text-muted-foreground">{dataset.subdomain}</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">{dataset.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {dataset.description}
          </p>
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">License</span>
              <span className="font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                {dataset.license_type.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col border-l pl-6">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">QC Score</span>
              <span className="font-bold text-xl text-emerald-600 font-mono tracking-tighter">
                {Math.round((dataset.metrics.avg_qc_score || 0) * 100)}/100
              </span>
            </div>
            <div className="flex flex-col border-l pl-6">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</span>
              <Badge variant="success" className="w-fit mt-1">
                {dataset.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="lg:w-80 flex flex-col gap-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-muted-foreground uppercase">Dataset Price</span>
                <p className="text-4xl font-black tracking-tighter text-primary">
                  ETB {Number(dataset.price).toFixed(2)}
                </p>
              </div>
              <div className="space-y-3">
                <Button 
                  className="w-full h-12 font-bold text-lg shadow-lg shadow-primary/20 gap-3"
                  onClick={() => setIsPurchaseModalOpen(true)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Purchase Dataset
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 font-bold gap-3"
                  onClick={() => {
                    const el = document.getElementById("sample-preview");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  <Eye className="w-5 h-5" />
                  View Sample
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stats & Chunks */}
        <div className="lg:col-span-8 space-y-8">
          {/* Pipeline Visualization */}
          <Card className="border-border/50 shadow-sm overflow-hidden">
             <CardHeader className="bg-muted/30 border-b py-4">
                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  Processing Pipeline
                </CardTitle>
             </CardHeader>
             <CardContent className="p-8">
                <div className="relative flex justify-between gap-2 max-w-4xl mx-auto">
                   {pipelineSteps.map((step, idx) => {
                     const isCompleted = idx <= currentStepIndex;
                     const isCurrent = idx === currentStepIndex;
                     return (
                       <div key={step} className="flex flex-col items-center gap-3 relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 scale-90 ${
                            isCompleted ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 'bg-background border-muted text-muted-foreground'
                          } ${isCurrent ? 'ring-4 ring-primary/20 scale-100' : ''}`}>
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <div className="text-[10px] font-black">{idx + 1}</div>}
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider text-center max-w-[80px] ${
                            isCompleted ? 'text-primary' : 'text-muted-foreground opacity-50'
                          }`}>
                            {step}
                          </span>
                       </div>
                     );
                   })}
                   <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10" />
                   <div 
                    className="absolute top-5 left-0 h-0.5 bg-primary -z-10 transition-all duration-1000 ease-out" 
                    style={{ width: `${(currentStepIndex / (pipelineSteps.length - 1)) * 100}%` }}
                   />
                </div>
             </CardContent>
          </Card>

          <DatasetStats dataset={dataset} />
          
          <div id="sample-preview">
            <SampleChunks samples={dataset.samples || []} />
          </div>
        </div>

        {/* Right Column: Metadata & Downloads */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-border/50">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-primary" />
                Technical Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y text-sm">
                {[
                  { label: "Total Documents", value: dataset.metrics.total_documents.toLocaleString() },
                  { label: "Chunk Count", value: dataset.metrics.chunk_count.toLocaleString() },
                  { label: "Token Count", value: formatTokenCount(dataset.metrics.token_count) },
                  { label: "Avg QC Score", value: `${Math.round(dataset.metrics.avg_qc_score * 100)}%` },
                  { label: "Annotation Coverage", value: `${Math.round(dataset.metrics.annotation_coverage * 100)}%` },
                  { label: "Expert Validation Ratio", value: `${Math.round(dataset.metrics.expert_validation_ratio * 100)}%` },
                  { label: "Language", value: dataset.language },
                  { label: "Collection Year", value: dataset.collection_year },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 px-6 hover:bg-muted/20 transition-colors">
                    <span className="text-muted-foreground font-medium">{item.label}</span>
                    <span className="font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
             <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-primary" />
                  Purchase Assets
                </CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {dataset.assets?.length ? dataset.assets.map((asset) => {
                    const AssetIcon = asset.file_format === "csv" || asset.file_format === "tsv"
                      ? Table
                      : asset.file_format === "txt"
                        ? FileText
                        : FileJson;

                    return (
                      <button 
                        key={`${asset.file_format}-${asset.file}`}
                        disabled
                        className="p-3 rounded-xl border-2 border-dashed border-muted bg-muted/10 opacity-60 flex flex-col items-center gap-1 group cursor-not-allowed"
                      >
                        <AssetIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-xs font-black uppercase">{asset.file_format}</span>
                        <span className="text-[10px] text-muted-foreground">{formatBytes(asset.file_size_bytes)}</span>
                      </button>
                    );
                  }) : (
                    <div className="col-span-2 rounded-xl border border-dashed bg-muted/10 p-4 text-center text-xs text-muted-foreground">
                      No assets were returned for this dataset.
                    </div>
                  )}
                </div>
             </CardContent>
          </Card>
        </div>
      </div>

      <PurchaseModal 
        dataset={dataset}
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </div>
  );
}
