"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { isAxiosError } from "axios";
import {
  Button,
  Input,
  Select,
  Checkbox,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import {
  Upload,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUploadDataset } from "@/lib/hooks";

const domains = [
  { value: "general", label: "General" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "law", label: "Law" },
  { value: "finance", label: "Finance" },
  { value: "news", label: "News" },
  { value: "religion", label: "Religion" },
];

const allowedExtensions = [".pdf", ".docx", ".txt"];

function isAllowedDocument(file: File) {
  return allowedExtensions.some((extension) =>
    file.name.toLowerCase().endsWith(extension),
  );
}

function getUploadErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const responseData = error.response?.data as
      | { message?: string; detail?: string; error?: string }
      | undefined;

    if (status && status >= 500) {
      return "Upload failed on the server. Please try again later.";
    }

    return (
      responseData?.message ||
      responseData?.detail ||
      responseData?.error ||
      "Upload failed. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Upload failed. Please try again.";
}

export function DatasetUploadForm() {
  const router = useRouter();
  const uploadMutation = useUploadDataset();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("general");
  const [subdomain, setSubdomain] = useState("");
  const [language, setLanguage] = useState("amharic");
  const [hasConsent, setHasConsent] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const isSensitiveDomain = ["health", "law", "finance"].includes(domain);

  const selectedFileLabel = useMemo(
    () => selectedFile?.name ?? "No file selected yet",
    [selectedFile],
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!isAllowedDocument(file)) {
      setSelectedFile(null);
      setError("Only PDF, DOCX, or TXT files are allowed.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedFile) {
      setError("Please choose a document file to upload.");
      return;
    }

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!hasConsent) {
      setError("You must confirm consent before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("domain", domain);
    formData.append("subdomain", subdomain.trim());
    formData.append("language", language || "amharic");
    formData.append("consent_given", String(hasConsent));

    try {
      await uploadMutation.mutateAsync(formData);
      setIsSuccess(true);
    } catch (uploadError) {
      setError(getUploadErrorMessage(uploadError));
    }
  };

  const isUploading = uploadMutation.isPending;

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto py-12 text-center space-y-6"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Upload Successful!</h2>
          <p className="text-muted-foreground">
            Your dataset has been submitted and is now pending AI Quality
            Control. You can track its progress in your submissions.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push("/contributor/submissions")}
            className="w-full"
          >
            View My Submissions
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsSuccess(false)}
            className="w-full"
          >
            Upload Another Dataset
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/contributor"
          className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <Card className="border-border/50 shadow-xl">
        <CardHeader className="border-b bg-muted/30 pb-6">
          <CardTitle className="text-2xl font-black">
            Upload New Dataset
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Provide details about your dataset and upload the source files.
          </p>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold tracking-tight">
                  Title
                </label>
                <Input
                  placeholder="e.g. Amharic News Corpus 2024"
                  className="h-11"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold tracking-tight">
                  Domain
                </label>
                <Select
                  value={domain}
                  onChange={(event) => setDomain(event.target.value)}
                  className="h-11"
                  required
                >
                  {domains.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold tracking-tight">
                Description
              </label>
              <Input
                placeholder="Optional summary of the document or dataset"
                className="h-11"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold tracking-tight">
                Sub-domain
              </label>
              <Input
                placeholder="e.g. Political Journalism, Medical Reports"
                className="h-11"
                value={subdomain}
                onChange={(event) => setSubdomain(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold tracking-tight">
                Language
              </label>
              <Select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="h-11"
              >
                <option value="amharic">Amharic</option>
                <option value="english">English</option>
                <option value="other">Other</option>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold tracking-tight">File</label>
              <div className="border-2 border-dashed rounded-2xl p-12 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group relative">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  required
                />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                    <Upload className="w-8 h-8 text-primary group-hover:text-white" />
                  </div>
                  <p className="text-lg font-bold">Select File to Upload</p>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">
                    Drag and drop your file here. Supported: PDF, TXT, DOCX
                  </p>
                  <p className="mt-3 text-xs font-medium text-muted-foreground">
                    {selectedFileLabel}
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
                  <div className="p-6 rounded-2xl border-2 border-emerald-500/20 bg-emerald-500/5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20">
                        <ShieldCheck className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-emerald-900 uppercase tracking-wider">
                          Verification Required
                        </p>
                        <p className="text-xs text-emerald-800/80">
                          Proof of authorization needed for {domain} datasets.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <p className="text-xs text-muted-foreground leading-relaxed italic">
                        By uploading to this domain, you must provide valid
                        proof of ownership or authorization under Ethiopian Data
                        Privacy Laws.
                      </p>
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 gap-2 border-emerald-500/30 text-emerald-700 hover:bg-emerald-100"
                        >
                          <Plus className="w-4 h-4" />
                          Upload Auth Document
                        </Button>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          Accepted: PDF, JPG, PNG
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4 shadow-inner">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={hasConsent}
                  onChange={(event) => setHasConsent(event.target.checked)}
                  required
                  className="mt-1"
                />
                <label
                  htmlFor="consent"
                  className="text-sm font-medium leading-relaxed cursor-pointer select-none"
                >
                  I confirm that I have the legal right to share this data and
                  allow it to be used for AI training and marketplace datasets.
                  I understand that fraudulent submissions will result in
                  account termination.
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="h-12 px-8"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!hasConsent || isUploading}
                className="h-12 px-12 shadow-lg shadow-primary/30"
              >
                {isUploading
                  ? "Uploading Document..."
                  : "Submit for Validation"}
              </Button>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
