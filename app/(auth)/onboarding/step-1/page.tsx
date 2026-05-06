"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useApplicationStatus } from "@/lib/hooks";
import { useOnboarding } from "@/context/onboarding-context";
import { PersonalInfoForm } from "@/components/onboarding/personal-info-form";

export default function Step1Page() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: applicationStatus, isLoading: isApplicationStatusLoading, isFetching: isApplicationStatusFetching } = useApplicationStatus();
  const { setCurrentStep } = useOnboarding();

  useEffect(() => {
    if (isAuthLoading || isApplicationStatusLoading || isApplicationStatusFetching) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const normalizedRole = (applicationStatus?.role || user.role || "").toLowerCase();
    if (normalizedRole !== "unknown") {
      const roleRoots = ["contributor", "annotator", "expert", "buyer", "admin"];
      router.replace(roleRoots.includes(normalizedRole) ? `/${normalizedRole}` : "/dashboard/profile");
      return;
    }

    if (applicationStatus?.has_application) {
      router.replace("/onboarding/pending");
      return;
    }

    setCurrentStep(1);
  }, [applicationStatus, isApplicationStatusFetching, isApplicationStatusLoading, isAuthLoading, router, setCurrentStep, user]);

  if (isAuthLoading || isApplicationStatusLoading || isApplicationStatusFetching || !user) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading onboarding...</div>;
  }

  return <PersonalInfoForm />;
}
