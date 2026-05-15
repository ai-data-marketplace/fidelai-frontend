"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Layers, Tag, Languages } from "lucide-react";
import { motion } from "framer-motion";
import type { NlpTask } from "@/lib/hooks";

function formatTaskCode(taskId: string) {
  const compact = taskId.replace(/-/g, "").slice(0, 5).toUpperCase();
  return `Task-${compact}`;
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

function formatLabel(value: string) {
  if (!value) return "Unknown";
  return value
    .split(/[_-]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const statusStyle: Record<string, string> = {
  assigned: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  in_progress: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  submitted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
};

export function NlpTaskCard({ task }: { task: NlpTask }) {
  const statusClass = statusStyle[task.status] ?? "bg-muted text-muted-foreground border-border";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 group">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary">
              <Languages className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  {formatTaskCode(task.task_id)}
                </span>
                <Badge variant="outline" className={`text-xs font-bold ${statusClass}`}>
                  {formatStatus(task.status)}
                </Badge>
                <Badge variant="outline" className="text-xs font-bold">
                  {formatLabel(task.domain)}
                </Badge>
                <Badge variant="outline" className="text-xs font-bold">
                  {formatLabel(task.task_type)}
                </Badge>
              </div>

              <p className="text-base font-black tracking-tight">{task.name}</p>

              <div className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  NLP task
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  {task.total_chunks} chunks
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  {formatLabel(task.task_type)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
