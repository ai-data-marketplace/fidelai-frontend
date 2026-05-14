"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronRight, Filter, Inbox, Stethoscope, Scale, BarChart2, Cpu, Leaf, HelpCircle, Clock, Layers, CheckCircle2, XCircle } from "lucide-react";
import { useExpertTasks, useAcceptExpertTask, useDeclineExpertTask } from "@/lib/hooks";
import { PAGINATION } from "@/lib/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EXPERT_PAGE_SIZE = PAGINATION.DEFAULT_PAGE_SIZE;

function formatTaskCode(taskId: string) {
  const compact = taskId.replace(/-/g, "").slice(0, 5).toUpperCase();
  return `Task-${compact}`;
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

function formatDomain(domain: string) {
  if (!domain) return "Unknown";
  return domain.charAt(0).toUpperCase() + domain.slice(1);
}

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

const domainIcon: Record<string, React.ReactNode> = {
  health: <Stethoscope className="h-4 w-4" />,
  legal: <Scale className="h-4 w-4" />,
  finance: <BarChart2 className="h-4 w-4" />,
  tech: <Cpu className="h-4 w-4" />,
  agriculture: <Leaf className="h-4 w-4" />,
};

const domainColor: Record<string, string> = {
  health: "bg-blue-500/10 text-blue-500",
  legal: "bg-purple-500/10 text-purple-500",
  finance: "bg-emerald-500/10 text-emerald-500",
  tech: "bg-cyan-500/10 text-cyan-500",
  agriculture: "bg-lime-500/10 text-lime-600",
};

const statusStyle: Record<string, string> = {
  "in_progress": "bg-amber-500/10 text-amber-600 border-amber-500/30",
  "submitted": "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  "assigned": "bg-blue-500/10 text-blue-600 border-blue-500/30",
};

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <Inbox className="w-8 h-8 text-muted-foreground" />
      </div>
      <div>
        <p className="text-lg font-black tracking-tight">No tasks available</p>
        <p className="text-sm text-muted-foreground mt-1">
          Check back soon — new tasks are assigned regularly.
        </p>
      </div>
    </div>
  );
}

function ExpertTaskCard({
  task,
  onResolve,
  onDecline,
  accepting,
  declining,
}: {
  task: any;
  onResolve: (taskId: string) => void;
  onDecline: (taskId: string) => void;
  accepting: boolean;
  declining: boolean;
}) {
  const domainKey = task.domain?.toLowerCase() ?? "";
  const icon = domainIcon[domainKey] ?? <HelpCircle className="h-4 w-4" />;
  const iconColor = domainColor[domainKey] ?? "bg-muted text-muted-foreground";
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
            {/* Domain Icon */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}
            >
              {icon}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  {formatTaskCode(task.id)}
                </span>
                <Badge variant="outline" className={`text-xs font-bold ${statusClass}`}>
                  {formatStatus(task.status)}
                </Badge>
                <Badge variant="outline" className="text-xs font-bold">
                  {formatDomain(task.domain)}
                </Badge>
              </div>

              <p className="text-base font-black tracking-tight">{task.name}</p>

              <div className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  {task.total_chunks} Chunks
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Assigned {formatDate(task.assigned_at)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col gap-2 shrink-0">
              {isAssigned && (
                <>
                  <Button
                    size="sm"
                    className="flex-1 sm:flex-none gap-1.5 font-bold"
                    disabled={accepting}
                    onClick={() => onResolve(task.id)}
                  >
                    <Check className="h-3.5 w-3.5" />
                    Resolve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 sm:flex-none gap-1.5 font-bold text-muted-foreground hover:text-destructive hover:border-destructive/40"
                    disabled={declining}
                    onClick={() => onDecline(task.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                    Decline
                  </Button>
                </>
              )}
              {isInProgress && (
                <Link href={`/expert/workspace/${task.id}`} className="flex-1 sm:flex-none">
                  <Button
                    size="sm"
                    className="w-full gap-1.5 font-bold"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Continue
                  </Button>
                </Link>
              )}
              {isSubmitted && (
                <Badge className="flex-1 sm:flex-none justify-center gap-1.5 font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/10 cursor-default">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ExpertQueueList() {
  const router = useRouter();
  const [status, setStatus] = useState<'assigned' | 'in_progress' | 'submitted'>('assigned');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useExpertTasks({ page, page_size: EXPERT_PAGE_SIZE, status });
  
  const acceptMutation = useAcceptExpertTask();
  const declineMutation = useDeclineExpertTask();

  const tasks = data?.results || [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / EXPERT_PAGE_SIZE));
  const hasPrevious = Boolean(data?.previous) && page > 1;
  const hasNext = Boolean(data?.next) && page < totalPages;

  const handleResolve = async (taskId: string) => {
    await acceptMutation.mutateAsync(taskId);
    router.push(`/expert/workspace/${taskId}`);
  };

  const handleDecline = async (taskId: string) => {
    await declineMutation.mutateAsync(taskId);
  };

  const handleStatusChange = (newStatus: 'assigned' | 'in_progress' | 'submitted') => {
    setStatus(newStatus);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5 text-sm text-muted-foreground">Loading tasks...</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Filter */}
      <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-border/50">
        {[
          { value: 'assigned' as const, label: 'Assigned' },
          { value: 'in_progress' as const, label: 'In Progress' },
          { value: 'submitted' as const, label: 'Submitted' },
        ].map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={status === f.value ? "default" : "outline"}
            onClick={() => handleStatusChange(f.value)}
            className="font-semibold"
          >
            {f.label}
          </Button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          tasks.map((task) => (
            <ExpertTaskCard
              key={task.id}
              task={task}
              onResolve={handleResolve}
              onDecline={handleDecline}
              accepting={acceptMutation.isPending}
              declining={declineMutation.isPending}
            />
          ))
        )}
      </AnimatePresence>

      {tasks.length > 0 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-xs font-semibold text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!hasPrevious}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!hasNext}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
