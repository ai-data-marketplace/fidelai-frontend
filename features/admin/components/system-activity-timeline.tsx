"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, UserPlus, Wallet, Ban } from "lucide-react";
import { useAdminDashboard } from "@/lib/hooks";

const actionIcons: Record<string, React.ReactNode> = {
  "user_suspended": <Ban className="h-4 w-4 text-rose-500" />,
  "dataset_approved": <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  "payout_processed": <Wallet className="h-4 w-4 text-blue-500" />,
  "role_granted": <UserPlus className="h-4 w-4 text-purple-500" />,
};

export function SystemActivityTimeline() {
  const { data, isLoading, isError } = useAdminDashboard();
  const recent = data?.recent_activity ?? [];

  return (
    <Card className="shadow-sm border-border/50 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && (
          <div className="text-sm text-muted-foreground">Loading activity…</div>
        )}

        {!isLoading && recent.map((log, idx) => (
          <div key={log.id} className="relative flex gap-4 pb-4 last:pb-0">
            {idx < recent.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-px bg-border/50" />
            )}
            <div className={`shrink-0 w-8 h-8 rounded-xl border flex items-center justify-center bg-background shadow-sm z-10`}>
              {actionIcons[log.activity_type] || <Clock className="h-4 w-4" />}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black leading-none">{log.title}</p>
              <p className="text-xs font-medium text-muted-foreground">{log.status}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">{new Date(log.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}

        {!isLoading && !recent.length && (
          <div className="p-8 text-center text-muted-foreground">
            <Clock className="w-8 h-8 opacity-20 mx-auto mb-3" />
            <p className="text-sm font-bold">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
