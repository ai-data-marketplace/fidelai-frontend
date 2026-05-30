import { ExpertPerformanceRecords } from "@/features/expert/components/performance";
import { FileText, ShieldCheck } from "lucide-react";

export default function ExpertPerformancePage() {
  return (
    <div className="space-y-12 pb-20">
      <section className="border-b pb-8">
        <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] mb-2">
          <FileText className="w-3.5 h-3.5" />
          Performance Log
        </div>
        <h1 className="text-4xl font-black tracking-tighter">
          Resolution Records
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed mt-1">
          Review the factual records of your final authority decisions over
          escalated batches.
        </p>
      </section>

      <section>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 max-w-3xl mb-8">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-primary/80 font-medium leading-relaxed">
            These records serve as the definitive ground truth for the master
            training payload. These resolutions supersede all annotator
            majorities.
          </p>
        </div>

        <ExpertPerformanceRecords />
      </section>
    </div>
  );
}
