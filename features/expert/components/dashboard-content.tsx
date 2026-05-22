"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
  MessageSquareText
} from "lucide-react";
import { useExpertDashboard } from "@/lib/hooks";
import Link from "next/link";
import { motion } from "framer-motion";

export function ExpertDashboardContent() {
  const { data, isLoading, isError } = useExpertDashboard();
  const highlights = data?.highlights ?? [];
  const recentActivity = data?.recent_activity ?? [];

  const iconMap = [ShieldCheck, AlertTriangle, ShieldCheck, ShieldCheck];
  const colors = [
    { bg: "bg-rose-50", color: "text-rose-600" },
    { bg: "bg-emerald-50", color: "text-emerald-600" },
    { bg: "bg-amber-50", color: "text-amber-600" },
    { bg: "bg-blue-50", color: "text-blue-600" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <svg className="h-6 w-6 animate-spin text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z" />
        </svg>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center border rounded-2xl bg-card/30 border-dashed">
        <MessageSquareText className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-black">Unable to load expert dashboard</h3>
        <p className="text-muted-foreground text-sm mt-2 max-w-sm">
          Please try refreshing the page or contact support if the issue persists.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      
      {/* Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {highlights.slice(0, 4).map((highlight, idx) => {
          const Icon = iconMap[idx % iconMap.length];
          const tone = colors[idx % colors.length];
          return (
            <Card key={highlight.key} className="border-border/50 bg-card/60 backdrop-blur-sm transition-hover hover:border-primary/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{highlight.label}</p>
                  <div className={`p-2 rounded-lg ${tone.bg}`}><Icon className={`w-5 h-5 ${tone.color}`} /></div>
                </div>
                <p className="text-4xl font-black tracking-tighter">{highlight.display_value ?? String(highlight.value)}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Recent Activity */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black uppercase tracking-widest text-muted-foreground">Recent Activity</h2>
        </div>
        
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
          <div className="divide-y divide-border/50">
            {recentActivity.length ? (
              recentActivity.slice(0, 5).map((activity) => {
                const taskId = activity.id.slice(0, 8).toUpperCase();
                return (
                  <div key={activity.id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-primary mb-1">Task-{taskId}</p>
                      <p className="text-sm font-semibold">{activity.task_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.status}</p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {activity.completed_at ? (
                        <p>Completed on {new Date(activity.completed_at).toLocaleDateString()}</p>
                      ) : (
                        <p>Assigned on {new Date(activity.assigned_at).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <ShieldCheck className="w-8 h-8 opacity-20 mx-auto mb-3" />
                <p className="text-sm font-bold">No recent activity</p>
              </div>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
