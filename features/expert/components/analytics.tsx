"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, TrendingUp, BarChart as BarChartIcon, Target, Bot, Users, MessageSquareText } from "lucide-react";
import { motion } from "framer-motion";
import { useExpertOverview } from "@/lib/hooks";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

function formatPeriodLabel(period: string) {
  const normalized = period.trim();
  if (/^w\d+$/i.test(normalized)) return normalized.replace(/^w/i, "Week ");
  if (/^w\d+\b/i.test(normalized)) return normalized.replace(/^w(\d+)/i, "Week $1");
  return normalized;
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 text-center">
      <BarChartIcon className="mb-3 h-9 w-9 text-muted-foreground/40" />
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">{message}</p>
    </div>
  );
}

export function ExpertAnalyticsDashboard() {
  const { data, isLoading, isError } = useExpertOverview();
  const cards = data?.cards ?? [];
  const reviewTrend = data?.graphs.review_trend ?? [];

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
        <h3 className="text-xl font-black">No expert analytics available yet</h3>
        <p className="text-muted-foreground text-sm mt-2 max-w-sm">
          The expert overview will appear here once the analytics feed is available.
        </p>
      </div>
    );
  }

  const chartData = reviewTrend.map((item) => ({
    period: item.period,
    total_reviews: item.total_reviews,
  }));

  return (
    <div className="space-y-8">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {cards.slice(0, 4).map((card, idx) => {
          const iconMap = [ShieldCheck, Bot, Users, Target];
          const colors = [
            { bg: "bg-blue-50", color: "text-blue-600" },
            { bg: "bg-purple-50", color: "text-purple-600" },
            { bg: "bg-emerald-50", color: "text-emerald-600" },
            { bg: "bg-amber-50", color: "text-amber-600" },
          ];
          const Icon = iconMap[idx % iconMap.length];
          const tone = colors[idx % colors.length];

          return (
            <Card key={card.key} className="bg-card/60 backdrop-blur-sm border-border/50 shadow-sm transition-hover hover:border-primary/20">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{card.label}</p>
                  <div className={`p-2 rounded-lg ${tone.bg}`}><Icon className={`w-4 h-4 ${tone.color}`} /></div>
                </div>
                <p className="text-3xl font-black tracking-tighter">{card.display_value ?? String(card.value)}</p>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      <Card className="border-border/50 bg-card/60 h-full">
        <CardHeader className="pb-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
          Review Trend
        </CardHeader>
        <CardContent className="p-5">
          {chartData.length ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.35} />
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} tickFormatter={formatPeriodLabel} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total_reviews" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState title="No review trend data" message="The expert overview did not return review trend points yet." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
