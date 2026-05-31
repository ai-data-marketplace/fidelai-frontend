import { AdminMetrics } from "@/features/admin/components/admin-metrics";
import { SystemActivityTimeline } from "@/features/admin/components/system-activity-timeline";
import { QuickActions } from "@/features/admin/components/quick-actions";
import { LayoutDashboard, Zap, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-10 pb-20">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Admin Control
          </div>
          <h1 className="text-4xl font-black tracking-tighter">
            Welcome back, Admin
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Monitor system health, approve submissions, and manage platform
            growth.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <AdminMetrics />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-2xl font-black tracking-tight">
                Quick Operations
              </h2>
            </div>
            <QuickActions />
          </div>
        </div>

        <div className="lg:col-span-4 h-full">
          <SystemActivityTimeline />
        </div>
      </section>
    </div>
  );
}
