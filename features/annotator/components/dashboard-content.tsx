"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Target,
  Flame,
  Coins,
  TrendingUp,
} from "lucide-react";
import {
  annotatorStats,
  recentActivity,
} from "@/features/annotator/data/mock";
import { motion } from "framer-motion";

const statCards = [
  {
    label: "Tasks Completed",
    value: annotatorStats.tasksCompleted,
    suffix: "",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    color: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-500/20",
  },
  {
    label: "Accuracy",
    value: annotatorStats.accuracyPercent,
    suffix: "%",
    icon: <Target className="h-5 w-5 text-blue-500" />,
    color: "from-blue-500/10 to-blue-500/5",
    border: "border-blue-500/20",
  },
  {
    label: "Current Streak",
    value: annotatorStats.currentStreak,
    suffix: " days",
    icon: <Flame className="h-5 w-5 text-orange-500" />,
    color: "from-orange-500/10 to-orange-500/5",
    border: "border-orange-500/20",
  },
  {
    label: "Total Points",
    value: annotatorStats.totalPoints.toLocaleString(),
    suffix: "",
    icon: <Coins className="h-5 w-5 text-amber-500" />,
    color: "from-amber-500/10 to-amber-500/5",
    border: "border-amber-500/20",
  },
];

const resultBadge: Record<string, string> = {
  Agreed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  Escalated: "bg-rose-500/10 text-rose-600 border-rose-500/30",
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/30",
};

function timeAgo(isoDate: string) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hrs = Math.floor(diff / 3_600_000);
  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function AnnotatorDashboardContent() {
  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Annotator Panel
          </div>
          <h1 className="text-4xl font-black tracking-tighter">Welcome back 👋</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Track your performance, claim tasks, and level up your annotation career.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-muted/50 p-2 px-4 rounded-2xl border border-border/50">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-2">
            Active · {taskQueue_count} tasks available
          </span>
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30 hover:bg-blue-500/20 font-bold text-[10px] uppercase tracking-widest">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified Annotator
          </Badge>
        </div>
      </section>

      {/* Performance Overview Cards */}
      <section>
        <h2 className="text-base font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          Performance Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Card
                className={`bg-gradient-to-br ${stat.color} border ${stat.border} shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <div className="text-3xl font-black tracking-tighter">
                    {stat.value}
                    <span className="text-lg font-bold text-muted-foreground">
                      {stat.suffix}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-4">
        <h2 className="text-base font-black uppercase tracking-widest text-muted-foreground">
          Recent Activity
        </h2>
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-0">
              <ul className="divide-y divide-border/50">
                {recentActivity.map((act) => (
                  <li
                    key={act.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">
                          {act.action}{" "}
                          <span className="text-primary">{act.taskId}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Domain: {act.domain}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={`text-xs font-bold ${resultBadge[act.result] ?? ""}`}
                      >
                        {act.result}
                      </Badge>
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {timeAgo(act.timestamp)}
                      </span>
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

// local constant used in the header pill
const taskQueue_count = 5;
