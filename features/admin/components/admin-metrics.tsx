"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboard } from "@/lib/hooks";
import { TrendingUp } from "lucide-react";

export function AdminMetrics() {
  const { data, isLoading, isError } = useAdminDashboard();
  const cards = data?.cards ?? [];

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
      <div className="text-sm text-muted-foreground">Unable to load metrics.</div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map((c) => (
        <Card key={c.key} className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              {c.label}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tighter">{c.display_value ?? String(c.value)}</div>
            {c.delta && (
              <p className="mt-1 text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                <span className={c.delta.value >= 0 ? "text-emerald-500" : "text-rose-500"}>
                  {c.delta.label ?? (c.delta.value >= 0 ? `+${c.delta.value}` : String(c.delta.value))}
                </span>
                {!c.delta.label && <span>from last month</span>}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
