"use client";

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui";
import { 
  Trophy,
  Loader2
} from "lucide-react";
import { useWalletDetails } from "@/lib/hooks";
import { formatLargeNumber, formatCurrency } from "@/lib/utils/number-formatter";

export function ScoreCard() {
  const { data: walletDetails, isLoading } = useWalletDetails();
  
  const totalPoints = walletDetails?.total_points ?? 0;
  const availablePoints = walletDetails?.available_points ?? 0;
  const lockedPoints = walletDetails?.locked_points ?? 0;
  const totalEarned = walletDetails?.wallet_total_earned ?? 0;
  const totalWithdrawn = walletDetails?.wallet_total_withdrawn ?? 0;
  const currency = walletDetails?.currency ?? "ETB";

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">Your Score</CardTitle>
        <Trophy className="w-5 h-5 text-primary" />
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border bg-background/70 p-4 space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Total Points</p>
                <p className="text-3xl font-black">{formatLargeNumber(totalPoints)}</p>
                <p className="text-[11px] text-muted-foreground">Points currently accumulated</p>
              </div>
              <div className="rounded-xl border bg-background/70 p-4 space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Withdrawn</p>
                <p className="text-3xl font-black text-emerald-600">{formatCurrency(totalWithdrawn, currency)}</p>
                <p className="text-[11px] text-muted-foreground">Total withdrawn so far</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 border-t">
              <div className="rounded-lg bg-card border p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Available</p>
                <p className="text-sm font-black mt-1">{formatLargeNumber(availablePoints)}</p>
              </div>
              <div className="rounded-lg bg-card border p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Used Points</p>
                <p className="text-sm font-black mt-1">{formatLargeNumber(lockedPoints)}</p>
              </div>
              <div className="rounded-lg bg-card border p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Total Earned</p>
                <p className="text-sm font-black mt-1 text-emerald-600">{formatCurrency(totalEarned, currency)}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
