"use client";

import { useState, useEffect } from "react";
import { 
  Button 
} from "@/components/ui";
import { 
  ShoppingCart,
  Grid3X3,
  LayoutList,
  Database,
  FileText,
  Languages
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DatasetCard } from "@/features/buyer/components/dataset-card";
import { MarketplaceFilters, MarketplaceFiltersState } from "@/features/buyer/components/marketplace-filters";
import { Dataset as UIDataset } from "@/features/buyer/data/mock-datasets";
import apiClient from "@/services/api-client";
import { API_ENDPOINTS } from "@/services/endpoints";

const DEFAULT_FILTERS: MarketplaceFiltersState = {
  q: "",
  domain: "",
  year: "",
  minSize: "",
  maxPrice: "",
  ordering: "newest",
  page: 1,
  pageSize: 20,
};

const DATASET_PAGE_SIZE = 20;

function DatasetSkeleton() {
  return (
    <div className="rounded-2xl border bg-card animate-pulse">
      <div className="h-48 bg-muted/30" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-muted/30 rounded w-3/4" />
        <div className="h-6 bg-muted/30 rounded" />
        <div className="flex gap-2">
          <div className="h-4 bg-muted/30 rounded flex-1" />
          <div className="h-4 bg-muted/30 rounded flex-1" />
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [datasets, setDatasets] = useState<UIDataset[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MarketplaceFiltersState>(DEFAULT_FILTERS);

  const handleFilterChange = (patch: Partial<MarketplaceFiltersState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      const isPageOnly = Object.keys(patch).length === 1 && Object.prototype.hasOwnProperty.call(patch, "page");
      if (!isPageOnly) next.page = 1;
      return next;
    });
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  useEffect(() => {
    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setLoading(true);

      try {
        const params: Record<string, string | number> = {
          ordering: filters.ordering,
          page: filters.page,
          page_size: filters.pageSize,
        };

        if (filters.q.trim()) params.q = filters.q.trim();
        if (filters.domain) params.domain = filters.domain;
        if (filters.year) params.year = Number(filters.year);
        if (filters.minSize) params.min_size = Number(filters.minSize);
        if (filters.maxPrice) params.max_price = Number(filters.maxPrice);

        const res = await apiClient.get(API_ENDPOINTS.DATASETS.LIST, { params });
        const data = res.data;

        // map API response to UI dataset shape
        const mapped: UIDataset[] = (data.results || []).map((item: any) => {
          const metrics = item.metrics || {};
          const bytes = Number(metrics.dataset_size_bytes || 0);

          function formatBytes(b: number) {
            if (!b) return '0 B';
            const sizes = ['B','KB','MB','GB','TB'];
            const i = Math.floor(Math.log(b) / Math.log(1024));
            return parseFloat((b / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
          }

          return {
            id: item.id,
            title: item.title,
            domain: item.domain || '',
            subdomain: item.subdomain || '',
            size: formatBytes(bytes),
            qcScore: Math.round((metrics.avg_qc_score || 0) * 100),
            chunkCount: Number(metrics.chunk_count || 0),
            tokenCount: Number(metrics.token_count || 0),
            price: parseFloat(item.price) || 0,
            license: (item.license_type || '').toUpperCase() as any,
            language: item.language || '',
            createdYear: item.collection_year || (item.created_at ? new Date(item.created_at).getFullYear() : new Date().getFullYear()),
            status: item.status || 'Published',
            documentsCount: Number(metrics.total_documents || 0),
            annotationCoverage: Math.round((metrics.annotation_coverage || 0) * 100),
            expertValidation: (metrics.expert_validation_ratio || 0) > 0,
            description: item.description || '',
            sampleChunks: []
          } as UIDataset;
        });

        if (!cancelled) {
          setDatasets(mapped);
          setCount(typeof data.count === 'number' ? data.count : null);
        }
      } catch (err) {
        console.error('Failed to fetch datasets', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [filters]);

  return (
    <div className="space-y-8 pb-20 max-w-[1400px] mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-[0.2em]">
            <ShoppingCart className="w-4 h-4" />
            Global Marketplace
          </div>
          <h1 className="text-4xl font-black tracking-tight">Discover Datasets</h1>
          <p className="text-muted-foreground font-medium">
            Explore {count ?? 0} specialized Amharic datasets curated by linguistics experts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-muted/40 p-1.5 rounded-2xl border">
          <Button 
            variant={viewMode === "grid" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setViewMode("grid")}
            className="rounded-xl h-9 font-bold gap-2"
          >
            <Grid3X3 className="w-4 h-4" />
            Grid View
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setViewMode("list")}
            className="rounded-xl h-9 font-bold gap-2"
          >
            <LayoutList className="w-4 h-4" />
            Detail View
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Filters - Sticky */}
        <div className="w-full lg:w-80 shrink-0">
          <MarketplaceFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Dataset Grid Area */}
        <div className="flex-1 space-y-12">
          {loading ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <DatasetSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4 p-6 rounded-3xl border bg-card animate-pulse">
                    <div className="w-32 h-32 bg-muted/30 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-muted/30 rounded w-1/2" />
                      <div className="h-6 bg-muted/30 rounded" />
                      <div className="flex gap-2 text-xs">
                        <div className="h-4 bg-muted/30 rounded flex-1" />
                        <div className="h-4 bg-muted/30 rounded flex-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : datasets.length === 0 ? (
            <div className="h-[400px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-8 space-y-4">
               <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-muted-foreground" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-xl font-black">No Datasets Found</h3>
                  <p className="text-muted-foreground max-w-xs">Try adjusting your filters or search keywords to find what you're looking for.</p>
               </div>
              <Button variant="outline" className="font-bold" onClick={handleResetFilters}>Clear All Filters</Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {datasets.map((ds) => (
                <DatasetCard key={ds.id} dataset={ds} />
              ))}
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {datasets.map((ds) => (
                <div key={ds.id} className="group p-6 rounded-3xl border bg-card hover:border-primary/50 transition-all flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-xl hover:shadow-primary/5">
                   <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                         <h3 className="text-xl font-black group-hover:text-primary transition-colors">{ds.title}</h3>
                         <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">{ds.domain}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground font-medium">
                         <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> {ds.size}</span>
                         <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {ds.chunkCount.toLocaleString()} Chunks</span>
                         <span className="flex items-center gap-1.5"><Languages className="w-3.5 h-3.5" /> {ds.language}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-2xl font-black text-primary whitespace-nowrap">ETB {ds.price.toLocaleString()}</div>
                      <div className="flex items-center gap-2">
                        <Link href={`/marketplace/${ds.id}`}>
                          <Button variant="ghost" className="font-bold">Details</Button>
                        </Link>
                        <Button className="font-bold shadow-lg shadow-primary/20">Buy Now</Button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          )}

          {!loading && datasets.length > 0 && (
            <div className="flex items-center justify-between gap-3 pt-8 border-t">
              <p className="text-xs font-semibold text-muted-foreground">
                Page {filters.page} of {Math.max(1, Math.ceil((count || 0) / DATASET_PAGE_SIZE))}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={filters.page === 1}
                  onClick={() => handleFilterChange({ page: Math.max(1, filters.page - 1) })}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={filters.page >= Math.ceil((count || 0) / DATASET_PAGE_SIZE)}
                  onClick={() => handleFilterChange({ page: filters.page + 1 })}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
