"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ClipboardList, Layers, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { NlpTask } from "@/lib/hooks";

function formatTaskCode(taskId: string) {
  const compact = taskId.replace(/-/g, "").slice(0, 5).toUpperCase();
  return `Task-${compact}`;
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
  accepted: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  submitted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
};

export function NlpTaskCard({
  task,
  onAccept,
  onDecline,
  onOpen,
  accepting,
  declining,
}: {
  task: NlpTask;
  onAccept: (taskId: string) => void;
  onDecline: (taskId: string) => void;
  onOpen: (taskId: string) => void;
  accepting: boolean;
  declining: boolean;
}) {
  const statusClass = statusStyle[task.status] ?? "bg-muted text-muted-foreground border-border";
  const isAssigned = task.status === "assigned";
  const isInProgress = task.status === "in_progress" || task.status === "accepted";
  const isSubmitted = task.status === "submitted";

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
              <ClipboardList className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  {formatTaskCode(task.task_id)}
                </span>
                <Badge variant="outline" className={`text-xs font-bold ${statusClass}`}>
                  {task.status}
                </Badge>
                <Badge variant="outline" className="text-xs font-bold">
                  {task.task_type}
                </Badge>
              </div>

              <p className="text-base font-black tracking-tight">{task.name}</p>

              <div className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  {task.total_chunks} chunks
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {task.domain}
                </span>
              </div>
            </div>

            {isAssigned && (
              <div className="flex sm:flex-col gap-2 shrink-0">
                <Button
                  size="sm"
                  className="flex-1 sm:flex-none gap-1.5 font-bold"
                  disabled={accepting}
                  onClick={() => onAccept(task.task_id)}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 sm:flex-none gap-1.5 font-bold text-muted-foreground hover:text-destructive hover:border-destructive/40"
                  disabled={declining}
                  onClick={() => onDecline(task.task_id)}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Decline
                </Button>
              </div>
            )}
            {isInProgress && (
              <Button
                size="sm"
                className="flex-1 sm:flex-none gap-1.5 font-bold shrink-0"
                disabled={accepting}
                onClick={() => onOpen(task.task_id)}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Continue
              </Button>
            )}
            {isSubmitted && (
              <Badge className="flex-1 sm:flex-none justify-center gap-1.5 font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/10 cursor-default shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Completed
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
