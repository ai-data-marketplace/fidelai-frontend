"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@/components/ui";
import { Quote, Hash, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface Sample {
  text: string;
  label: string;
  quality_score: number;
}

interface SampleChunksProps {
  samples: Sample[];
  onPurchase?: () => void;
}

export function SampleChunks({ samples, onPurchase }: SampleChunksProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Quote className="w-5 h-5 text-primary" />
          Sample Data Preview
        </h3>
        <Badge
          variant="outline"
          className="text-secondary-foreground flex gap-2 items-center bg-secondary/10 border-none"
        >
          <Zap className="w-3 h-3 text-secondary-foreground" />
          Showing {samples.length || 0} purchase samples
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {samples.length === 0 ? (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
              <Lock className="w-10 h-10 opacity-20" />
              <p className="font-medium">
                Sample data is unavailable for this dataset.
              </p>
              <p className="text-xs">
                Purchase required for the full sample set and assets.
              </p>
            </CardContent>
          </Card>
        ) : (
          samples.map((sample, idx) => (
            <motion.div
              key={`${sample.label}-${idx}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="group border-border/50 hover:border-primary/30 transition-all shadow-sm">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x">
                    {/* Metadata Sidebar */}
                    <div className="md:w-48 p-4 bg-muted/30 flex flex-col gap-3 shrink-0">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                          Label
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold capitalize">
                          <Hash className="w-3 h-3 text-primary" />
                          {sample.label.replace(/_/g, " ")}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                          Quality
                        </span>
                        <Badge
                          className={`text-[10px] px-2 py-0 h-5 font-black ${
                            sample.quality_score >= 0.95
                              ? "bg-emerald-500/20 text-emerald-700"
                              : "bg-primary/20 text-primary"
                          } border-none shadow-none`}
                        >
                          QC {Math.round(sample.quality_score * 100)}%
                        </Badge>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 bg-card group-hover:bg-muted/5 transition-colors">
                      <div className="overflow-hidden rounded-lg bg-muted/20 p-4 border border-dashed text-sm">
                        <pre className="font-mono text-sm whitespace-pre-wrap text-foreground/90">
                          {JSON.stringify(
                            { text: sample.text, label: sample.label },
                            null,
                            2,
                          )}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}

        {samples.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="border-dashed bg-muted/10">
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border shadow-sm">
                    <Lock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold uppercase tracking-widest text-primary">
                      Content Locked
                    </span>
                  </div>
                  <h4 className="font-semibold">Want to see more?</h4>
                  <p className="text-sm text-muted-foreground">
                    Purchase the dataset to unlock the full sample set and
                    downloadable assets.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onPurchase?.()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white font-semibold hover:opacity-95"
                    >
                      Purchase to Download
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
