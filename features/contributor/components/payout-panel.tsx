"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Modal,
} from "@/components/ui";
import {
  Wallet,
  ArrowUpRight,
  History,
  DollarSign,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { WithdrawModal } from "./withdraw-modal";
import { useWalletDetails, useWithdrawalsList } from "@/lib/hooks";
import { formatCurrency } from "@/lib/utils/number-formatter";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

function trimWithdrawalId(id: string) {
  return id.length > 8 ? `${id.slice(0, 8)}...` : id;
}

function getStatusTone(status: string) {
  return status.toLowerCase() === "completed"
    ? "text-emerald-600"
    : "text-amber-600";
}

function getStatusBadgeVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  const normalized = status.toLowerCase();
  if (normalized === "completed" || normalized === "success") return "default";
  if (normalized === "failed" || normalized === "rejected")
    return "destructive";
  return "secondary";
}

export function PayoutPanel() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [transactionsPage, setTransactionsPage] = useState(1);

  const { data: walletDetails, isLoading } = useWalletDetails();
  const { data: recentTransactions, isLoading: isRecentLoading } =
    useWithdrawalsList(1, 4);
  const {
    data: paginatedTransactions,
    isLoading: isPaginatedLoading,
    isFetching: isPaginatedFetching,
  } = useWithdrawalsList(transactionsPage, 10);

  const availableBalance = walletDetails?.wallet_available_balance;
  const pendingBalance = walletDetails?.wallet_pending_balance;
  const currency = walletDetails?.currency ?? "ETB";
  const recentItems = recentTransactions?.results ?? [];
  const paginatedItems = paginatedTransactions?.results ?? [];
  const totalCount = paginatedTransactions?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / 10));
  const canGoPrevious = transactionsPage > 1;
  const canGoNext = transactionsPage < totalPages;

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
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                Available
              </p>
              <p className="text-2xl font-black text-emerald-600">
                {walletDetails
                  ? formatCurrency(availableBalance as number, currency)
                  : "—"}
              </p>
              <p className="text-[10px] text-muted-foreground border-t pt-2">
                Pending:{" "}
                {walletDetails
                  ? formatCurrency(pendingBalance as number, currency)
                  : "—"}
              </p>
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
                  You need to reach the minimum withdrawal amount to proceed.
                  Keep earning to unlock withdrawals.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <History className="w-3 h-3" />
                  Recent Transactions
                </h4>
                <button
                  className="text-[10px] font-bold text-primary hover:underline"
                  onClick={() => {
                    setTransactionsPage(1);
                    setIsViewAllOpen(true);
                  }}
                  type="button"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2">
                {isRecentLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                ) : recentItems.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground rounded-lg border border-dashed p-3">
                    No withdrawal requests yet.
                  </p>
                ) : (
                  recentItems.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-muted/30 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-100 text-amber-700">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold">
                            Withdrawal — {trimWithdrawalId(tx.id)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {formatDate(tx.requested_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black">
                          - {formatCurrency(Number(tx.amount), currency)}
                        </p>
                        <p
                          className={`text-[10px] font-medium ${getStatusTone(tx.status)}`}
                        >
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        walletDetails={walletDetails}
      />

      <Modal
        isOpen={isViewAllOpen}
        onClose={() => setIsViewAllOpen(false)}
        title="All Withdrawal Requests"
        className="max-w-2xl"
      >
        <div className="space-y-4">
          {isPaginatedLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : paginatedItems.length === 0 ? (
            <p className="text-sm text-muted-foreground rounded-lg border border-dashed p-4">
              No withdrawal requests found.
            </p>
          ) : (
            <div className="space-y-2">
              {paginatedItems.map((tx) => (
                <div
                  key={tx.id}
                  className="rounded-lg border p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      Withdrawal — {trimWithdrawalId(tx.id)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requested: {formatDate(tx.requested_at)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black">
                      - {formatCurrency(Number(tx.amount), currency)}
                    </p>
                    <Badge
                      variant={getStatusBadgeVariant(tx.status)}
                      className="mt-1 capitalize"
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-3">
            <p className="text-xs text-muted-foreground">
              Page {transactionsPage} of {totalPages}{" "}
              {isPaginatedFetching ? "(Updating...)" : ""}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canGoPrevious || isPaginatedFetching}
                onClick={() =>
                  setTransactionsPage((prev) => Math.max(1, prev - 1))
                }
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canGoNext || isPaginatedFetching}
                onClick={() => setTransactionsPage((prev) => prev + 1)}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
