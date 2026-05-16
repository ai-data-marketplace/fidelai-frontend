"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { LogOut, CheckCircle2, ChevronRight, ChevronLeft, XCircle, Info } from "lucide-react";
import {
  useNlpTaskDetail,
  useNlpTaskProgress,
  useAnnotateNlpChunk,
} from "@/lib/hooks";
import { motion, AnimatePresence } from "framer-motion";

interface NlpWorkspaceProps {
  taskId: string;
}

// ─── Label Mappings by Task Type ──────────────────────────────────────────

const LABEL_MAPPINGS: Record<
  string,
  {
    labels: string[];
    colors?: Record<string, string>;
  }
> = {
  sentiment: {
    labels: ["positive", "negative", "neutral"],
    colors: {
      positive: "bg-emerald-500",
      negative: "bg-rose-500",
      neutral: "bg-amber-500",
    },
  },
  ner: {
    labels: ["person", "location", "organization", "date", "other"],
    colors: {
      person: "bg-blue-500",
      location: "bg-purple-500",
      organization: "bg-indigo-500",
      date: "bg-pink-500",
      other: "bg-gray-500",
    },
  },
  toxicity: {
    labels: ["toxic", "safe"],
    colors: {
      toxic: "bg-rose-500",
      safe: "bg-emerald-500",
    },
  },
  qa: {
    labels: ["correct", "incorrect", "partially_correct", "unclear"],
    colors: {
      correct: "bg-emerald-500",
      incorrect: "bg-rose-500",
      partially_correct: "bg-amber-500",
      unclear: "bg-gray-500",
    },
  },
};

function formatTaskCode(taskId: string) {
  const compact = taskId.replace(/-/g, "").slice(0, 5).toUpperCase();
  return `Task-${compact}`;
}

function formatElapsedTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatLabelDisplay(label: string) {
  return label
    .split(/[_-]/g)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function NlpWorkspace({ taskId }: NlpWorkspaceProps) {
  const router = useRouter();
  const { data: task, isLoading: taskLoading, isError: taskError } = useNlpTaskDetail(taskId);
  const { data: progress } = useNlpTaskProgress(taskId);
  const annotateChunk = useAnnotateNlpChunk();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [confidenceScore, setConfidenceScore] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [localAnnotations, setLocalAnnotations] = useState<Record<string, any>>({});
  const initializedRef = useRef(false);

  const currentChunk = task?.chunks?.[currentIndex];
  const taskType = task?.task_type?.toLowerCase() || "";
  const labelConfig = LABEL_MAPPINGS[taskType] || LABEL_MAPPINGS.sentiment;

  // Initialize first unannotated chunk
  useEffect(() => {
    if (task?.chunks && task.chunks.length > 0 && !initializedRef.current) {
      const firstUnannotatedIndex = task.chunks.findIndex((chunk) => chunk.previous_annotation === null);
      if (firstUnannotatedIndex !== -1) {
        setCurrentIndex(firstUnannotatedIndex);
      }
      initializedRef.current = true;
    }
  }, [task]);

  // Handle chunk caching and state restore
  useEffect(() => {
    if (!currentChunk) return;

    if (localAnnotations[currentChunk.chunk_id]) {
      const cached = localAnnotations[currentChunk.chunk_id];
      setSelectedLabel(cached.selectedLabel || null);
      setConfidenceScore(cached.confidenceScore || 1);
      setNotes(cached.notes || "");
      return;
    }

    if (currentChunk.previous_annotation) {
      const labels = currentChunk.previous_annotation.labels ?? {};
      const previousLabel = labels[taskType] ?? Object.values(labels)[0] ?? null;
      const parsedConfidence = Number.parseFloat(String(currentChunk.previous_annotation.confidence_score));

      setSelectedLabel(previousLabel ?? null);
      setConfidenceScore(Number.isFinite(parsedConfidence) ? parsedConfidence : 1);
      setNotes(currentChunk.previous_annotation.notes || "");
      return;
    }

    setSelectedLabel(null);
    setConfidenceScore(1);
    setNotes("");
  }, [currentIndex, currentChunk, localAnnotations, taskType]);

  // Timer management
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setElapsedSeconds(0);

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, task?.chunks]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSubmit = async () => {
    if (!currentChunk || !selectedLabel || !task || isSubmitting) return;

    setIsSubmitting(true);

    const payload = {
      labels: {
        [taskType]: selectedLabel.toLowerCase(),
      },
      confidence_score: confidenceScore,
      time_spent_seconds: elapsedSeconds,
      notes: notes || undefined,
    };

    try {
      await annotateChunk.mutateAsync({
        chunkId: currentChunk.chunk_id,
        payload,
      });

      setLocalAnnotations((prev) => ({
        ...prev,
        [currentChunk.chunk_id]: {
          selectedLabel,
          confidenceScore,
          notes,
          time_spent_seconds: elapsedSeconds,
        },
      }));

      if (currentIndex < (task.chunks?.length ?? 0) - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsComplete(true);
      }
    } catch (error) {
      console.error("Failed to submit annotation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    if (currentIndex < (task?.chunks?.length ?? 0) - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleExit = () => {
    router.push("/annotator/tasks");
  };

  if (taskLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <h2 className="text-2xl font-black">Loading task...</h2>
      </div>
    );
  }

  if (taskError || !task || !task.chunks || task.chunks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <h2 className="text-2xl font-black">Failed to load task</h2>
        <Button onClick={handleExit}>Return to Tasks</Button>
      </div>
    );
  }

  if (!currentChunk && !isComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <h2 className="text-2xl font-black">Chunk not found</h2>
        <Button onClick={handleExit}>Return to Tasks</Button>
      </div>
    );
  }

  const progressPercent = progress?.completion_percentage ?? ((currentIndex + 1) / task.chunks.length) * 100;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] w-full overflow-hidden">
      {/* ─── Top Bar ─── */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight">{formatTaskCode(taskId)}</h2>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                {task.task_type}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-xs font-bold text-muted-foreground w-12 mr-1">
                {currentIndex + 1} / {task.chunks?.length ?? 0}
              </p>
              <Progress value={progressPercent} className="w-32 h-1.5" />
              <p className="text-xs font-bold text-muted-foreground">
                {progressPercent.toFixed(0)}%
              </p>
              <div className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/40 px-3 py-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Timer</span>
                <span className="text-xs font-bold text-foreground tabular-nums">{formatElapsedTime(elapsedSeconds)}</span>
              </div>
            </div>
          </div>
        </div>

        <Button variant="outline" onClick={handleExit} className="gap-2 text-muted-foreground hover:text-foreground">
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Exit</span>
        </Button>
      </div>

      {/* ─── Main Content Split ─── */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden gap-6 lg:gap-10 pt-6">
        {/* Left Panel: Text Viewer */}
        <div className="flex-1 flex flex-col min-h-[250px] overflow-hidden">
          <div className="mb-4 shrink-0 px-1">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">
              Source Text Chunk
            </h3>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-primary" />
              Review this text and select the appropriate label.
            </p>
          </div>
          <Card className="flex-1 border-border/50 bg-card/60 backdrop-blur-sm overflow-auto shadow-sm">
            <CardContent className="p-12 h-full flex flex-col justify-start pt-16">
              <AnimatePresence mode="wait">
                {currentChunk && (
                  <motion.div
                    key={currentChunk.chunk_id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                  >
                    <p className="text-2xl md:text-3xl font-medium leading-relaxed tracking-tight text-foreground/90 pb-8 text-center" style={{ lineHeight: "1.8" }}>
                      {currentChunk.text}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Annotation Controls */}
        <div className="w-full lg:w-[450px] shrink-0 flex flex-col overflow-auto h-full px-1 no-scrollbar">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4 shrink-0">
            Dynamic Labels ({task.task_type})
          </h3>

          <div className="space-y-7 flex-1 pb-6">
            {/* Label Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground">Select the appropriate label for this text:</label>
              <div className="grid grid-cols-2 gap-2">
                {labelConfig.labels.map((label) => (
                  <button
                    key={label}
                    onClick={() => setSelectedLabel(label)}
                    className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all ${
                      selectedLabel === label
                        ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                        : "bg-card border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {formatLabelDisplay(label)}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-border/50" />

            {/* Confidence Score */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground flex justify-between">
                <span>Confidence Score</span>
                <span className="text-primary font-black">{(confidenceScore * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={confidenceScore}
                onChange={(e) => setConfidenceScore(parseFloat(e.target.value))}
                className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex gap-2 text-[10px] text-muted-foreground">
                <span>Low</span>
                <span className="flex-1 text-center">Medium</span>
                <span className="text-right">High</span>
              </div>
            </div>

            <hr className="border-border/50" />

            {/* Notes */}
            <div className="space-y-2 pb-2">
              <label className="text-sm font-bold text-muted-foreground flex justify-between">
                <span>Notes</span>
                <span className="opacity-50 text-xs">Optional</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Type any comments here..."
                className="w-full h-24 rounded-xl border border-border/50 bg-card/60 p-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-border/50 space-y-3 shrink-0 bg-background sticky bottom-0">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="h-12 px-4 shadow-sm text-foreground bg-card hover:bg-muted/60"
                onClick={handleBack}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1 lg:mr-0" /> <span className="hidden lg:inline">Back</span>
              </Button>
              <Button
                className="flex-1 h-12 text-sm font-black gap-2 shadow-lg shadow-primary/20 group transition-all"
                onClick={handleSubmit}
                disabled={!selectedLabel || isSubmitting}
              >
                Submit & Next <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-10 text-xs font-bold text-muted-foreground hover:bg-muted/50"
                onClick={handleSkip}
                disabled={currentIndex >= (task?.chunks?.length ?? 0) - 1}
              >
                <XCircle className="w-3.5 h-3.5 mr-1.5" /> Skip
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      <Modal isOpen={isComplete} onClose={handleExit} className="max-w-md text-center p-8">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black mb-2">Task Completed 🎉</h2>
        <p className="text-muted-foreground mb-8 text-sm">
          Great work! Your annotations have been saved.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl border bg-card text-center col-span-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Progress</p>
            <p className="text-2xl font-black">{progressPercent.toFixed(0)}%</p>
          </div>
          <div className="p-4 rounded-xl border bg-emerald-500/5 border-emerald-500/20 text-center col-span-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Total Chunks</p>
            <p className="text-xl font-bold text-emerald-600">{progress?.total_chunks ?? task.chunks?.length ?? 0}</p>
          </div>
        </div>

        <Button className="w-full h-12 font-black text-sm" onClick={handleExit}>
          Return to Tasks
        </Button>
      </Modal>
    </div>
  );
}
