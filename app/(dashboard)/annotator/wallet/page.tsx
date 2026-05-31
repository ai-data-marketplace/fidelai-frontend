"use client";

import { ScoreCard } from "@/features/contributor/components/score-card";
import { PayoutPanel } from "@/features/contributor/components/payout-panel";
import { Wallet } from "lucide-react";

export default function AnnotatorWalletPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Wallet className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            Wallet & Rewards
          </h1>
        </div>
        <p className="text-muted-foreground ml-11">
          Monitor your earnings, points progress, and manage your withdrawal
          options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6">
          <PayoutPanel />
        </div>

        <div className="lg:col-span-6">
          <ScoreCard />
        </div>
      </div>
    </div>
  );
}
