"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Layers,
  Timer,
  Activity,
  CheckCircle2,
  XCircle,
  Inbox,
  Stethoscope,
  Scale,
  BarChart2,
  Cpu,
  Leaf,
  HelpCircle,
} from "lucide-react";
import { useAcceptAssignment, useDeclineAssignment, useMyAssignments, type MyAssignment } from "@/lib/hooks";
import { PAGINATION } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ASSIGNMENT_PAGE_SIZE = PAGINATION.DEFAULT_PAGE_SIZE;

const STATUS_FILTERS = [
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "submitted", label: "Submitted" },
];

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

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <Inbox className="w-8 h-8 text-muted-foreground" />
      </div>
      <div>
        <p className="text-lg font-black tracking-tight">No tasks available</p>
        <p className="text-sm text-muted-foreground mt-1">
          Check back soon — new tasks are posted regularly.
        </p>
      </div>
    </div>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({
  task,
  onOpen,
  onDecline,
  accepting,
  declining,
}: {
  task: MyAssignment;
  onOpen: (taskId: string, assignmentId: string) => void;
  onDecline: (id: string) => void;
  accepting: boolean;
  declining: boolean;
}) {
  const domainKey = task.domain?.toLowerCase() ?? "";
  const icon = domainIcon[domainKey] ?? <HelpCircle className="h-4 w-4" />;
  const iconColor = domainColor[domainKey] ?? "bg-muted text-muted-foreground";
  const statusClass = statusStyle[task.status] ?? "bg-muted text-muted-foreground border-border";

  const isAssigned = task.status === "assigned";
  const isInProgress = task.status === "in_progress";
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
                  {formatTaskCode(task.task_id)}
                </span>
                <Badge variant="outline" className={`text-xs font-bold ${statusClass}`}>
                  {formatStatus(task.status)}
                </Badge>
                <Badge variant="outline" className="text-xs font-bold">
                  {formatDomain(task.domain)}
                </Badge>
              </div>

              <p className="text-base font-black tracking-tight">{task.task_name}</p>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {task.description}
              </p>

              <div className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  {task.annotated_chunks}/{task.total_chunks} chunks
                </span>
                <span className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" />
                  {task.progress_percentage}% progress
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Assigned {formatDate(task.assigned_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Timer className="h-3.5 w-3.5" />
                  Started {formatDate(task.started_at)}
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
                    onClick={() => onOpen(task.task_id, task.assignment_id)}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 sm:flex-none gap-1.5 font-bold text-muted-foreground hover:text-destructive hover:border-destructive/40"
                    disabled={declining}
                    onClick={() => onDecline(task.assignment_id)}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Decline
                  </Button>
                </>
              )}
              {isInProgress && (
                <Button
                  size="sm"
                  className="flex-1 sm:flex-none gap-1.5 font-bold"
                  disabled={accepting}
                  onClick={() => onOpen(task.task_id, task.assignment_id)}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Continue
                </Button>
              )}
              {isSubmitted && (
                <Badge className="flex-1 sm:flex-none justify-center gap-1.5 font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
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

// ─── Main Component ───────────────────────────────────────────────────────────

export function TaskQueueList() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("assigned");
  const acceptAssignment = useAcceptAssignment();
  const declineAssignment = useDeclineAssignment();

  const { data, isLoading, isError } = useMyAssignments({
    page,
    page_size: ASSIGNMENT_PAGE_SIZE,
    status,
  });

  const tasks = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / ASSIGNMENT_PAGE_SIZE));
  const hasPrevious = Boolean(data?.previous) && page > 1;
  const hasNext = Boolean(data?.next) && page < totalPages;

  const handleOpen = async (taskId: string, assignmentId: string) => {
    if (status === "assigned") {
      await acceptAssignment.mutateAsync(assignmentId);
    }
    router.push(`/annotator/workspace/${taskId}?assignmentId=${assignmentId}`);
  };

  const handleDecline = async (assignmentId: string) => {
    await declineAssignment.mutateAsync(assignmentId);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5 text-sm text-muted-foreground">Loading assignments...</CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5 text-sm text-destructive">
            Failed to load assignments. Please refresh and try again.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Filter */}
      <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-border/50">
        {STATUS_FILTERS.map((filter) => (
          <Button
            key={filter.value}
            size="sm"
            variant={status === filter.value ? "default" : "outline"}
            onClick={() => handleStatusChange(filter.value)}
            className="font-semibold"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.assignment_id}
              task={task}
              onOpen={handleOpen}
              onDecline={handleDecline}
              accepting={acceptAssignment.isPending}
              declining={declineAssignment.isPending}
            />
          ))
        )}
      </AnimatePresence>

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
    </div>
  );
}
