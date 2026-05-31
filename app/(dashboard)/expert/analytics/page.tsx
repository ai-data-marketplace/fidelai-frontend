import { ExpertAnalyticsDashboard } from "@/features/expert/components/analytics";
import { BarChart3 } from "lucide-react";

export default function ExpertAnalyticsPage() {
  return (
    <div className="space-y-12 pb-20">
      <section className="border-b pb-8">
        <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          Analytics Dashboard
        </div>
        <h1 className="text-4xl font-black tracking-tighter">
          Performance Insights
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed mt-1">
          Monitor your resolution metrics, overrides versus AI baselines, and
          domain-specific efficiencies.
        </p>
      </section>

      <section>
        <ExpertAnalyticsDashboard />
      </section>
    </div>
  );
}
