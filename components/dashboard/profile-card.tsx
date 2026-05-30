"use client";

import { cn } from "@/lib/utils";
import { Badge } from "lucide-react";

interface ProfileCardProps {
  user: {
    fullName: string;
    email: string;
    role: string;
    status: string;
    joinedDate: string;
    avatar?: string;
  };
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="h-24 w-24 rounded-full bg-primary/10 border-4 border-primary/5 flex items-center justify-center text-3xl font-bold text-primary shadow-inner">
          {user.fullName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
            <h1 className="text-2xl font-bold">{user.fullName}</h1>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
              {user.role}
            </span>
            <span
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                user.status === "active"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20",
              )}
            >
              {user.status}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">{user.email}</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Joined {user.joinedDate}
          </p>
        </div>

        <button className="h-11 px-6 rounded-xl border border-primary/20 bg-primary/5 text-primary text-sm font-bold transition-all hover:bg-primary hover:text-white brand-shadow-hover">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
