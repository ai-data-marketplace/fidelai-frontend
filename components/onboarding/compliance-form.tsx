"use client";

import { useOnboarding } from "@/context/onboarding-context";
import { ArrowLeft, ArrowRight, ShieldCheck, UploadCloud, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const contributorAgreements = [
  { key: "ownership_confirmed", label: "I confirm I own the data or have permission to submit it." },
  { key: "no_copyright_content", label: "The dataset contains no copyrighted or restricted content." },
  { key: "no_pii", label: "The dataset contains no personal or sensitive PII." },
  { key: "liability_acceptance", label: "I accept responsibility for the content I submit." },
  { key: "dataset_usage_consent", label: "I consent to the platform using the dataset as needed." },
];

export function ComplianceForm() {
  const {
    role,
    compliance,
    documents,
    setCompliance,
    setCurrentStep,
    markStepComplete,
    addDocument,
    removeDocument,
    clearDocuments,
  } = useOnboarding();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!role) {
      router.push("/onboarding/step-1");
    }
  }, [role, router]);

  const updateCompliance = (data: Record<string, unknown>) => {
    setCompliance(data);
  };

  const handleDocumentSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    selectedFiles.forEach((file) => addDocument(file));
    event.target.value = "";
  };

  const handleNext = () => {
    if (!role) {
      router.push("/onboarding/step-1");
      return;
    }

    setError("");

    if (role === "contributor") {
      const nextAgreements = {
        ownership_confirmed: Boolean(compliance.agreements?.ownership_confirmed),
        no_copyright_content: Boolean(compliance.agreements?.no_copyright_content),
        no_pii: Boolean(compliance.agreements?.no_pii),
        liability_acceptance: Boolean(compliance.agreements?.liability_acceptance),
        dataset_usage_consent: Boolean(compliance.agreements?.dataset_usage_consent),
      };

      if (!Object.values(nextAgreements).every(Boolean)) {
        setError("You must confirm all contributor agreements to continue.");
        return;
      }

      updateCompliance({ agreements: nextAgreements });
    }

    if (role === "annotator") {
      const amharicQuizScore = Number(compliance.amharic_quiz_score ?? 0);
      const annotationTestScore = Number(compliance.annotation_test_score ?? 0);
      const availabilityHoursPerWeek = Number(compliance.availability_hours_per_week ?? 0);
      const preferredDomains = typeof compliance.preferred_domains === "string"
        ? compliance.preferred_domains.split(",").map((item) => item.trim()).filter(Boolean)
        : Array.isArray(compliance.preferred_domains)
          ? compliance.preferred_domains.filter(Boolean)
          : [];

      if (!amharicQuizScore || !annotationTestScore || !availabilityHoursPerWeek || preferredDomains.length === 0) {
        setError("Complete all annotator fields before continuing.");
        return;
      }

      updateCompliance({
        amharic_quiz_score: amharicQuizScore,
        annotation_test_score: annotationTestScore,
        availability_hours_per_week: availabilityHoursPerWeek,
        preferred_domains: preferredDomains,
      });
    }

    if (role === "expert") {
      const institution = String(compliance.institution ?? "").trim();
      const yearsOfExperience = Number(compliance.years_of_experience ?? 0);
      const domainSpecialization = String(compliance.domain_specialization ?? "").trim();

      if (!institution || !yearsOfExperience || !domainSpecialization) {
        setError("Institution, years of experience, and domain specialization are required.");
        return;
      }

      if (documents.length === 0) {
        setError("Expert applications require at least one supporting document.");
        return;
      }

      updateCompliance({
        institution,
        years_of_experience: yearsOfExperience,
        domain_specialization: domainSpecialization,
      });
    }

    if (role === "buyer") {
      const industry = String(compliance.industry ?? "").trim();
      const useCase = String(compliance.use_case ?? "").trim();

      if (!industry || !useCase) {
        setError("Industry and use case are required for buyer applications.");
        return;
      }

      updateCompliance({
        industry,
        use_case: useCase,
      });
    }

    markStepComplete(2);
    setCurrentStep(3);
    router.push("/onboarding/step-3");
  };

  const handleBack = () => {
    setCurrentStep(1);
    router.push("/onboarding/step-1");
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
        <h2 className="text-2xl font-bold tracking-tight mb-2">Role Qualification and Compliance</h2>
        <p className="text-muted-foreground">Provide the role-specific data needed for your onboarding application.</p>
      </div>

      <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 space-y-8">
        {role === "contributor" && (
          <div className="space-y-4">
            <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 p-4 rounded-lg text-sm">
              <strong className="block mb-1">Contributor agreements</strong>
              Confirm the content ownership and data-use rules required for uploads.
            </div>

            <div className="space-y-3">
              {contributorAgreements.map(({ key, label }) => (
                <label key={key} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={Boolean((compliance.agreements as Record<string, boolean> | undefined)?.[key])}
                    onChange={(event) => {
                      setCompliance({
                        agreements: {
                          ...(compliance.agreements as Record<string, boolean> | undefined),
                          [key]: event.target.checked,
                        },
                      });
                      setError("");
                    }}
                    className="mt-1 h-4 w-4 rounded border-border text-orange-600 focus:ring-orange-500 shrink-0"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {role === "annotator" && (
          <div className="space-y-6">
            <div className="bg-background border border-border rounded-xl p-4 text-sm text-muted-foreground">
              Enter the scores and preferences required for annotator screening.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amharic Quiz Score</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={String(compliance.amharic_quiz_score ?? "")}
                  onChange={(event) => {
                    setCompliance({ amharic_quiz_score: event.target.value === "" ? "" : Number(event.target.value) });
                    setError("");
                  }}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  placeholder="88"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Annotation Test Score</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={String(compliance.annotation_test_score ?? "")}
                  onChange={(event) => {
                    setCompliance({ annotation_test_score: event.target.value === "" ? "" : Number(event.target.value) });
                    setError("");
                  }}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  placeholder="91"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Availability Hours / Week</label>
                <input
                  type="number"
                  min={1}
                  value={String(compliance.availability_hours_per_week ?? "")}
                  onChange={(event) => {
                    setCompliance({ availability_hours_per_week: event.target.value === "" ? "" : Number(event.target.value) });
                    setError("");
                  }}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  placeholder="20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Domains</label>
                <input
                  type="text"
                  value={Array.isArray(compliance.preferred_domains) ? compliance.preferred_domains.join(", ") : String(compliance.preferred_domains ?? "")}
                  onChange={(event) => {
                    setCompliance({ preferred_domains: event.target.value });
                    setError("");
                  }}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  placeholder="health, agriculture"
                />
              </div>
            </div>
          </div>
        )}

        {role === "expert" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Supporting Documents</label>
              <div className="rounded-xl border border-dashed border-border/70 bg-background p-5">
                <label className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center">
                  <UploadCloud className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="font-semibold text-foreground">Upload certification or proof documents</p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, or image files. At least one file is required.</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleDocumentSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {documents.length > 0 && (
                <div className="space-y-2">
                  {documents.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm">
                      <span className="truncate pr-3">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={clearDocuments}
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                    Clear all documents
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Institution</label>
                <input
                  type="text"
                  placeholder="Addis Ababa University"
                  value={String(compliance.institution ?? "")}
                  onChange={(event) => {
                    setCompliance({ institution: event.target.value });
                    setError("");
                  }}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Experience</label>
                <input
                  type="number"
                  min={0}
                  value={String(compliance.years_of_experience ?? "")}
                  onChange={(event) => {
                    setCompliance({ years_of_experience: event.target.value === "" ? "" : Number(event.target.value) });
                    setError("");
                  }}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  placeholder="7"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Domain Specialization</label>
                <input
                  type="text"
                  placeholder="NLP"
                  value={String(compliance.domain_specialization ?? "")}
                  onChange={(event) => {
                    setCompliance({ domain_specialization: event.target.value });
                    setError("");
                  }}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                />
              </div>
            </div>
          </div>
        )}

        {role === "buyer" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <input
                  type="text"
                  placeholder="fintech"
                  value={String(compliance.industry ?? "")}
                  onChange={(event) => {
                    setCompliance({ industry: event.target.value });
                    setError("");
                  }}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Use Case</label>
                <input
                  type="text"
                  placeholder="Amharic customer support intent dataset"
                  value={String(compliance.use_case ?? "")}
                  onChange={(event) => {
                    setCompliance({ use_case: event.target.value });
                    setError("");
                  }}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl flex items-start gap-3 border border-destructive/20 shadow-sm animate-in fade-in slide-in-from-top-1">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 h-11 px-6 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 h-12 px-8 rounded-xl brand-gradient-btn font-bold text-white shadow-lg brand-shadow brand-shadow-hover transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}