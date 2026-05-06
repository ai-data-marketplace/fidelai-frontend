"use client";

import { useOnboarding } from "@/context/onboarding-context";
import { useSubmitOnboardingComplete } from "@/lib/hooks";
import { ArrowLeft, CheckCircle2, UploadCloud, Check, Loader2, FileText, Zap, Star, Target } from "lucide-react";
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
    if (!readinessData.completed) return false;
    const answers = readinessData.answers;
    
    switch (role) {
      case "contributor":
        return !!(answers.dataset_name && answers.dataset_description && answers.primary_domain && answers.file_format);
      case "annotator":
        return !!(answers.content_types && Array.isArray(answers.content_types) && answers.content_types.length > 0 && answers.quality_standard && answers.batch_size);
      case "expert":
        return !!(answers.review_types && Array.isArray(answers.review_types) && answers.review_types.length > 0 && answers.focus_area && answers.capacity);
      case "buyer":
        return !!answers.primary_requirement;
      default:
        return false;
    }
  }, [readinessData, role]);

  const updateAnswers = (newAnswers: Record<string, unknown>) => {
    setError("");
    setReadinessData({
      answers: { ...readinessData.answers, ...newAnswers },
      score: 100,
      completed: true,
    });
  };

  const handleSubmit = async () => {
    if (!isReadyToSubmit) {
      setError("Please complete all profile settings before continuing.");
      return;
    }

    setError("");

    try {
      const formData = buildSubmissionFormData();
      await submitMutation.mutateAsync(formData);
      queryClient.setQueryData(["applicationStatus"], {
        role: "unknown",
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
        <h2 className="text-2xl font-bold tracking-tight mb-2">Finalize Your Profile</h2>
        <p className="text-muted-foreground">Configure your preferences and complete your profile setup to submit your application.</p>
      </div>

      <div className="bg-muted/30 p-6 sm:p-8 rounded-2xl border border-border/50 shadow-sm relative overflow-hidden">
        {role === "contributor" && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Dataset Details
            </h3>
            <p className="text-sm text-muted-foreground">Tell us about the dataset you'll be submitting.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Dataset Name</label>
                <input
                  type="text"
                  value={String(readinessData.answers.dataset_name || "")}
                  onChange={(e) => updateAnswers({ dataset_name: e.target.value })}
                  placeholder="e.g., Amharic News Articles Collection"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dataset Description</label>
                <textarea
                  value={String(readinessData.answers.dataset_description || "")}
                  onChange={(e) => updateAnswers({ dataset_description: e.target.value })}
                  placeholder="Describe your dataset: domain, size, format, quality level..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Primary Domain/Category</label>
                <select
                  value={String(readinessData.answers.primary_domain || "")}
                  onChange={(e) => updateAnswers({ primary_domain: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a domain...</option>
                  <option value="news">News / Media</option>
                  <option value="health">Health / Medical</option>
                  <option value="education">Education / Academic</option>
                  <option value="legal">Legal / Compliance</option>
                  <option value="finance">Finance / Business</option>
                  <option value="social">Social Media</option>
                  <option value="technical">Technical / IT</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">File Format</label>
                <button
                  type="button"
                  onClick={() => updateAnswers({ file_format: "zip" })}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    readinessData.answers.file_format === "zip"
                      ? "bg-emerald-500/10 border-emerald-500"
                      : "bg-background border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${readinessData.answers.file_format === "zip" ? "text-emerald-600" : "text-muted-foreground"}`} />
                    <div>
                      <div className="text-sm font-medium">ZIP file (.zip)</div>
                      <div className="text-xs text-muted-foreground">Your dataset will be submitted as a compressed archive.</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {role === "annotator" && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Annotation Preferences
            </h3>
            <p className="text-sm text-muted-foreground">Configure your annotation settings and preferences.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Content Types You Prefer</label>
                <div className="space-y-2">
                  {["News & Media", "Social Media", "Technical & Documentation", "Creative & Literary"].map((type) => {
                    const selected = Array.isArray(readinessData.answers.content_types) && 
                      readinessData.answers.content_types.includes(type);
                    return (
                      <label
                        key={type}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selected
                            ? "bg-primary/10 border-primary"
                            : "bg-background border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(e) => {
                            const current = Array.isArray(readinessData.answers.content_types) 
                              ? readinessData.answers.content_types 
                              : [];
                            const updated = e.target.checked
                              ? [...current, type]
                              : current.filter((t) => t !== type);
                            updateAnswers({ content_types: updated });
                          }}
                          className="w-4 h-4 rounded border-border accent-primary"
                        />
                        <span className="text-sm font-medium">{type}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Quality Standard</label>
                <div className="space-y-2">
                  {[
                    { value: "high", label: "High", desc: "Precise, detailed annotations" },
                    { value: "medium", label: "Medium", desc: "Standard accuracy with good speed" },
                    { value: "standard", label: "Standard", desc: "Acceptable quality with flexibility" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        readinessData.answers.quality_standard === option.value
                          ? "bg-primary/10 border-primary"
                          : "bg-background border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="quality"
                        checked={readinessData.answers.quality_standard === option.value}
                        onChange={() => updateAnswers({ quality_standard: option.value })}
                        className="w-4 h-4 mt-0.5 border-border accent-primary"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Preferred Batch Size</label>
                <div className="space-y-2">
                  {[
                    { value: "small", label: "Small", desc: "10-50 items per batch" },
                    { value: "medium", label: "Medium", desc: "50-200 items per batch" },
                    { value: "large", label: "Large", desc: "200+ items per batch" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        readinessData.answers.batch_size === option.value
                          ? "bg-primary/10 border-primary"
                          : "bg-background border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="batch"
                        checked={readinessData.answers.batch_size === option.value}
                        onChange={() => updateAnswers({ batch_size: option.value })}
                        className="w-4 h-4 mt-0.5 border-border accent-primary"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {role === "expert" && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Review Preferences
            </h3>
            <p className="text-sm text-muted-foreground">Configure your expertise and review preferences.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Types of Datasets You Review</label>
                <div className="space-y-2">
                  {["NER & Entity Recognition", "Sentiment Analysis", "Text Classification", "Translation Quality"].map((type) => {
                    const selected = Array.isArray(readinessData.answers.review_types) && 
                      readinessData.answers.review_types.includes(type);
                    return (
                      <label
                        key={type}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selected
                            ? "bg-primary/10 border-primary"
                            : "bg-background border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(e) => {
                            const current = Array.isArray(readinessData.answers.review_types) 
                              ? readinessData.answers.review_types 
                              : [];
                            const updated = e.target.checked
                              ? [...current, type]
                              : current.filter((t) => t !== type);
                            updateAnswers({ review_types: updated });
                          }}
                          className="w-4 h-4 rounded border-border accent-primary"
                        />
                        <span className="text-sm font-medium">{type}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Review Focus Area</label>
                <div className="space-y-2">
                  {[
                    { value: "qa", label: "Quality Assurance", desc: "Focus on data accuracy & consistency" },
                    { value: "adjudication", label: "Adjudication", desc: "Resolve disputed annotations" },
                    { value: "validation", label: "Training Data Validation", desc: "Ensure data readiness for models" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        readinessData.answers.focus_area === option.value
                          ? "bg-primary/10 border-primary"
                          : "bg-background border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="focus"
                        checked={readinessData.answers.focus_area === option.value}
                        onChange={() => updateAnswers({ focus_area: option.value })}
                        className="w-4 h-4 mt-0.5 border-border accent-primary"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Review Capacity per Week</label>
                <div className="space-y-2">
                  {[
                    { value: "light", label: "Light", desc: "1-5 datasets per week" },
                    { value: "moderate", label: "Moderate", desc: "5-10 datasets per week" },
                    { value: "heavy", label: "Heavy", desc: "10+ datasets per week" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        readinessData.answers.capacity === option.value
                          ? "bg-primary/10 border-primary"
                          : "bg-background border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="capacity"
                        checked={readinessData.answers.capacity === option.value}
                        onChange={() => updateAnswers({ capacity: option.value })}
                        className="w-4 h-4 mt-0.5 border-border accent-primary"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {role === "buyer" && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Buyer Requirements
            </h3>
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
                    onChange={() => updateAnswers({ primary_requirement: requirement })}
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