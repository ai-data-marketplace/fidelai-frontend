"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Target,
  PieChart,
  BarChart as BarChartIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Pie,
  PieChart as RePieChart,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { useAnnotatorOverview } from "@/lib/hooks";

type TrendPoint = { period: string; value: number };

function formatPeriodLabel(period: string) {
  const normalized = period.trim();

  if (/^w\d+$/i.test(normalized)) {
    return normalized.replace(/^w/i, "Week ");
  }

  if (/^w\d+\b/i.test(normalized)) {
    return normalized.replace(/^w(\d+)/i, "Week $1");
  }

  return normalized;
}

function ChartEmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="flex h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 text-center">
      <BarChartIcon className="mb-3 h-9 w-9 text-muted-foreground/40" />
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">{message}</p>
    </div>
  );
}

function RechartsBar({
  data,
  dataKey = "value",
  color = "#10b981",
  xLabel = "Category",
  yLabel = "Value",
}: {
  data: { week: string; value: number }[];
  dataKey?: string;
  color?: string;
  xLabel?: string;
  yLabel?: string;
}) {
  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            opacity={0.35}
          />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 12 }}
            tickFormatter={formatPeriodLabel}
            label={{ value: xLabel, position: "insideBottom", offset: -2 }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              offset: 8,
            }}
          />
          <Tooltip />
          <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function RechartsLine({
  data,
  dataKey = "value",
  color = "#3b82f6",
  xLabel = "Period",
  yLabel = "Value",
}: {
  data: TrendPoint[];
  dataKey?: string;
  color?: string;
  xLabel?: string;
  yLabel?: string;
}) {
  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            opacity={0.35}
          />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 12 }}
            tickFormatter={formatPeriodLabel}
            label={{ value: xLabel, position: "insideBottom", offset: -2 }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              offset: 8,
            }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function RechartsPie({
  data,
  colors = ["#f97316", "#0ea5e9", "#22c55e", "#8b5cf6"],
}: {
  data: { name: string; value: number }[];
  colors?: string[];
}) {
  return (
    <div className="w-full h-56 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            innerRadius={42}
            label
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AnalyticsDashboard() {
  const { data, isLoading, isError } = useAnnotatorOverview();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
          ></path>
        </svg>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center border rounded-2xl bg-card/30 border-dashed">
        <BarChartIcon className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-black">No analytics available yet</h3>
        <p className="text-muted-foreground text-sm mt-2 max-w-sm">
          No analytics data is available for this view right now.
        </p>
      </div>
    );
  }

  const overview = data;

  const topCards = overview.cards.slice(0, 4);

  const weeklyPerformanceData: TrendPoint[] =
    overview.graphs.weekly_performance.map((w) => ({
      period: w.period,
      value: w.tasks_completed,
    }));
  const avgTimeData: TrendPoint[] = overview.graphs.avg_time_trend.map((w) => ({
    period: w.period,
    value: Number((w.avg_time_minutes || 0).toFixed(1)),
  }));

  const confidenceDist = overview.graphs.confidence_distribution;
  const readabilityDist = overview.graphs.readability_distribution;

  return (
    <div className="space-y-8">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {topCards.map((c) => (
          <Card
            key={c.key}
            className="bg-card/60 backdrop-blur-sm border-border/50 shadow-sm transition-hover hover:border-primary/20"
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  {c.label}
                </p>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-black tracking-tighter">
                {c.display_value ?? String(c.value)}
              </p>
              {c.delta && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />{" "}
                  {c.delta.label ?? `${c.delta.value}`}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest">
              Avg. Time Trend (mins)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {avgTimeData.length ? (
              <RechartsLine
                data={avgTimeData}
                dataKey="value"
                xLabel="Period"
                yLabel="Average time (mins)"
              />
            ) : (
              <ChartEmptyState
                title="No average time trend data"
                message="This chart is currently empty."
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest">
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weeklyPerformanceData.length ? (
              <RechartsLine
                data={weeklyPerformanceData}
                dataKey="value"
                color="#2563eb"
                xLabel="Period"
                yLabel="Tasks completed"
              />
            ) : (
              <ChartEmptyState
                title="No weekly performance data"
                message="This chart is currently empty."
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest">
              Confidence Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {confidenceDist.length ? (
              <RechartsPie
                data={confidenceDist.map((d: any) => ({
                  name: d.label,
                  value: d.value,
                }))}
              />
            ) : (
              <ChartEmptyState
                title="No confidence distribution data"
                message="This chart is currently empty."
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest">
              Readability Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {readabilityDist.length ? (
              <RechartsBar
                data={readabilityDist.map((d: any) => ({
                  week: d.label,
                  value: d.value,
                }))}
                dataKey="value"
                color="#10b981"
              />
            ) : (
              <ChartEmptyState
                title="No readability distribution data"
                message="This chart is currently empty."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
