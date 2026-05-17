"use client";

import { useState } from "react";
import { 
  Modal, 
  Button, 
  Checkbox 
} from "@/components/ui";
import { 
  ShoppingCart, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard,
  Building2,
} from "lucide-react";
import { MarketplaceDataset } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface PurchaseModalProps {
  dataset: MarketplaceDataset;
  isOpen: boolean;
  onClose: () => void;
}

export function PurchaseModal({ dataset, isOpen, onClose }: PurchaseModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const price = Number(dataset.price) || 0;

  const handlePurchase = () => {
    if (!agreedToTerms) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2500);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isSuccess ? "Purchase Complete" : "Confirm Purchase"}>
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 pt-4"
          >
            {/* Dataset Preview Card */}
            <div className="p-4 rounded-2xl bg-muted/30 border flex gap-4 items-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm truncate">{dataset.title}</h4>
                <p className="text-xs text-muted-foreground">{dataset.domain} • {dataset.license_type.toUpperCase()} License</p>
              </div>
              <div className="text-right">
                <p className="font-black text-primary">ETB {price.toFixed(2)}</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Select Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 border-2 border-primary rounded-2xl bg-primary/5 flex flex-col items-center gap-2 cursor-pointer transition-all">
                  <Building2 className="w-6 h-6 text-primary" />
                  <span className="text-xs font-bold">Bank Transfer</span>
                </div>
                <div className="p-4 border-2 border-muted rounded-2xl bg-muted/5 flex flex-col items-center gap-2 cursor-not-allowed opacity-50 grayscale">
                  <CreditCard className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs font-bold text-muted-foreground">TeleBirr / Amole</span>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3">
               <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
               <div className="text-xs">
                 <p className="font-bold">Encrypted Transaction</p>
                 <p className="text-muted-foreground leading-relaxed mt-1">
                   Your purchase is secured by FidelAI Escrow. Funds are released based on the dataset license terms.
                 </p>
               </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 p-2">
               <Checkbox 
                id="terms" 
                checked={agreedToTerms} 
                onChange={(e) => setAgreedToTerms(e.target.checked)} 
               />
               <label htmlFor="terms" className="text-[11px] leading-relaxed text-muted-foreground cursor-pointer select-none">
                 I agree to the <strong>License Agreement</strong> and <strong>Data Usage Policy</strong>. I understand that redistribution of this dataset is strictly prohibited.
               </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={handleClose}>Cancel</Button>
              <Button 
                className="min-w-[140px] shadow-lg shadow-primary/20" 
                disabled={isProcessing || !agreedToTerms}
                onClick={handlePurchase}
              >
                {isProcessing ? "Processing..." : `Pay ETB ${price.toFixed(2)}`}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black">Dataset Unlocked!</h3>
              <p className="text-muted-foreground px-4">
                Thank you for your purchase. The dataset is now available in your personal library for download.
              </p>
            </div>
            <div className="flex flex-col gap-2 max-w-[280px] mx-auto pt-4">
               <Link href="/buyer/library" className="w-full">
                  <Button className="w-full h-11 shadow-lg shadow-primary/20">Go to My Library</Button>
               </Link>
               <Button variant="outline" className="w-full h-11" onClick={handleClose}>Back to Details</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
