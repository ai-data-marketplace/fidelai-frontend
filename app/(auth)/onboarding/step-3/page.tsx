"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useApplicationStatus } from "@/lib/hooks";
import { useOnboarding } from "@/context/onboarding-context";

const ReadinessTest = dynamic(() => 
  import("@/components/onboarding/readiness-test").then(mod => ({ default: mod.ReadinessTest }))
);

export default function Step3Page() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: applicationStatus, isLoading: isApplicationStatusLoading, isFetching: isApplicationStatusFetching } = useApplicationStatus();
  const { completedSteps, setCurrentStep } = useOnboarding();

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

    if (!completedSteps.includes(1)) {
      router.replace("/onboarding/step-1");
      return;
    }

    if (!completedSteps.includes(2)) {
      router.replace("/onboarding/step-2");
      return;
    }

    setCurrentStep(3);
  }, [applicationStatus, completedSteps, isApplicationStatusFetching, isApplicationStatusLoading, isAuthLoading, router, setCurrentStep, user]);

  if (isAuthLoading || isApplicationStatusLoading || isApplicationStatusFetching || !user || !completedSteps.includes(1) || !completedSteps.includes(2)) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading onboarding...</div>;
  }

  return <ReadinessTest />;
}
