"use client";

import { useState } from "react";
import { 
  Modal, 
  Button, 
  Input, 
  Select 
} from "@/components/ui";
import { 
  CreditCard, 
  User, 
  Banknote,
  AlertCircle,
  Loader2
} from "lucide-react";
import { WalletDetails, usePaymentBanks } from "@/lib/hooks";
import { formatCurrency } from "@/lib/utils/number-formatter";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletDetails?: WalletDetails;
}

export function WithdrawModal({ isOpen, onClose, walletDetails }: WithdrawModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: banksResponse, isLoading: banksLoading } = usePaymentBanks();

  const withdrawableAmount = walletDetails?.withdrawable_amount ?? 4250.00;
  const minimumAmount = walletDetails?.minimum_amount ?? 500;
  const currency = walletDetails?.currency ?? "ETB";
  const meetsMinimum = walletDetails?.meets_minimum ?? false;
  const banks = banksResponse?.banks ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock processing delay
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Withdraw Earnings">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3">
          <Banknote className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold">Withdrawable Amount</p>
            <p className="text-2xl font-black text-primary">{formatCurrency(withdrawableAmount, currency)}</p>
            {!meetsMinimum && (
              <p className="text-[10px] text-amber-600 mt-1">Minimum {formatCurrency(minimumAmount, currency)} required</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Bank / Payment Provider</label>
            <Select required disabled={!meetsMinimum || banksLoading || banks.length === 0}>
              <option value="">Select a provider</option>
              {banksLoading ? (
                <option value="" disabled>Loading banks...</option>
              ) : (
                banks
                  .filter((bank) => bank.is_active)
                  .map((bank) => (
                    <option key={bank.bank_code} value={String(bank.bank_code)}>{bank.name}</option>
                  ))
              )}
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="1000..." required disabled={!meetsMinimum} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Holder Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Full Name" required disabled={!meetsMinimum} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Amount to Withdraw ({currency})</label>
            <Input 
              type="number" 
              placeholder={`Min. ${minimumAmount.toFixed(2)} ${currency}`}
              min={minimumAmount}
              max={withdrawableAmount}
              required 
              disabled={!meetsMinimum}
              className="text-lg font-bold"
            />
          </div>
        </div>

        <div className="p-3 bg-muted rounded-lg flex gap-2 items-start">
          <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground">
            Withdrawals are processed within 24-48 business hours. Ensure your account details are correct to avoid delays.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !meetsMinimum}
            className="min-w-[140px]"
          >
            {isSubmitting ? "Processing..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
