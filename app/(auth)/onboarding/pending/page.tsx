"use client";

import Link from "next/link";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { useApplicationStatus } from "@/lib/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PendingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: status, isLoading, isFetching } = useApplicationStatus();

  useEffect(() => {
    if (isLoading || isFetching) return;

    if (!status) return;

    if (!status.has_application) {
      router.replace("/onboarding/step-1");
    }
  }, [isFetching, isLoading, router, status]);

  const roleLabel = status?.role_applied_for || user?.role || "role application";
  const applicationState = status?.application_status || "UNDER REVIEW";

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 bg-background min-h-[calc(100vh-80px)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 md:p-10 rounded-3xl border border-border/50 bg-card/50 shadow-2xl"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 p-1 mb-6 shadow-xl shadow-orange-500/20"
          >
            <div className="w-full h-full bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-2xl font-bold tracking-tight mb-3">Application Under Review</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Thank you for submitting your <span className="font-semibold text-foreground capitalize">{roleLabel}</span> application.
            Your current status is <span className="font-semibold text-foreground">{applicationState}</span> while our team reviews it.
          </p>

          <div className="bg-muted/50 rounded-xl p-4 mb-8 text-left border border-border/50">
            <h4 className="flex items-center gap-2 text-sm font-semibold mb-3 text-foreground">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              What happens next?
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-orange-500 font-bold">•</span>
                We will verify your details and readiness assessment.
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500 font-bold">•</span>
                You will receive an email within 24-48 hours.
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500 font-bold">•</span>
                Once approved, you'll get immediate access to your dashboard.
              </li>
            </ul>
          </div>

          <Link
            href="/"
            className="w-full flex h-12 items-center justify-center rounded-xl brand-gradient-btn text-white px-8 text-sm font-bold shadow-lg brand-shadow brand-shadow-hover transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Return to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
