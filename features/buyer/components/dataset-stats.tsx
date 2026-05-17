"use client";

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui";
import { 
  BarChart3, 
  PieChart, 
  Activity, 
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  Users
} from "lucide-react";
import { MarketplaceDataset } from "../types";

interface DatasetStatsProps {
  dataset: MarketplaceDataset;
}

export function DatasetStats({ dataset }: DatasetStatsProps) {
  const sampleScores = dataset.sample_quality_scores?.length
    ? dataset.sample_quality_scores
    : (dataset.samples || []).map((sample) => sample.quality_score);
  const labelDistribution = dataset.metrics.label_distribution || {};
  const domainDistribution = dataset.metrics.domain_distribution || {};

  const statsCols = [
    {
      label: "Chunk Distribution",
      value: `${dataset.metrics.chunk_count.toLocaleString()} chunks`,
      desc: `${dataset.metrics.total_documents.toLocaleString()} documents processed`,
      icon: Layers,
      color: "text-blue-600",
      bg: "bg-blue-500/10"
    },
    {
      label: "Token Density",
      value: `${Math.round(dataset.metrics.token_count / Math.max(dataset.metrics.chunk_count, 1)).toLocaleString()}`,
      desc: "Avg tokens per chunk",
      icon: Sparkles,
      color: "text-amber-600",
      bg: "bg-amber-500/10"
    },
    {
      label: "Domain Coverage",
      value: dataset.domain,
      desc: "Focused on " + dataset.domain + " domain",
      icon: Search,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      label: "Expert Validation Ratio",
      value: `${Math.round(dataset.metrics.expert_validation_ratio * 100)}%`,
      desc: "Ratio validated by experts",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10"
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        Dataset Health & Metrics
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCols.map((stat) => (
          <Card key={stat.label} className="border-border/50 shadow-sm transition-all hover:bg-muted/5 group">
            <CardContent className="p-6">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{stat.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Sample Quality Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-24 flex items-end gap-2 px-2 pt-4">
                {sampleScores.length ? sampleScores.map((score, i) => {
                  const barHeight = Math.max(12, Math.round(score * 100));

                  return (
                    <div key={i} className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary transition-colors cursor-pointer group relative" style={{ height: `${barHeight}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Score: {Math.round(score * 100)}%
                      </div>
                    </div>
                  );
                }) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    No sample scores available.
                  </div>
                )}
             </div>
             <p className="text-center text-[10px] text-muted-foreground mt-2 italic font-medium">Sample quality scores from the purchase preview</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Contributor Diversity
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center gap-4 py-4">
               <div>
                 <p className="text-sm font-bold">{dataset.total_contributors ?? 0} Contributors</p>
                 <p className="text-[10px] text-muted-foreground leading-tight">Data sourced from approved contributors across the pipeline.</p>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary" />
              Label Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.keys(labelDistribution).length ? Object.entries(labelDistribution).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="capitalize text-muted-foreground">{label}</span>
                <span className="font-bold">{Number(value).toLocaleString()}</span>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No label distribution available.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              Domain Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.keys(domainDistribution).length ? Object.entries(domainDistribution).map(([domain, value]) => (
              <div key={domain} className="flex items-center justify-between text-sm">
                <span className="capitalize text-muted-foreground">{domain}</span>
                <span className="font-bold">{Number(value).toLocaleString()}</span>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No domain distribution available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
