"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, CalendarDays, Coins } from "lucide-react";
import {
  accuracyOverTime,
  tasksPerWeek,
  pointsEarned,
  annotatorStats,
} from "@/features/annotator/data/mock";

function MiniBarChart({
  data,
  color,
  maxOverride,
}: {
  data: { week: string; value: number }[];
  color: string;
  maxOverride?: number;
}) {
  const max = maxOverride ?? Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end gap-1 h-16 mt-3">
      {data.map((d) => {
        const pct = (d.value / max) * 100;
        return (
          <div
            key={d.week}
            className="flex-1 flex flex-col items-center gap-1 group relative"
          >
            <div
              className={`w-full rounded-t-md transition-all duration-300 group-hover:opacity-80 ${color}`}
              style={{ height: `${pct}%` }}
            />

            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-popover border border-border text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
              {d.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function WeekLabels({ data }: { data: { week: string }[] }) {
  return (
    <div className="flex gap-1 mt-1">
      {data.map((d) => (
        <div
          key={d.week}
          className="flex-1 text-center text-[9px] text-muted-foreground truncate"
        >
          {d.week}
        </div>
      ))}
    </div>
  );
}

export function PerformanceAnalytics() {
  const accuracyData = accuracyOverTime.map((d) => ({
    week: d.week,
    value: d.accuracy,
  }));
  const tasksData = tasksPerWeek.map((d) => ({ week: d.week, value: d.tasks }));
  const pointsData = pointsEarned.map((d) => ({
    week: d.week,
    value: d.points,
  }));

  const totalPoints = pointsEarned.reduce((s, d) => s + d.points, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
              Accuracy over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tighter">
              {annotatorStats.accuracyPercent}
              <span className="text-base font-bold text-muted-foreground">
                %
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Current avg. accuracy
            </p>
            <MiniBarChart
              data={accuracyData}
              color="bg-blue-500"
              maxOverride={100}
            />
            <WeekLabels data={accuracyData} />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <CalendarDays className="w-3.5 h-3.5 text-emerald-500" />
              Tasks per Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tighter">
              {annotatorStats.tasksCompleted}
            </div>
            <p className="text-xs text-muted-foreground">
              Total tasks completed
            </p>
            <MiniBarChart data={tasksData} color="bg-emerald-500" />
            <WeekLabels data={tasksData} />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              Points Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tighter">
              {totalPoints.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total points this period
            </p>
            <MiniBarChart data={pointsData} color="bg-amber-500" />
            <WeekLabels data={pointsData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
