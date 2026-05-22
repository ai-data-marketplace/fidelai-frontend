"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Target, Flame, Coins, TrendingUp, MessageSquareText, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import { useAnnotatorDashboard } from "@/lib/hooks";

function timeAgo(isoDate: string) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hrs = Math.floor(diff / 3_600_000);
  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const highlightStyles = [
  {
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    color: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-500/20",
  },
  {
    icon: <Target className="h-5 w-5 text-blue-500" />,
    color: "from-blue-500/10 to-blue-500/5",
    border: "border-blue-500/20",
  },
  {
    icon: <Flame className="h-5 w-5 text-orange-500" />,
    color: "from-orange-500/10 to-orange-500/5",
    border: "border-orange-500/20",
  },
  {
    icon: <Coins className="h-5 w-5 text-amber-500" />,
    color: "from-amber-500/10 to-amber-500/5",
    border: "border-amber-500/20",
  },
];

export function AnnotatorDashboardContent() {
  const { data, isLoading, isError } = useAnnotatorDashboard();
  const highlights = data?.highlights ?? [];
  const recentActivity = data?.recent_activity ?? [];

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

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center border rounded-2xl bg-card/30 border-dashed">
        <MessageSquareText className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-black">No dashboard data available</h3>
        <p className="text-muted-foreground text-sm mt-2 max-w-sm">
          Your dashboard will appear here once the analytics feed is available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Annotator Panel
          </div>
          <h1 className="text-4xl font-black tracking-tighter">Welcome back</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Track your performance, claim tasks, and level up your annotation career.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-base font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          Performance Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.slice(0, 4).map((highlight, index) => {
            const style = highlightStyles[index % highlightStyles.length];

            return (
              <motion.div
                key={highlight.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                <Card className={`bg-gradient-to-br ${style.color} border ${style.border} shadow-sm hover:shadow-md transition-shadow duration-200`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">
                      {highlight.label}
                    </CardTitle>
                    {style.icon}
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    <div className="text-3xl font-black tracking-tighter">
                      {highlight.display_value ?? String(highlight.value)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-black uppercase tracking-widest text-muted-foreground">
          Recent Activity
        </h2>
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-0">
            <ul className="divide-y divide-border/50">
              {recentActivity.map((act) => (
                <li key={act.id} className="flex flex-col gap-3 px-6 py-4 hover:bg-muted/40 transition-colors duration-150 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        {`Task-${act.id.slice(0, 5)}`}
                      </p>
                      <p className="text-sm font-bold leading-tight">
                        {act.task_name}
                      </p>
                      <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5" />
                        {timeAgo(act.completed_at || act.assigned_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <Badge variant="outline" className="text-xs font-bold bg-primary/10 text-primary border-primary/20 capitalize">
                      {act.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
