"use client";

import { 
  Card, 
  CardContent, 
  CardFooter,
  Badge,
  Button
} from "@/components/ui";
import { 
  FileText, 
  Coins, 
  CheckCircle2, 
  ChevronRight,
  Database,
  Calendar,
  ShieldCheck,
  Languages
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Dataset } from "../data/mock-datasets";

interface DatasetCardProps {
  dataset: Dataset;
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  const formatTokenCount = (count: number) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M Tokens`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K Tokens`;
    return `${count.toLocaleString()} Tokens`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full group overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 bg-card flex flex-col">
        <CardContent className="p-6 flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                {dataset.title}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-medium text-[10px] uppercase tracking-wider">
                  {dataset.domain}
                </Badge>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{dataset.subdomain}</span>
              </div>
            </div>
            {/* percentage badge removed per design */}
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {dataset.description}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
              <Database className="w-3.5 h-3.5 text-primary" />
              {dataset.size}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
              <FileText className="w-3.5 h-3.5 text-primary" />
              {dataset.chunkCount.toLocaleString()} Chunks
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
              <Coins className="w-3.5 h-3.5 text-primary" />
              {formatTokenCount(dataset.tokenCount)}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              {dataset.license}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
              <Languages className="w-3.5 h-3.5 text-primary" />
              {dataset.language}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              {dataset.createdYear}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-4 flex items-center justify-between gap-2 border-t bg-muted/30">
          <div className="text-base font-black text-primary whitespace-nowrap">
            ETB {dataset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Link href={`/buyer/marketplace/${dataset.id}`}>
              <Button size="sm" variant="ghost" className="h-8 px-2.5 text-[11px] font-bold whitespace-nowrap">
                Details
              </Button>
            </Link>
            <Button size="sm" className="h-8 px-3 text-[11px] font-bold shadow-md shadow-primary/20 whitespace-nowrap">
              Buy Now
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
