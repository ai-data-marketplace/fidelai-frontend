"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, FileText, ShieldCheck, Upload, Clock3, BookOpen, FileType2 } from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useMySubmission } from "@/lib/hooks";

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getBadgeVariant(status: string) {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "approved":
    case "completed":
      return "success";
    case "under_review":
    case "pending":
      return "warning";
    case "rejected":
      return "destructive";
    default:
      return "default";
  }
}

function displayStatus(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function SubmissionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: submission, isLoading, isError } = useMySubmission(params.id);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/contributor/submissions" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Submissions
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Submission Details</h1>
            <p className="text-muted-foreground">Review the document metadata, validation status, and attached files.</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="py-20 text-center text-muted-foreground">Loading submission details...</CardContent>
        </Card>
      ) : isError || !submission ? (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="py-20 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <FileText className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Submission not found</h2>
              <p className="text-muted-foreground text-sm">The submission may have been removed or is unavailable.</p>
            </div>
            <Button onClick={() => router.push("/contributor/submissions")}>Return to Submissions</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 space-y-6">
            <Card className="overflow-hidden border-border/50 shadow-sm">
              <div className="h-1 bg-gradient-to-r from-primary via-orange-500 to-amber-500" />
              <CardHeader className="bg-muted/20 border-b">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="w-4 h-4 text-primary" />
                        <span>Document submission record</span>
                    </div>
                    <CardTitle className="text-2xl font-black">{submission.title}</CardTitle>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                      {submission.description || "No description was provided for this submission."}
                    </p>
                  </div>
                  <Badge variant={getBadgeVariant(submission.review_status)} className="capitalize">
                    {displayStatus(submission.review_status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  <div className="rounded-2xl border bg-background p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      <FileType2 className="w-4 h-4" />
                      Domain
                    </div>
                    <p className="text-lg font-bold capitalize">{submission.domain}</p>
                  </div>
                  <div className="rounded-2xl border bg-background p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      <BookOpen className="w-4 h-4" />
                      Sub-domain
                    </div>
                    <p className="text-lg font-bold">{submission.subdomain || "—"}</p>
                  </div>
                  <div className="rounded-2xl border bg-background p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      <Upload className="w-4 h-4" />
                      Language
                    </div>
                    <p className="text-lg font-bold capitalize">{submission.language}</p>
                  </div>
                  
                  <div className="rounded-2xl border bg-background p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      <ShieldCheck className="w-4 h-4" />
                      Consent
                    </div>
                    <p className="text-lg font-bold">{submission.consent_given ? "Given" : "Not given"}</p>
                  </div>
                  <div className="rounded-2xl border bg-background p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" />
                      Submitted
                    </div>
                    <p className="text-lg font-bold">{formatDate(submission.created_at)}</p>
                  </div>
                </div>

                <div className="rounded-2xl border bg-muted/20 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <Clock3 className="w-4 h-4 text-muted-foreground" />
                    Validation Notes
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {submission.validation_notes || "No validation notes have been added yet."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Attached Files
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {submission.files?.length ? (
                  <div className="divide-y">
                    {submission.files.map((file) => (
                      <div key={file.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
                        <div>
                          <p className="font-semibold">{file.file_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.file_type} • {formatBytes(file.file_size)} • Uploaded {formatDate(file.uploaded_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center text-muted-foreground">
                    No files are attached to this submission.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-4 space-y-6">
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="text-base font-bold">Submission Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">Review Status</span>
                  <Badge variant={getBadgeVariant(submission.review_status)} className="capitalize">
                    {displayStatus(submission.review_status)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">Data Type</span>
                  <span className="text-sm font-semibold capitalize">{submission.data_type || "Text"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">Updated</span>
                  <span className="text-sm font-semibold">{formatDate(submission.updated_at)}</span>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      )}
    </div>
  );
}