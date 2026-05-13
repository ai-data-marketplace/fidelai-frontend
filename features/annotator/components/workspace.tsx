"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { LogOut, CheckCircle2, ChevronRight, ChevronLeft, XCircle, Info } from "lucide-react";
import { 
  useAssignmentChunks, 
  useAssignmentProgress, 
  useSubmitAnnotation,
  type AssignmentChunk,
  type AnnotationPayload 
} from "@/lib/hooks";
import { motion, AnimatePresence } from "framer-motion";

interface WorkspaceProps {
  taskId: string;
  assignmentId?: string;
}

function formatTaskCode(taskId: string) {
  const compact = taskId.replace(/-/g, "").slice(0, 5).toUpperCase();
  return `Task-${compact}`;
}

function formatElapsedTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function AnnotatorWorkspace({ taskId, assignmentId }: WorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const actualAssignmentId = assignmentId || searchParams.get("assignmentId");

  const { data: chunks, isLoading: chunksLoading, isError: chunksError } = useAssignmentChunks(actualAssignmentId || "");
  const { data: progress, isLoading: progressLoading } = useAssignmentProgress(actualAssignmentId || "");
  const submitAnnotation = useSubmitAnnotation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [localAnnotations, setLocalAnnotations] = useState<Record<string, any>>({});

  useEffect(() => {
    if (chunks && chunks.length > 0 && !initializedRef.current) {
      const firstUnannotatedIndex = chunks.findIndex((chunk) => !chunk.annotation_exists);
      if (firstUnannotatedIndex !== -1) {
        setCurrentIndex(firstUnannotatedIndex);
      }
      initializedRef.current = true;
    }
  }, [chunks]);

  const [domainMatch, setDomainMatch] = useState<string | null>(null);
  const [isAmharic, setIsAmharic] = useState<boolean | null>(null);
  const [readability, setReadability] = useState("high");
  const [safetyLabel, setSafetyLabel] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentChunk = chunks?.[currentIndex];

  useEffect(() => {
    if (!currentChunk) return;

    if (localAnnotations[currentChunk.chunk_id]) {
      const cached = localAnnotations[currentChunk.chunk_id];
      setDomainMatch(cached.domain_match || null);
      setIsAmharic(cached.is_amharic !== undefined ? cached.is_amharic : null);
      setReadability(cached.readability || "high");
      setSafetyLabel(cached.safety_label || null);
      setConfidence(cached.confidence || null);
      setNotes(cached.notes || "");
      return;
    }

    if (currentChunk.annotation_exists && currentChunk.annotation) {
      setDomainMatch(currentChunk.annotation.domain_match || null);
      setIsAmharic(currentChunk.annotation.is_amharic !== undefined ? currentChunk.annotation.is_amharic : null);
      setReadability(currentChunk.annotation.readability || "high");
      setSafetyLabel(currentChunk.annotation.safety_label || null);
      setConfidence(currentChunk.annotation.confidence || null);
      setNotes(currentChunk.annotation.notes || "");
      return;
    }

    setDomainMatch(null);
    setIsAmharic(null);
    setReadability("high");
    setSafetyLabel(null);
    setConfidence(null);
    setNotes("");
  }, [currentIndex, currentChunk, localAnnotations]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setElapsedSeconds(0);

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, chunks]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSubmit = async () => {
    if (!currentChunk || !actualAssignmentId || isSubmitting) return;
    if (!domainMatch || !confidence || isAmharic === null || safetyLabel === null) return;

    setIsSubmitting(true);

    const payload: AnnotationPayload = {
      task_assignment: actualAssignmentId,
      domain_match: domainMatch.toLowerCase(),
      is_amharic: isAmharic,
      readability: readability.toLowerCase(),
      safety_label: safetyLabel.toLowerCase(),
      confidence: confidence.toLowerCase(),
      notes,
      time_spent_seconds: elapsedSeconds,
      is_skipped: false,
    };

    try {
      await submitAnnotation.mutateAsync({
        chunkId: currentChunk.chunk_id,
        payload,
      });

      setLocalAnnotations((prev) => ({
        ...prev,
        [currentChunk.chunk_id]: {
          domain_match: domainMatch,
          is_amharic: isAmharic,
          readability,
          safety_label: safetyLabel,
          confidence,
          notes,
          time_spent_seconds: elapsedSeconds,
          is_skipped: false,
        },
      }));

      if (currentIndex < (chunks?.length ?? 0) - 1) {
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

  const handleSkip = () => {
    if (currentIndex < (chunks?.length ?? 0) - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleExit = () => {
    router.push("/annotator/tasks");
  };

  if (chunksLoading || progressLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <h2 className="text-2xl font-black">Loading chunks...</h2>
      </div>
    );
  }

  if ((chunksError || !chunks || chunks.length === 0) && !isComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <h2 className="text-2xl font-black">Failed to load chunks</h2>
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

  const progressPercent = progress?.progress_percentage ?? 0;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] w-full overflow-hidden">
      {/* ─── Top Bar ─── */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight">{formatTaskCode(taskId)}</h2>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                Annotation
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-xs font-bold text-muted-foreground w-12 mr-1">
                {currentIndex + 1} / {chunks?.length ?? 0}
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
              Review this text and provide labels for quality assessment.
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
                    <p className="text-2xl md:text-3xl font-medium leading-relaxed tracking-tight text-foreground/90 pb-8 text-center" style={{ lineHeight: '1.8' }}>
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
            Annotation Labels
          </h3>

          <div className="space-y-7 flex-1 pb-6">
            {/* Section 1: Domain Match */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground">Does this text match its assigned domain?</label>
              <div className="grid grid-cols-3 gap-2">
                {['match', 'not-match', 'uncertain'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setDomainMatch(opt)}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all ${
                      domainMatch === opt 
                        ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 scale-[1.02]' 
                        : 'bg-card border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {opt.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-border/50" />

            {/* Section 2: Language Check */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground">Is this text written in Amharic?</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAmharic(true)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                    isAmharic === true 
                      ? 'bg-primary border-primary text-white shadow-md scale-[1.02]' 
                      : 'bg-card border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Yes, Amharic
                </button>
                <button
                  onClick={() => setIsAmharic(false)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                    isAmharic === false 
                      ? 'bg-rose-500 border-rose-500 text-white shadow-md scale-[1.02]' 
                      : 'bg-card border-border hover:border-rose-500/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  No, not Amharic
                </button>
              </div>
            </div>

            <hr className="border-border/50" />

            {/* Section 3: Readability */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground">How readable is this text?</label>
              <Select 
                value={readability}
                onChange={(e) => setReadability(e.target.value)}
                className="rounded-xl border-border/50 bg-card/60 h-11 text-sm font-medium"
              >
                <option value="high">High (Clear and natural)</option>
                <option value="medium">Medium (Understandable but awkward)</option>
                <option value="low">Low (Confusing or broken)</option>
              </Select>
            </div>

            <hr className="border-border/50" />

            {/* Section 4: Safety Label */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground">
                Is this text safe?
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSafetyLabel('safe')}
                  className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                    safetyLabel === 'safe' 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-md scale-[1.02]' 
                      : 'bg-card border-border hover:border-emerald-500/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Safe
                </button>
                <button
                  onClick={() => setSafetyLabel('unsafe')}
                  className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                    safetyLabel === 'unsafe' 
                      ? 'bg-rose-500 border-rose-500 text-white shadow-md scale-[1.02]' 
                      : 'bg-card border-border hover:border-rose-500/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Unsafe
                </button>
              </div>
            </div>

            <hr className="border-border/50" />

            {/* Section 5: Confidence */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground">How confident are you?</label>
              <div className="flex gap-2">
                {['high', 'medium', 'low'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setConfidence(opt)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                      confidence === opt 
                        ? 'bg-primary border-primary text-white shadow-md scale-[1.02]' 
                        : 'bg-card border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-border/50" />

            {/* Section 6: Notes */}
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
                disabled={!domainMatch || !confidence || isAmharic === null || safetyLabel === null || isSubmitting}
              >
                Submit & Next <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 h-10 text-xs font-bold text-muted-foreground hover:bg-muted/50" 
                onClick={handleSkip}
                disabled={currentIndex >= (chunks?.length ?? 0) - 1}
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
            <p className="text-xl font-bold text-emerald-600">{chunks?.length ?? 0}</p>
          </div>
        </div>

        <Button className="w-full h-12 font-black text-sm" onClick={handleExit}>
          Return to Tasks
        </Button>
      </Modal>
    </div>
  );
}

