"use client";

import { Badge, Button, Card, CardContent } from "@/components/ui";
import {
  Library,
  Download,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePurchases } from "@/lib/hooks";
import apiClient from "@/services/api-client";
import { API_ENDPOINTS } from "@/services/endpoints";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default function BuyerLibraryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadingAssetId, setDownloadingAssetId] = useState<string | null>(
    null,
  );
  const { data: purchasesData, isLoading } = usePurchases(currentPage);

  const purchases = purchasesData?.results || [];
  const totalPages = purchasesData ? Math.ceil(purchasesData.count / 10) : 1;
  const canGoNext = !!purchasesData?.next;
  const canGoPrevious = !!purchasesData?.previous;

  const handleDownload = async (
    purchaseId: string,
    assetId: string,
    fileName: string,
  ) => {
    try {
      setDownloadingAssetId(assetId);
      const response = await apiClient.get(
        API_ENDPOINTS.PURCHASES.DOWNLOAD(purchaseId, assetId),
        { responseType: "blob" },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || `asset-${assetId}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloadingAssetId(null);
    }
  };

  const handleNextPage = () => {
    if (canGoNext) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (canGoPrevious) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-[0.2em]">
            <Library className="w-4 h-4" />
            My Assets
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            Dataset Library
          </h1>
          <p className="text-muted-foreground font-medium">
            Access and manage your purchased datasets.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {isLoading ? (
          <div className="h-[400px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-8 space-y-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading your library...</p>
          </div>
        ) : purchases.length === 0 ? (
          <div className="h-[400px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Library className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black">Your Library is Empty</h3>
              <p className="text-muted-foreground max-w-xs">
                Start browsing the marketplace to build your research
                collection.
              </p>
            </div>
            <Link href="/buyer/marketplace">
              <Button className="font-bold">Browse Marketplace</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {purchases.map((purchase) => (
              <Card
                key={purchase.id}
                className="border-border/50 shadow-sm hover:shadow-md transition-all group overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row lg:items-center">
                    <div className="flex-1 p-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {purchase.status}
                            </span>
                          </div>
                          <h3 className="text-xl font-black group-hover:text-primary transition-colors">
                            {purchase.dataset_title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="font-bold">Purchased:</span>
                          {new Date(purchase.purchased_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground border-l pl-6">
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          <span className="font-bold">License:</span>
                          <Badge
                            variant="ghost"
                            className="rounded-md font-mono font-bold text-[11px] h-6 border"
                          >
                            {purchase.license}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-[450px] bg-muted/30 p-6 border-t lg:border-t-0 lg:border-l space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Download Assets
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {purchase.assets.map((asset) => (
                          <button
                            key={asset.id}
                            onClick={() =>
                              handleDownload(
                                purchase.id,
                                asset.id,
                                `${purchase.dataset_title}.${asset.file_format}`,
                              )
                            }
                            disabled={downloadingAssetId === asset.id}
                            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card border border-border/50 hover:border-primary hover:shadow-lg transition-all group/btn relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Download
                              className={`w-4 h-4 text-primary transition-transform ${downloadingAssetId === asset.id ? "animate-bounce" : "group-hover/btn:translate-y-0.5"}`}
                            />
                            <span className="text-xs font-black">
                              {asset.file_format.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {formatFileSize(asset.file_size_bytes)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {purchases.length > 0 && (
          <div className="flex items-center justify-center gap-4 pt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!canGoPrevious}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2 px-4 py-2">
              <span className="text-sm font-bold">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!canGoNext}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
