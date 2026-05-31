"use client";

import { useState } from "react";
import { Modal, Button, Input, Select } from "@/components/ui";
import { CreditCard, User, Banknote, AlertCircle, X } from "lucide-react";
import {
  WalletDetails,
  usePaymentBanks,
  useWithdrawal,
  getUserFriendlyErrorMessage,
} from "@/lib/hooks";
import { formatCurrency } from "@/lib/utils/number-formatter";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletDetails?: WalletDetails;
}

export function WithdrawModal({
  isOpen,
  onClose,
  walletDetails,
}: WithdrawModalProps) {
  const [formData, setFormData] = useState({
    bank_code: "",
    account_number: "",
    account_name: "",
    amount: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const { data: banksResponse, isLoading: banksLoading } = usePaymentBanks();
  const withdrawal = useWithdrawal();

  const withdrawableAmount = walletDetails?.withdrawable_amount;
  const minimumAmount = walletDetails?.minimum_amount;
  const currency = walletDetails?.currency ?? "ETB";
  const meetsMinimum = walletDetails?.meets_minimum ?? false;
  const banks = banksResponse?.banks ?? [];
  const selectedBank = banks.find(
    (bank) => String(bank.bank_code) === formData.bank_code,
  );
  const amountValue = Number(formData.amount);
  const isAmountEntered = formData.amount.trim().length > 0;
  const isAmountNumber = Number.isFinite(amountValue) && amountValue > 0;
  const isAmountBelowMinimum =
    isAmountEntered &&
    isAmountNumber &&
    minimumAmount != null &&
    amountValue < minimumAmount;
  const isAmountAboveWithdrawable =
    isAmountEntered &&
    isAmountNumber &&
    withdrawableAmount != null &&
    amountValue > withdrawableAmount;
  const hasAmountValidationError =
    isAmountEntered &&
    (!isAmountNumber || isAmountBelowMinimum || isAmountAboveWithdrawable);
  const hasAccountLengthError =
    !!selectedBank?.acct_length &&
    formData.account_number.trim().length > 0 &&
    formData.account_number.trim().length !== selectedBank.acct_length;
  const canSubmit =
    meetsMinimum &&
    !withdrawal.isPending &&
    !hasAmountValidationError &&
    !hasAccountLengthError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.bank_code) {
      setErrorMessage("Please select a bank/payment provider");
      return;
    }
    if (!formData.account_number.trim()) {
      setErrorMessage("Please enter your account number");
      return;
    }
    if (!formData.account_name.trim()) {
      setErrorMessage("Please enter the account holder name");
      return;
    }
    if (!formData.amount) {
      setErrorMessage("Please enter the withdrawal amount");
      return;
    }
    if (!isAmountNumber) {
      setErrorMessage(`Please enter a valid amount in ${currency}`);
      return;
    }
    if (minimumAmount != null && amountValue < minimumAmount) {
      setErrorMessage(`Minimum withdrawal amount is ${formatCurrency(minimumAmount, currency)}`);
      return;
    }
    if (withdrawableAmount != null && amountValue > withdrawableAmount) {
      setErrorMessage(`Cannot exceed withdrawable amount of ${formatCurrency(withdrawableAmount, currency)}`);
      return;
    }
    if (hasAccountLengthError) {
      setErrorMessage(
        `Account number must be ${selectedBank?.acct_length} digits for ${selectedBank?.name}`,
      );
      return;
    }

    withdrawal.mutate(formData, {
      onSuccess: () => {
        setFormData({
          bank_code: "",
          account_number: "",
          account_name: "",
          amount: "",
        });
        setTimeout(() => onClose(), 1500);
      },
      onError: (error: any) => {
        const message = getUserFriendlyErrorMessage(
          error,
          "Failed to submit withdrawal request",
        );
        setErrorMessage(message);
      },
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleClose = () => {
    if (!withdrawal.isPending) {
      setFormData({
        bank_code: "",
        account_number: "",
        account_name: "",
        amount: "",
      });
      setErrorMessage("");
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Withdraw Earnings">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage("")}
              className="ml-auto text-red-600 hover:text-red-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3">
          <Banknote className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold">Withdrawable Amount</p>
            <p className="text-2xl font-black text-primary">
              {withdrawableAmount != null
                ? formatCurrency(withdrawableAmount, currency)
                : "—"}
            </p>
            {!meetsMinimum && (
              <p className="text-[10px] text-amber-600 mt-1">
                Minimum{" "}
                {minimumAmount != null
                  ? formatCurrency(minimumAmount, currency)
                  : "—"}{" "}
                required
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Bank / Payment Provider
            </label>
            <Select
              required
              disabled={
                !meetsMinimum ||
                banksLoading ||
                banks.length === 0 ||
                withdrawal.isPending
              }
              value={formData.bank_code}
              onChange={(e) => handleInputChange("bank_code", e.target.value)}
            >
              <option value="">Select a provider</option>
              {banksLoading ? (
                <option value="" disabled>
                  Loading banks...
                </option>
              ) : (
                banks
                  .filter((bank) => bank.is_active)
                  .map((bank) => (
                    <option key={bank.bank_code} value={String(bank.bank_code)}>
                      {bank.name}
                    </option>
                  ))
              )}
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder={
                    selectedBank?.acct_length
                      ? `${selectedBank.acct_length} digits`
                      : "1000..."
                  }
                  required
                  disabled={!meetsMinimum || withdrawal.isPending}
                  value={formData.account_number}
                  onChange={(e) =>
                    handleInputChange("account_number", e.target.value)
                  }
                />
              </div>
              {hasAccountLengthError && (
                <p className="text-[10px] text-red-600">
                  Account number should be {selectedBank?.acct_length} digits
                  for {selectedBank?.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Account Holder Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Full Name"
                  required
                  disabled={!meetsMinimum || withdrawal.isPending}
                  value={formData.account_name}
                  onChange={(e) =>
                    handleInputChange("account_name", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Amount to Withdraw ({currency})
            </label>
            <Input
              type="number"
              placeholder={`Min. ${minimumAmount != null ? minimumAmount.toFixed(2) : "—"} ${currency}`}
              min={minimumAmount ?? undefined}
              max={withdrawableAmount ?? undefined}
              required
              disabled={!meetsMinimum || withdrawal.isPending}
              className="text-lg font-bold"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              step="0.01"
            />
            {hasAmountValidationError && (
              <p className="text-[10px] text-red-600">
                {!isAmountNumber
                  ? `Enter a valid amount in ${currency}`
                  : isAmountBelowMinimum
                    ? `Minimum amount is ${minimumAmount != null ? formatCurrency(minimumAmount, currency) : "—"}`
                    : `Maximum amount is ${withdrawableAmount != null ? formatCurrency(withdrawableAmount, currency) : "—"}`}
              </p>
            )}
          </div>
        </div>

        <div className="p-3 bg-muted rounded-lg flex gap-2 items-start">
          <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground">
            Withdrawals are processed within 24-48 business hours. Ensure your
            account details are correct to avoid delays.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={withdrawal.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!canSubmit} className="min-w-[140px]">
            {withdrawal.isPending ? "Processing..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
