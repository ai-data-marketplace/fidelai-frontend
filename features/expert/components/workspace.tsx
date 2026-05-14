"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useExpertChunks } from "@/lib/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Settings2, 
  AlertTriangle,
  Bot,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
  Database,
  TrendingUp,
  BarChart3
} from "lucide-react";

interface WorkspaceProps {
  taskId: string;
}

function formatTaskCode(taskId: string) {
  const compact = taskId.replace(/-/g, "").slice(0, 5).toUpperCase();
  return `Task-${compact}`;
}

export function ExpertWorkspace({ taskId }: WorkspaceProps) {
  const router = useRouter();
  const { data: chunksData, isLoading: isChunksLoading } = useExpertChunks(taskId);

  const taskDetails = {
    id: chunksData?.task_id ?? taskId,
    name: chunksData?.name ?? "",
    domain: chunksData?.domain ?? "unknown",
  };

  // Use only API response, no mock fallback
  const chunks = chunksData?.task_chunks?.map((chunk) => ({
    id: `chunk-${chunk.chunk_id}`,
    text: chunk.text,
    consensusScore: Math.round(chunk.consensus.agreement_score * 100),
    qualityScore: chunk.quality_score,
    requiresExpertReview: chunk.consensus.requires_expert_review,
    ai: {
      predictedDomain: chunk.domain,
      confidence: chunk.quality_score,
      flags: { harmful: false, duplicate: false, noise: false },
    },
    consensus: {
      domainMatch: chunk.consensus.final_domain_match === "match" ? "Match" : "Not Match",
      isAmharic: chunk.consensus.final_is_amharic,
      readability: chunk.consensus.final_readability,
      safetyLabel: chunk.consensus.final_safety_label,
      harmful: chunk.consensus.final_safety_label !== "safe",
      agreementPct: Math.round(chunk.consensus.agreement_score * 100),
      status: chunk.consensus.agreement_score > 0.8 ? "Strong Consensus" : chunk.consensus.agreement_score > 0.5 ? "Weak Consensus" : "Conflict",
    },
    source: chunk.source,
    annotationCount: chunk.annotation_count,
  })) || [];
  
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const [answers, setAnswers] = useState<any[]>(
    Array(Math.max(chunks.length, 1)).fill({
      domainMatch: null,
      isAmharic: null,
      quality: null,
      harmful: null,
      reasoning: ""
    })
  );

  const [domainMatch, setDomainMatch] = useState<string | null>(null);
  const [isAmharic, setIsAmharic] = useState<boolean | null>(null);
  const [quality, setQuality] = useState<string | null>(null);
  const [isHarmful, setIsHarmful] = useState<boolean | null>(null);
  const [reasoning, setReasoning] = useState("");

  const currentChunk = chunks[currentIndex];
  const progressPercent = ((currentIndex) / chunks.length) * 100;

  // Sync state when currentIndex changes to preserve UI forward/back
  useEffect(() => {
    const saved = answers[currentIndex];
    if (saved) {
      setDomainMatch(saved.domainMatch);
      setIsAmharic(saved.isAmharic);
      setQuality(saved.quality);
      setIsHarmful(saved.harmful);
      setReasoning(saved.reasoning);
    }
  }, [currentIndex, answers]);

  const saveCurrentState = () => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = {
      domainMatch,
      isAmharic,
      quality,
      harmful: isHarmful,
      reasoning
    };
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (isComplete) return;
    saveCurrentState();
    
    if (currentIndex < chunks.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      saveCurrentState();
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleExit = () => {
    router.push("/expert/queue");
  };

  if (isChunksLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading expert review task...
      </div>
    );
  }

  if (!chunksData || chunks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center">
        <AlertTriangle className="w-12 h-12 text-muted-foreground" />
        <div>
          <h2 className="text-2xl font-black mb-2">No chunks found</h2>
          <p className="text-sm text-muted-foreground mb-6">This task has no items to review.</p>
          <Button onClick={() => router.push("/expert/queue")}>Return to Queue</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] w-full overflow-hidden bg-background">
      
      {/* ─── Top Bar ─── */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push("/expert/queue")}
            className="h-9 w-9 p-0 rounded-lg border-border/50 bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
               <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-primary" /> {formatTaskCode(taskDetails.id)}
               </h2>
               <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                 {taskDetails.domain}
               </span>
            </div>
            <div className="flex items-center gap-3">
               <p className="text-xs font-bold text-muted-foreground w-14">
                 {currentIndex + 1} / {chunks.length}
               </p>
               <Progress value={progressPercent} className="w-40 h-1.5" />
            </div>
          </div>
        </div>

        <Button variant="outline" onClick={handleExit} className="gap-2 text-muted-foreground hover:text-foreground">
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Exit Session</span>
        </Button>
      </div>

      {/* ─── 3 Column Grid Area ─── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 overflow-hidden">
        
        {/* COLUMN 1: Source Material */}
        <div className="lg:col-span-4 flex flex-col min-h-0">
           <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 shrink-0 flex items-center gap-2">
             <Database className="w-4 h-4" /> Source Payload
           </h3>
           <Card className="flex-1 border-border/50 bg-card/40 overflow-auto shadow-inner border-dashed relative">
             <CardContent className="p-8 pb-32"> {/* padding bottom so floating elements don't cover text */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentChunk?.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <p className="text-2xl font-medium leading-loose text-foreground/90 tracking-tight">
                      {currentChunk?.text}
                    </p>
                  </motion.div>
                </AnimatePresence>
             </CardContent>
           </Card>
        </div>

        {/* COLUMN 2: Contest Context (AI vs Annotators) */}
        <div className="lg:col-span-4 flex flex-col min-h-0 bg-muted/10 rounded-2xl p-4 border border-border/30 overflow-auto no-scrollbar">
           <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 shrink-0 flex items-center gap-2">
             <Settings2 className="w-4 h-4" /> Conflict Analysis
           </h3>

           {/* Consensus Header */}
           <div className={`flex items-center justify-between p-4 rounded-xl border mb-6 ${
             currentChunk?.consensus.status === 'Conflict' 
               ? 'border-rose-500/30 bg-rose-500/10' 
               : currentChunk?.consensus.status === 'Weak Consensus' 
               ? 'border-amber-500/30 bg-amber-500/10'
               : 'border-emerald-500/30 bg-emerald-500/10'
           }`}>
             <div>
               <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                 currentChunk?.consensus.status === 'Conflict' ? 'text-rose-600' :
                 currentChunk?.consensus.status === 'Weak Consensus' ? 'text-amber-600' : 'text-emerald-600'
               }`}>
                 {currentChunk?.consensus.status}
               </p>
               <h4 className={`text-2xl font-black ${
                 currentChunk?.consensus.status === 'Conflict' ? 'text-rose-700' :
                 currentChunk?.consensus.status === 'Weak Consensus' ? 'text-amber-700' : 'text-emerald-700'
               }`}>
                 {currentChunk?.consensus.agreementPct}% Agreement
               </h4>
             </div>
             {currentChunk?.consensus.status === 'Conflict' ? (
               <XCircle className="w-8 h-8 text-rose-500/50" />
             ) : currentChunk?.consensus.status === 'Weak Consensus' ? (
               <AlertTriangle className="w-8 h-8 text-amber-500/50" />
             ) : (
               <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
             )}
           </div>

           <div className="space-y-6">
              {/* Chunk Quality Block */}
              <div className="space-y-3">
                 <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground flex items-center gap-1.5 opacity-70">
                   <TrendingUp className="w-3.5 h-3.5" /> Chunk Quality
                 </p>
                 <Card className="border-border/50 bg-card/80 shadow-sm border-l-4 border-l-blue-500">
                   <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-border/50">
                        <span className="text-xs font-bold text-muted-foreground">Quality Score:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black">{Math.round((currentChunk?.qualityScore || 0) * 100)}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs font-bold text-muted-foreground">Annotations:</span>
                        <span className="text-xs font-black">{currentChunk?.annotationCount ?? 0}</span>
                      </div>
                   </CardContent>
                 </Card>
              </div>

              {/* Consensus Annotation Block */}
              <div className="space-y-3">
                 <div className="flex items-center justify-between opacity-70">
                   <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                     <Users className="w-3.5 h-3.5" /> Consensus Annotation
                   </p>
                 </div>
                 <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed mb-1">
                   * Aggregated from {currentChunk?.annotationCount || 0} independent annotator decisions.
                 </p>
                 
                 <Card className="border-border/50 bg-card shadow-sm text-xs border-l-4 border-l-emerald-500 relative overflow-hidden">
                   <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-border/50">
                        <span className="text-xs font-bold text-muted-foreground">Domain Match:</span>
                        <span className={`font-bold ${
                          currentChunk?.consensus.domainMatch === 'Match' ? 'text-emerald-500' : 
                          currentChunk?.consensus.domainMatch === 'Not Match' ? 'text-rose-500' : 'text-amber-500'
                        }`}>
                          {currentChunk?.consensus.domainMatch}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border/50">
                        <span className="text-xs font-bold text-muted-foreground">Is Amharic:</span>
                        <span className={`font-bold ${currentChunk?.consensus.isAmharic ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {currentChunk?.consensus.isAmharic ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border/50">
                        <span className="text-xs font-bold text-muted-foreground">Readability:</span>
                        <span className="text-xs font-black">{currentChunk?.consensus.readability || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground">Safety Label:</span>
                        <span className="text-xs font-black">{currentChunk?.consensus.safetyLabel || '-'}</span>
                      </div>
                   </CardContent>
                 </Card>
              </div>
           </div>
        </div>

        {/* COLUMN 3: Authority Decision Panel */}
        <div className="lg:col-span-4 flex flex-col min-h-0 overflow-auto no-scrollbar pb-0 px-1 relative">
           <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 shrink-0 flex items-center gap-2">
             <ShieldCheck className="w-4 h-4 text-primary" /> Authority Resolution
           </h3>

           <div className="flex-1 space-y-6">
             {/* 1. Final Domain */}
             <div className="space-y-2.5">
                <label className="text-sm font-bold">1. Final Domain Match</label>
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={() => setDomainMatch('Match')} className={`py-2 rounded-xl text-xs font-bold border transition-colors ${domainMatch === 'Match' ? 'bg-primary border-primary text-white' : 'bg-card border-border/50 hover:bg-muted'}`}>Match</button>
                   <button onClick={() => setDomainMatch('Not Match')} className={`py-2 rounded-xl text-xs font-bold border transition-colors ${domainMatch === 'Not Match' ? 'bg-rose-500 border-rose-500 text-white' : 'bg-card border-border/50 hover:bg-muted'}`}>Not Match</button>
                </div>
             </div>

             <hr className="border-border/50" />

             {/* 2. Valid Amharic */}
             <div className="space-y-2.5">
                <label className="text-sm font-bold text-foreground">2. Is Valid Amharic?</label>
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={() => setIsAmharic(true)} className={`py-2 rounded-xl text-xs font-bold border transition-colors ${isAmharic === true ? 'bg-primary border-primary text-white' : 'bg-card border-border/50 hover:bg-muted'}`}>Yes</button>
                   <button onClick={() => setIsAmharic(false)} className={`py-2 rounded-xl text-xs font-bold border transition-colors ${isAmharic === false ? 'bg-rose-500 border-rose-500 text-white' : 'bg-card border-border/50 hover:bg-muted'}`}>No</button>
                </div>
             </div>

             <hr className="border-border/50" />

             {/* 3. Content Quality */}
             <div className="space-y-2.5">
                <label className="text-sm font-bold text-foreground">3. Content Quality</label>
                <div className="grid grid-cols-3 gap-2">
                   {['Clean', 'Noisy', 'Duplicate'].map(opt => (
                     <button key={opt} onClick={() => setQuality(opt)} className={`py-2 rounded-xl text-[11px] font-bold border transition-colors ${quality === opt ? 'bg-primary border-primary text-white' : 'bg-card border-border/50 hover:bg-muted'}`}>{opt}</button>
                   ))}
                </div>
             </div>

             <hr className="border-border/50" />

             {/* 4. Safety */}
             <div className="space-y-2.5">
                <label className="text-sm font-bold text-foreground">4. Harmful / Sensitive?</label>
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={() => setIsHarmful(true)} className={`py-2 rounded-xl text-xs font-bold border transition-colors ${isHarmful === true ? 'bg-rose-500 border-rose-500 text-white' : 'bg-card border-border/50 hover:bg-muted'}`}>Yes</button>
                   <button onClick={() => setIsHarmful(false)} className={`py-2 rounded-xl text-xs font-bold border transition-colors ${isHarmful === false ? 'bg-primary border-primary text-white' : 'bg-card border-border/50 hover:bg-muted'}`}>No</button>
                </div>
             </div>

             <hr className="border-border/50" />

             {/* Mandatory Reasoning */}
             <div className="space-y-2.5">
                <label className="text-sm font-black flex items-center gap-2 text-rose-500">
                  5. Authority Reasoning <span className="text-[9px] uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded-full font-black">Required</span>
                </label>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Explain why you made this final decision overriding the AI or annotators.</p>
                <textarea
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  placeholder="The prediction failed because..."
                  className="w-full h-28 rounded-xl border border-rose-500/30 bg-rose-500/5 focus:bg-card focus:border-primary/50 p-4 text-sm resize-none outline-none transition-all"
                />
             </div>
           </div>

            <div className="pt-4 shrink-0 sticky bottom-0 bg-background/95 backdrop-blur-md pb-4 mt-auto space-y-3 z-10 w-full border-t-0 shadow-[0_-10px_20px_-5px_hsl(var(--background))] ">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={currentIndex === 0}
                  className="h-14 px-5 border-border/50 bg-card hover:bg-muted"
                >
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!domainMatch || isAmharic === null || !quality || isHarmful === null || reasoning.length < 5}
                  className="w-full h-14 text-sm font-black tracking-widest uppercase gap-2 shadow-xl shadow-primary/20"
                >
                   <CheckCircle2 className="w-5 h-5" /> Submit & Continue
                </Button>
              </div>
              
              <div className="flex justify-between gap-3">
                <Button variant="outline" className="w-full text-xs font-bold text-rose-500 border-border/50 bg-card hover:bg-rose-500/10 h-10">
                  <XCircle className="w-3.5 h-3.5 mr-2" /> Reject Chunk
                </Button>
              </div>
           </div>
        </div>
      </div>

      {/* Completion Modal */}
      <Modal isOpen={isComplete} onClose={handleExit} className="max-w-md text-center p-8 border-primary/20">
         <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10" />
         </div>
         <h2 className="text-3xl font-black mb-2 tracking-tighter">Resolution Applied</h2>
         <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
           Your authoritative decisions have been logged. The dataset will be compiled using your overridings.
         </p>
         
         <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl border bg-card text-center col-span-2">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Escalations Eliminated</p>
               <p className="text-2xl font-black">{chunks.length}</p>
            </div>
         </div>

         <Button className="w-full h-12 font-black text-sm uppercase tracking-widest" onClick={handleExit}>
           Return to Queue
         </Button>
      </Modal>

    </div>
  );
}
