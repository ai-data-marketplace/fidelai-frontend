"use client";

import { BarChart3 } from "lucide-react";
import { AnalyticsDashboard } from "@/features/annotator/components/analytics";

export default function AnnotatorAnalyticsPage() {
  return (
    <div className="space-y-12 pb-20">
      <section className="border-b pb-8">
        <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          Analytics Dashboard
        </div>
        <h1 className="text-4xl font-black tracking-tighter">
          Annotation Analytics
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed mt-1">
          Track your performance, accuracy, and contribution quality.
        </p>
      </section>

      <section>
        <AnalyticsDashboard />
      </section>
    </div>
  );
}
