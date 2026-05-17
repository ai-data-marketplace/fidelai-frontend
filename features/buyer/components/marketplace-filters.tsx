"use client";

import { 
  Input, 
  Select, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button
} from "@/components/ui";
import { 
  Search, 
  RotateCcw,
  SlidersHorizontal,
  SortAsc
} from "lucide-react";

export interface MarketplaceFiltersState {
  q: string;
  domain: string;
  year: string;
  minSize: string;
  maxPrice: string;
  ordering: "newest" | "oldest";
  page: number;
  pageSize: number;
}

interface MarketplaceFiltersProps {
  filters: MarketplaceFiltersState;
  onChange: (patch: Partial<MarketplaceFiltersState>) => void;
  onReset: () => void;
}

const domains = [
  { value: "general", label: "General" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "law", label: "Law" },
  { value: "finance", label: "Finance" },
  { value: "news", label: "News" },
  { value: "religion", label: "Religion" },
];

export function MarketplaceFilters({ filters, onChange, onReset }: MarketplaceFiltersProps) {
  const clampNonNegative = (value: string) => {
    if (value === "") return "";
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return "";
    return String(Math.max(0, parsed));
  };

  return (
    <Card className="h-fit sticky top-24 border-border/50 shadow-sm">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-[10px] uppercase font-bold text-muted-foreground gap-1 hover:text-primary"
            onClick={onReset}
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase">Search Keywords</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={filters.q}
              onChange={(e) => onChange({ q: e.target.value })}
              placeholder="News, Law, Health..."
              className="pl-9 h-10 text-sm"
            />
          </div>
        </div>

        {/* Domain Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase">Domain</label>
          <Select
            value={filters.domain}
            onChange={(e) => onChange({ domain: e.target.value })}
            className="text-sm"
          >
            <option value="">All Domains</option>
            {domains.map((domain) => (
              <option key={domain.value} value={domain.value}>
                {domain.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Year Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase">Created Year</label>
          <Input
            type="number"
            min={0}
            value={filters.year}
            onChange={(e) => onChange({ year: clampNonNegative(e.target.value) })}
            onKeyDown={(e) => {
              if (e.key === "-") e.preventDefault();
            }}
            placeholder="e.g. 2023"
            className="text-sm h-10"
          />
        </div>

        {/* Min Size (MB) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase">Min Size (MB)</label>
          <Input
            type="number"
            min={0}
            value={filters.minSize}
            onChange={(e) => onChange({ minSize: clampNonNegative(e.target.value) })}
            onKeyDown={(e) => {
              if (e.key === "-") e.preventDefault();
            }}
            placeholder="e.g. 50"
            className="text-sm h-10"
          />
        </div>

        {/* Max Price */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase">Max Price</label>
          <Input
            type="number"
            min={0}
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: clampNonNegative(e.target.value) })}
            onKeyDown={(e) => {
              if (e.key === "-") e.preventDefault();
            }}
            placeholder="e.g. 500"
            className="text-sm h-10"
          />
        </div>

        {/* Sort Order */}
        <div className="pt-4 border-t space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
              <SortAsc className="w-3.5 h-3.5" />
              Sort By
            </label>
            <Select
              value={filters.ordering}
              onChange={(e) => onChange({ ordering: e.target.value as "newest" | "oldest" })}
              className="text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
