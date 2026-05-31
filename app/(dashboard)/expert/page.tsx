import { ExpertDashboardContent } from "@/features/expert/components/dashboard-content";
import { ShieldCheck } from "lucide-react";

export default function ExpertDashboardPage() {
  return (
    <div className="space-y-8 pb-20">
      <section className="border-b pb-8">
        <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          Expert Authority Panel
        </div>
        <h1 className="text-4xl font-black tracking-tighter">
          Reviewer Dashboard
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed mt-1 max-w-3xl">
          Overview of your resolution workload, impact scores, and pending
          urgent tasks escalated from the standard annotation pool.
        </p>
      </section>

      <ExpertDashboardContent />
    </div>
  );
}
