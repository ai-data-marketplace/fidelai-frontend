"use client";

import { useEffect, useState } from "react";
import { Badge, Button } from "@/components/ui";
import { ShieldCheck, ShieldAlert, ChevronLeft, ChevronRight, Calendar, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import { PAGINATION } from "@/lib/constants";
import { useAdminPlatformUsers, useDeactivateAdminUser, useReactivateAdminUser } from "@/lib/hooks";

const statusStyles = {
  Active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Suspended: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  Deactivated: "bg-muted text-muted-foreground border-border",
};

const verificationStyles = {
  Verified: "text-blue-600 font-bold",
  Unverified: "text-muted-foreground",
  Pending: "text-amber-600 font-bold",
};

export function UsersTable() {
  const [page, setPage] = useState(1);
  const pageSize = PAGINATION.DEFAULT_PAGE_SIZE;
  const { data, isLoading, isError } = useAdminPlatformUsers(page, pageSize);
  const deactivateUser = useDeactivateAdminUser();
  const reactivateUser = useReactivateAdminUser();

  useEffect(() => {
    setPage(1);
  }, []);

  const users = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const hasPrevious = Boolean(data?.previous) && page > 1;
  const hasNext = Boolean(data?.next) && page < totalPages;
  const isMutating = deactivateUser.isPending || reactivateUser.isPending;

  const formatJoinedDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="border border-border/50 rounded-3xl overflow-hidden bg-card/30 backdrop-blur-sm shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b bg-muted/40 text-muted-foreground font-bold text-[10px] uppercase tracking-[0.2em]">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Verification</th>
              <th className="px-6 py-4">Joined Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              <tr>
                <td className="px-6 py-8 text-sm text-muted-foreground" colSpan={6}>Loading platform users...</td>
              </tr>
            ) : isError ? (
              <tr>
                <td className="px-6 py-8 text-sm text-destructive" colSpan={6}>Failed to load platform users. Please refresh and try again.</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-sm text-muted-foreground" colSpan={6}>No platform users found.</td>
              </tr>
            ) : users.map((user, idx) => (
              <motion.tr 
                key={user.id ?? `${user.user}-${idx}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                       <UserIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-black text-foreground">{user.user}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold capitalize">{user.role}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className={`rounded-full px-3 py-0 scale-90 ${statusStyles[user.status as keyof typeof statusStyles] ?? statusStyles.Active}`}>
                    {user.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {user.verification ? (
                      <ShieldCheck className="h-4 w-4 text-blue-500" />
                    ) : (
                      <ShieldAlert className="h-4 w-4 text-rose-500" />
                    )}
                    <span className={`text-xs ${user.verification ? verificationStyles.Verified : verificationStyles.Unverified}`}>
                      {user.verification ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Calendar className="h-3 w-3 text-primary opacity-50" />
                    {formatJoinedDate(user.joined_date)}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {String(user.status).toLowerCase() === "active" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-full px-3 text-xs font-semibold"
                        onClick={() => deactivateUser.mutate(user.id)}
                        isLoading={isMutating}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="h-8 rounded-full px-3 text-xs font-semibold"
                        onClick={() => reactivateUser.mutate(user.id)}
                        isLoading={isMutating}
                      >
                        Activate
                      </Button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-border/50 bg-background/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            aria-label="Previous page"
            disabled={!hasPrevious}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            aria-label="Next page"
            disabled={!hasNext}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
