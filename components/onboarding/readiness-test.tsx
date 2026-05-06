"use client";

import { useOnboarding } from "@/context/onboarding-context";
import { useSubmitOnboardingComplete } from "@/lib/hooks";
import { ArrowLeft, CheckCircle2, UploadCloud, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

export function ReadinessTest() {
  const {
    role,
    readinessData,
    setReadinessData,
    setCurrentStep,
    markStepComplete,
    buildSubmissionFormData,
  } = useOnboarding();
  const router = useRouter();
  const queryClient = useQueryClient();
  const submitMutation = useSubmitOnboardingComplete();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!role) {
      router.push("/onboarding/step-1");
    }
  }, [role, router]);

  const isReadyToSubmit = useMemo(() => {
    return readinessData.completed && Object.keys(readinessData.answers).length > 0 && readinessData.score >= 0;
  }, [readinessData.completed, readinessData.answers, readinessData.score]);

  const setReadiness = (answers: Record<string, unknown>, score: number) => {
    setError("");
    setReadinessData({ answers, score, completed: true });
  };

  const handleSubmit = async () => {
    if (!isReadyToSubmit) {
      setError("Please complete the readiness check before continuing.");
      return;
    }

    setError("");

    try {
      const formData = buildSubmissionFormData();
      await submitMutation.mutateAsync(formData);
      queryClient.setQueryData(["applicationStatus"], {
        role: (role || "unknown").toString(),
        is_verified: true,
        has_application: true,
        application_id: null,
        application_status: "UNDER REVIEW",
        role_applied_for: role,
        submitted_at: new Date().toISOString(),
      });
      markStepComplete(3);
      router.push("/onboarding/pending");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to submit onboarding right now.");
    }
  };

  const handleBack = () => {
    setCurrentStep(2);
    router.push("/onboarding/step-2");
  };

  if (!role) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Readiness Check</h2>
        <p className="text-muted-foreground">Complete the final assessment so we can submit your onboarding application.</p>
      </div>

      <div className="bg-muted/30 p-6 sm:p-8 rounded-2xl border border-border/50 shadow-sm relative overflow-hidden">
        {role === "contributor" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-primary" />
              Sample Dataset Readiness
            </h3>
            <p className="text-sm text-muted-foreground">Confirm that you can upload a valid text dataset package.</p>

            <button
              type="button"
              onClick={() => setReadiness({ sample_dataset: "sample_corpus_v1.zip" }, 100)}
              className={`w-full border-2 border-dashed rounded-xl p-8 text-center transition-colors ${readinessData.answers.sample_dataset ? "border-emerald-500/50 bg-emerald-500/5" : "border-border hover:border-primary/50 hover:bg-primary/5"}`}
            >
              {readinessData.answers.sample_dataset ? (
                <div className="flex flex-col items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                  <span className="font-medium">{String(readinessData.answers.sample_dataset)} selected</span>
                  <span className="text-xs opacity-80">Ready for upload submission</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <UploadCloud className="w-8 h-8 mb-2" />
                  <span className="font-medium text-foreground">Click to confirm sample dataset readiness</span>
                  <span className="text-xs">This sets your readiness score for step 3.</span>
                </div>
              )}
            </button>
          </div>
        )}

        {role === "annotator" && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Annotation Readiness</h3>
            <p className="text-sm text-muted-foreground">Select the correct translation sentiment for the sentence below.</p>

            <div className="p-4 bg-background border border-border rounded-lg text-center text-lg font-amharic font-medium shadow-sm">
              "ይህ በጣም ግሩም ስራ ነው!"
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Negative", score: 0 },
                { label: "Neutral", score: 50 },
                { label: "Positive", score: 100 },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setReadiness({ chosen_answer: option.label }, option.score)}
                  className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                    readinessData.answers.chosen_answer === option.label
                      ? "bg-orange-500 text-white border-orange-500 shadow-lg scale-[1.03]"
                      : "bg-background border-border hover:border-orange-500/50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {role === "expert" && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Expert Review Readiness</h3>
            <p className="text-sm text-muted-foreground">Adjudicate the correct label for the entity extraction example.</p>

            <div className="p-4 bg-background border border-border rounded-lg shadow-sm">
              <span className="text-muted-foreground text-sm">Source Text:</span>
              <p className="font-amharic text-lg font-medium mt-1">አዲስ አበባ ከተማ አስተዳደር</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setReadiness({ adjudication: "LOCATION" }, 100)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  readinessData.answers.adjudication === "LOCATION"
                    ? "bg-emerald-500/10 border-emerald-500"
                    : "bg-background border-border hover:border-emerald-500/50"
                }`}
              >
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Option A</div>
                <div className="font-medium text-emerald-600 flex justify-between items-center">
                  LOCATION (GPE)
                  {readinessData.answers.adjudication === "LOCATION" && <Check className="w-4 h-4" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setReadiness({ adjudication: "ORGANIZATION" }, 100)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  readinessData.answers.adjudication === "ORGANIZATION"
                    ? "bg-emerald-500/10 border-emerald-500"
                    : "bg-background border-border hover:border-emerald-500/50"
                }`}
              >
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Option B</div>
                <div className="font-medium text-emerald-600 flex justify-between items-center">
                  ORGANIZATION (ORG)
                  {readinessData.answers.adjudication === "ORGANIZATION" && <Check className="w-4 h-4" />}
                </div>
              </button>
            </div>
          </div>
        )}

        {role === "buyer" && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Buyer Requirement Readiness</h3>
            <p className="text-sm text-muted-foreground">Select the primary requirement metric for your dataset search.</p>

            <div className="space-y-3">
              {[
                "Volume / Size",
                "Quality / Accuracy",
                "Domain Specificity",
                "Diversity / dialect coverage",
              ].map((requirement) => (
                <label
                  key={requirement}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    readinessData.answers.primary_requirement === requirement
                      ? "bg-primary/10 border-primary"
                      : "bg-background border-border hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <input
                    type="radio"
                    name="buyerReq"
                    checked={readinessData.answers.primary_requirement === requirement}
                    onChange={() => setReadiness({ primary_requirement: requirement }, 100)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary bg-background"
                  />
                  <span className="font-medium text-sm">{requirement}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl flex items-start gap-3 border border-destructive/20 shadow-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-6">
        <button
          type="button"
          onClick={handleBack}
          disabled={submitMutation.isPending}
          className="flex items-center gap-2 h-11 px-6 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isReadyToSubmit || submitMutation.isPending}
          className="flex items-center gap-2 h-12 px-8 rounded-xl brand-gradient-btn font-bold text-white shadow-lg brand-shadow brand-shadow-hover transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:grayscale"
        >
          {submitMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {submitMutation.isPending ? "Submitting..." : "Complete Setup"}
        </button>
      </div>
    </motion.div>
  );
}