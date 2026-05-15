"use client";

import { 
  Badge, 
  Button, 
  Card, 
  CardContent 
} from "@/components/ui";
import { 
  UserCircle, 
  CheckCircle2, 
  XSquare, 
  Eye,
  Briefcase,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { PAGINATION } from "@/lib/constants";
import {
  useAdminRoleApplications,
  useApproveAdminRoleApplication,
  useRejectAdminRoleApplication,
  type AdminRoleApplication,
} from "@/lib/hooks";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";

const ROLE_APPLICATION_PAGE_SIZE = PAGINATION.DEFAULT_PAGE_SIZE;
const ROLE_APPLICATION_STATUSES = ["pending", "approved", "rejected"] as const;

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString();
}

function ApplicationValue({ value }: { value: unknown }) {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">-</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-muted-foreground">-</span>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {value.map((item, index) => (
          <span
            key={index}
            className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"
          >
            {typeof item === "object" && item !== null ? JSON.stringify(item) : String(item)}
          </span>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);

    if (entries.length === 0) {
      return <span className="text-muted-foreground">-</span>;
    }

    return (
      <div className="space-y-3 rounded-2xl border border-border/50 bg-background/70 p-4">
        {entries.map(([key, nestedValue]) => (
          <div key={key} className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              {formatLabel(key)}
            </p>
            <ApplicationValue value={nestedValue} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "boolean") {
    return <span className="font-semibold">{value ? "Yes" : "No"}</span>;
  }

  return <span className="font-medium break-words">{String(value)}</span>;
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/70 p-4">
      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <div className="text-sm leading-relaxed text-foreground">{value}</div>
    </div>
  );
}

export function RoleApprovals() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<AdminRoleApplication | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<(typeof ROLE_APPLICATION_STATUSES)[number]>("pending");

  const { data, isLoading, isFetching } = useAdminRoleApplications({
    page,
    pageSize: ROLE_APPLICATION_PAGE_SIZE,
    status: statusFilter,
  });
  const approveMutation = useApproveAdminRoleApplication();
  const rejectMutation = useRejectAdminRoleApplication();

  const handlePreview = (application: AdminRoleApplication) => {
    setSelectedApplication(application);
    setIsPreviewOpen(true);
  };

  const applications = data?.results ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.count ?? 0) / ROLE_APPLICATION_PAGE_SIZE));
  const hasPrevious = Boolean(data?.previous) && page > 1;
  const hasNext = Boolean(data?.next) && page < totalPages;
  const isActionPending = approveMutation.isPending || rejectMutation.isPending;

  const statusClasses: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    rejected: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  };

  const handleReviewAction = async (application: AdminRoleApplication, action: "approve" | "reject") => {
    if (isActionPending) return;

    const mutation = action === "approve" ? approveMutation : rejectMutation;
    const updatedApplication = await mutation.mutateAsync(application.id);

    if (selectedApplication?.id === updatedApplication.id) {
      setSelectedApplication(updatedApplication);
    }
  };

  const handleStatusFilterChange = (nextStatus: (typeof ROLE_APPLICATION_STATUSES)[number]) => {
    setStatusFilter(nextStatus);
    setPage(1);
    setIsPreviewOpen(false);
    setSelectedApplication(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Role Applications
        </h3>
        <p className="text-xs font-semibold text-muted-foreground">
          {formatLabel(statusFilter)} applications
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/50 bg-muted/30 p-2">
        {ROLE_APPLICATION_STATUSES.map((status) => {
          const isActive = statusFilter === status;

          return (
            <Button
              key={status}
              size="sm"
              variant={isActive ? "default" : "ghost"}
              onClick={() => handleStatusFilterChange(status)}
              className={`rounded-xl font-bold capitalize ${isActive ? "shadow-lg shadow-primary/20" : "text-muted-foreground"}`}
            >
              {status}
            </Button>
          );
        })}
      </div>

      {isLoading && applications.length === 0 ? (
        <Card className="border-border/50 bg-card/50 shadow-sm">
          <CardContent className="p-6 text-sm text-muted-foreground">
            Loading {formatLabel(statusFilter).toLowerCase()} applications...
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
        {applications.map((app) => (
          <Card key={app.id} className="border-border/50 shadow-sm overflow-hidden bg-card/50">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <UserCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <p className="font-black text-lg">{app.user.full_name}</p>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 scale-90">
                        {formatLabel(app.role_applied_for)}
                      </Badge>
                      <Badge variant="outline" className={`scale-90 ${statusClasses[app.status] ?? "bg-muted text-muted-foreground border-border"}`}>
                        {formatLabel(app.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                      {app.user.email} • Submitted {formatDateTime(app.submitted_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-6 bg-muted/40 border-t md:border-t-0 md:border-l border-border/50 shrink-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="font-bold gap-2 bg-background shadow-sm"
                    onClick={() => handlePreview(app)}
                    disabled={isActionPending}
                  >
                    <Eye className="h-4 w-4" />
                    Review Docs
                  </Button>
                  {app.status === "pending" ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 font-bold gap-2 shadow-lg shadow-emerald-500/20"
                        disabled={isActionPending}
                        onClick={() => handleReviewAction(app, "approve")}
                      >
                         <CheckCircle2 className="h-4 w-4" />
                         Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-rose-500 hover:bg-rose-500/10 font-bold gap-2"
                        disabled={isActionPending}
                        onClick={() => handleReviewAction(app, "reject")}
                      >
                         <XSquare className="h-4 w-4" />
                         Reject
                      </Button>
                    </div>
                  ) : (
                    <Badge variant="outline" className={`px-3 py-2 capitalize ${statusClasses[app.status] ?? "bg-muted text-muted-foreground border-border"}`}>
                      {formatLabel(app.status)}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {applications.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <p className="text-xs font-semibold text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!hasPrevious || isFetching}
              onClick={() => setPage((previousPage) => Math.max(1, previousPage - 1))}
              className="gap-2"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!hasNext || isFetching}
              onClick={() => setPage((previousPage) => Math.min(totalPages, previousPage + 1))}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      <Modal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
        title="Application Data"
        className="max-w-5xl"
      >
        {selectedApplication && (
          <div className="space-y-5 pt-4 pb-1">
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-xl border">
              Structured application details submitted by the candidate.
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <InfoCard
                label="Applicant"
                value={(
                  <div>
                    <p className="font-bold">{selectedApplication.user.full_name}</p>
                    <p className="text-xs text-muted-foreground">{selectedApplication.user.email}</p>
                  </div>
                )}
              />
              <InfoCard
                label="Applied Role"
                value={formatLabel(selectedApplication.role_applied_for)}
              />
              <InfoCard
                label="Application Status"
                value={formatLabel(selectedApplication.status)}
              />
              <InfoCard
                label="Submitted At"
                value={formatDateTime(selectedApplication.submitted_at)}
              />
              <InfoCard
                label="Reviewed At"
                value={formatDateTime(selectedApplication.reviewed_at)}
              />
              <InfoCard
                label="Reviewed By"
                value={selectedApplication.reviewed_by ? selectedApplication.reviewed_by.full_name : "-"}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                  Application Payload
                </h4>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {formatLabel(selectedApplication.role_applied_for)}
                </Badge>
              </div>
              <ApplicationValue value={selectedApplication.application_data} />
            </div>

            {selectedApplication.documents && selectedApplication.documents.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Supporting Documents</h4>
                <div className="grid gap-3">
                  {selectedApplication.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border bg-background">
                      <div>
                        <p className="font-semibold">{doc.file.split('/').pop()}</p>
                        <p className="text-xs text-muted-foreground">{doc.purpose} • Uploaded {formatDateTime(doc.uploaded_at)}</p>
                      </div>
                      <div className="ml-4">
                        <a href={doc.file} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="font-bold">Open</Button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="ghost" onClick={() => setIsPreviewOpen(false)} disabled={isActionPending}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
