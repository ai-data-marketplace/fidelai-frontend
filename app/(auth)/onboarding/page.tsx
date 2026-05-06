"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useApplicationStatus } from "@/lib/hooks";

export default function OnboardingRoot() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: applicationStatus, isLoading: isApplicationStatusLoading } = useApplicationStatus();

  useEffect(() => {
    if (isAuthLoading || isApplicationStatusLoading || !user) return;
    const normalizedRole = (applicationStatus?.role || user.role || "").toLowerCase();
    if (normalizedRole === "unknown") {
      router.replace(applicationStatus?.has_application ? "/onboarding/pending" : "/onboarding/step-1");
      return;
    }

    const roleRoots = ["contributor", "annotator", "expert", "buyer", "admin"];
    router.replace(roleRoots.includes(normalizedRole) ? `/${normalizedRole}` : "/dashboard/profile");
  }, [applicationStatus, isApplicationStatusLoading, isAuthLoading, router, user]);

  return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading onboarding...</div>;
}
