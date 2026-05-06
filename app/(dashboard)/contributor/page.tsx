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
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ContributorOverview() {
  const stats = [
    { label: "Total Submissions", value: "24", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Review", value: "05", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Approved", value: "18", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Score", value: "1,250", icon: Trophy, color: "text-primary", bg: "bg-primary/5" },
  ];

  const quickActions = [
    { title: "Upload Dataset", desc: "Share new Amharic data", icon: Plus, href: "/contributor/upload", color: "bg-blue-500" },
    { title: "My Submissions", desc: "Track your data status", icon: FileText, href: "/contributor/submissions", color: "bg-emerald-500" },
    { title: "View Earnings", desc: "Check your level progress", icon: Wallet, href: "/contributor/wallet", color: "bg-primary" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <section className="bg-primary/5 border border-primary/10 rounded-3xl p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-black tracking-tight mb-2">Welcome back, Amanuel!</h1>
          <p className="text-muted-foreground leading-relaxed">
            Your contributions help build the largest Amharic AI data ecosystem. 
            You currently have <span className="text-primary font-bold">5 datasets</span> being validated.
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

      {/* Stats Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="hover:shadow-md transition-all border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-3xl font-black">{stat.value}</p>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
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
              <CardTitle className="text-lg font-bold">Contributor Analytics</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center bg-muted/20 rounded-xl m-4 border border-dashed">
              <div className="text-center space-y-2">
                <TrendingUp className="w-8 h-8 text-muted-foreground/30 mx-auto" />
                <p className="text-xs text-muted-foreground font-medium italic">Analytics visualization will load once you have more submissions.</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
