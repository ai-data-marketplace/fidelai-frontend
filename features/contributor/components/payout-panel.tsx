"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Button, 
  Badge 
} from "@/components/ui";
import { 
  Wallet, 
  ArrowUpRight, 
  History, 
  DollarSign,
  Loader2
} from "lucide-react";
import { WithdrawModal } from "./withdraw-modal";
import { useWalletDetails } from "@/lib/hooks";
import { formatCurrency } from "@/lib/utils/number-formatter";

export function PayoutPanel() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const { data: walletDetails, isLoading } = useWalletDetails();

  const transactions = [
    { id: "TX123", amount: 450.00, date: "2024-03-15", status: "Completed", type: "Withdrawal" },
    { id: "TX124", amount: 120.50, date: "2024-03-10", status: "Completed", type: "Earnings" },
    { id: "TX125", amount: 800.00, date: "2024-03-01", status: "Processing", type: "Withdrawal" },
  ];

  const availableBalance = walletDetails?.wallet_available_balance ?? 4250.00;
  const pendingBalance = walletDetails?.wallet_pending_balance ?? 1120.00;
  const currency = walletDetails?.currency ?? "ETB";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">Earnings & Payouts</CardTitle>
        <Wallet className="w-5 h-5 text-primary" />
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Available</p>
              <p className="text-2xl font-black text-emerald-600">{formatCurrency(availableBalance, currency)}</p>
              <p className="text-[10px] text-muted-foreground border-t pt-2">Pending: {formatCurrency(pendingBalance, currency)}</p>
            </div>

            <Button 
              className="w-full flex items-center justify-center gap-2 h-11"
              onClick={() => setIsWithdrawModalOpen(true)}
              disabled={!walletDetails?.meets_minimum}
            >
              <DollarSign className="w-4 h-4" />
              Withdraw Earnings
            </Button>

            {!walletDetails?.meets_minimum && (
              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <p className="text-[10px] text-amber-700 font-medium">
                  You need to reach the minimum withdrawal amount to proceed. Keep earning to unlock withdrawals.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <History className="w-3 h-3" />
                  Recent Transactions
                </h4>
                <button className="text-[10px] font-bold text-primary hover:underline">View All</button>
              </div>

              <div className="space-y-2">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === 'Withdrawal' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {tx.type === 'Withdrawal' ? <ArrowUpRight className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{tx.type} — {tx.id}</p>
                        <p className="text-[10px] text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black">{tx.type === 'Withdrawal' ? '-' : '+'} {formatCurrency(tx.amount, currency)}</p>
                      <p className={`text-[10px] font-medium ${
                        tx.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>{tx.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Share Notice removed per role consolidation request */}
          </>
        )}
      </CardContent>

      <WithdrawModal 
        isOpen={isWithdrawModalOpen} 
        onClose={() => setIsWithdrawModalOpen(false)}
        walletDetails={walletDetails}
      />
    </Card>
  );
}
