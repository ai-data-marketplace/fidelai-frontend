"use client";

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button 
} from "@/components/ui";
import { 
  Plus, 
  FileText, 
  Trophy, 
  Wallet,
  TrendingUp,
  CheckCircle2,
  BarChart3,
  MessageSquareText,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useContributorDashboard } from "@/lib/hooks";

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

function DashboardEmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 text-center">
      <MessageSquareText className="mb-3 h-9 w-9 text-muted-foreground/40" />
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">{message}</p>
    </div>
  );
}

export default function ContributorOverview() {
  const { data, isLoading, isError } = useContributorDashboard();

  const cards = data?.cards ?? [];
  const submissionsTrend = data?.graphs.submissions_over_time ?? [];

  const quickActions = [
    { title: "Upload Dataset", desc: "Share new Amharic data", icon: Plus, href: "/contributor/upload", color: "bg-blue-500" },
    { title: "My Submissions", desc: "Track your data status", icon: FileText, href: "/contributor/submissions", color: "bg-emerald-500" },
    { title: "View Earnings", desc: "Check your level progress", icon: Wallet, href: "/contributor/wallet", color: "bg-primary" },
  ];

  const chartData = submissionsTrend.map((point) => ({
    period: point.period,
    total_submissions: point.total_submissions,
    pending_review: point.pending_review,
    approved: point.approved,
    rejected: point.rejected,
  }));

  const isChartEmpty = chartData.length === 0;

  return (
    <div className="space-y-8">
      <section className="bg-primary/5 border border-primary/10 rounded-3xl p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-black tracking-tight mb-2">Welcome back, Amanuel!</h1>
          <p className="text-muted-foreground leading-relaxed">
            Your contributions help build the largest Amharic AI data ecosystem.
          </p>
          <div className="flex gap-4 mt-6">
            <Link href="/contributor/upload">
              <button className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20">
                <Plus className="w-5 h-5" />
                Upload New Dataset
              </button>
            </Link>
          </div>
        </div>
        <div className="absolute top-1/2 -right-8 -translate-y-1/2 opacity-10">
           <Trophy className="w-64 h-64" />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-8 text-muted-foreground">Loading contributor analytics...</div>
        ) : isError || cards.length === 0 ? (
          <div className="col-span-full">
            <DashboardEmptyState title="No contributor analytics yet" message="Your dashboard cards will appear here once the analytics feed is available." />
          </div>
        ) : (
          cards.slice(0, 4).map((card, idx) => {
            const iconMap = [CheckCircle2, TrendingUp, FileText, Trophy];
            const colors = [
              { bg: "bg-emerald-50", color: "text-emerald-600" },
              { bg: "bg-blue-50", color: "text-blue-600" },
              { bg: "bg-amber-50", color: "text-amber-600" },
              { bg: "bg-primary/5", color: "text-primary" },
            ];
            const Icon = iconMap[idx % iconMap.length];
            const tone = colors[idx % colors.length];

            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card className="hover:shadow-md transition-all border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl ${tone.bg}`}>
                        <Icon className={`w-5 h-5 ${tone.color}`} />
                      </div>
                    </div>
                    <div className="mt-4 space-y-1">
                      <p className="text-3xl font-black">{card.display_value ?? String(card.value)}</p>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Links & Insights */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <div className="p-4 rounded-2xl border bg-card hover:border-primary transition-all group h-full">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          <Card className="border-dashed">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold">Submissions Over Time</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4">
              {isChartEmpty ? (
                <DashboardEmptyState title="No submission trend data" message="The analytics feed has no submissions-over-time series yet." />
              ) : (
                <div className="h-[260px] rounded-xl border border-dashed bg-muted/10 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.35} />
                      <XAxis dataKey="period" tick={{ fontSize: 12 }} tickFormatter={formatPeriodLabel} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="total_submissions" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="pending_review" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
