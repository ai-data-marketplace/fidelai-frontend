"use client";

import { useState } from "react";
import { Modal, Button, Input, Select, Checkbox, Badge } from "@/components/ui";
import {
  Upload,
  AlertCircle,
  FileText,
  ShieldCheck,
  X,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const domains = [
  "General",
  "Health",
  "Education",
  "Law",
  "Finance",
  "News",
  "Religion",
];

export function UploadDatasetModal({
  isOpen,
  onClose,
}: UploadDatasetModalProps) {
  const [domain, setDomain] = useState("General");
  const [hasConsent, setHasConsent] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const isSensitiveDomain = ["Health", "Law", "Finance"].includes(domain);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasConsent) return;

    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload New Dataset">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Warning Message */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-800">Technology Note</p>
            <p className="text-amber-700/80">
              Only text-based datasets are currently supported. Other formats
              will be added in future updates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Dataset Title</label>
            <Input placeholder="e.g. Amharic News Corpus 2024" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Domain</label>
            <Select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Subdomain / Category</label>
          <Input placeholder="e.g. Politics, Medical Records, Court Rulings" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Upload Dataset File</label>
          <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer group relative">
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept=".pdf,.docx,.txt,.jpg,.png"
              required
            />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supported: PDF, TXT, DOCX, JPG, PNG (Max 50MB)
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isSensitiveDomain && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-xl border bg-muted/30 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold">
                    Sensitive Domain Verification
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Upload proof of ownership or authorization for this {domain}
                    -related data.
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Upload Authorization PDF
                    </Button>
                    <span className="text-[10px] text-muted-foreground italic max-w-[150px]">
                      Max 5MB (PDF or Image)
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 rounded-xl border bg-primary/5 border-primary/10">
          <Checkbox
            id="consent"
            checked={hasConsent}
            onChange={(e) => setHasConsent(e.target.checked)}
            label="I confirm that I have the legal right to share this data and allow it to be used for AI training and marketplace datasets."
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!hasConsent || isUploading}
            className="min-w-[140px]"
          >
            {isUploading ? "Uploading..." : "Submit Dataset"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
