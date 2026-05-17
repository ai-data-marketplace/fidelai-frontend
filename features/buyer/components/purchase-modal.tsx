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
} from "lucide-react";
import { MarketplaceDataset } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { usePurchaseDataset } from "@/lib/hooks";

interface PurchaseModalProps {
  dataset: MarketplaceDataset;
  isOpen: boolean;
  onClose: () => void;
}

export function PurchaseModal({ dataset, isOpen, onClose }: PurchaseModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const price = Number(dataset.price) || 0;
  const purchaseDataset = usePurchaseDataset();

  const handlePurchase = async () => {
    if (!agreedToTerms) return;
    setIsProcessing(true);
    try {
      const response = await purchaseDataset.mutateAsync(String(dataset.id));
      const checkoutUrl = response.checkout_url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      setIsProcessing(false);
    } catch (error) {
      console.error("Failed to start purchase", error);
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Purchase">
      <AnimatePresence mode="wait">
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
              <p className="text-xs text-muted-foreground">{dataset.domain} • Chapa Checkout</p>
            </div>
            <div className="text-right">
              <p className="font-black text-primary">ETB {price.toFixed(2)}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Payment Method</label>
            <div className="p-4 border-2 border-primary rounded-2xl bg-primary/5 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <div>
                <span className="text-sm font-bold">Chapa</span>
                <p className="text-xs text-muted-foreground">Secure online checkout</p>
              </div>
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
               I agree to the <strong>License Agreement</strong> and <strong>Data Usage Policy</strong>.
             </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button 
              className="min-w-[140px] shadow-lg shadow-primary/20" 
              disabled={isProcessing || !agreedToTerms || purchaseDataset.isPending}
              onClick={handlePurchase}
            >
              {isProcessing || purchaseDataset.isPending ? "Processing..." : `Pay with Chapa`}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
}
