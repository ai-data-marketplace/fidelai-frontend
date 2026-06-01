"use client";

import { useOnboarding } from "@/context/onboarding-context";
import { Button, Select } from "@/components/ui";
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

const domainOptions = [
  "General",
  "Health",
  "Education",
  "Law",
  "Finance",
  "Politics",
  "Religion",
];

function DomainDropdownPicker({
  label,
  value,
  onChange,
  helperText,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  helperText: string;
}) {
  const [selectedDomain, setSelectedDomain] = useState(value[0] ?? domainOptions[0]);

  useEffect(() => {
    if (!selectedDomain || !domainOptions.includes(selectedDomain)) {
      setSelectedDomain(value[0] ?? domainOptions[0]);
    }
  }, [selectedDomain, value]);

  const addSelectedDomain = () => {
    if (!selectedDomain) return;
    if (value.includes(selectedDomain)) return;
    onChange([...value, selectedDomain]);
  };

  const removeDomain = (domain: string) => {
    onChange(value.filter((item) => item !== domain));
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Select value={selectedDomain} onChange={(event) => setSelectedDomain(event.target.value)} className="h-11">
            {domainOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        <Button type="button" variant="outline" onClick={addSelectedDomain} className="h-11 sm:w-auto">
          Add domain
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{helperText}</p>

      <div className="flex flex-wrap gap-2">
        {value.length > 0 ? (
          value.map((domain) => (
            <span key={domain} className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium">
              {domain}
              <button
                type="button"
                onClick={() => removeDomain(domain)}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
                aria-label={`Remove ${domain}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">No domains selected yet.</p>
        )}
      </div>
    </div>
  );
}

const amharicQuizQuestions = [
  {
    question: "What does the word «ሰላም» mean?",
    choices: ["Hello", "Goodbye", "Thank you"],
    correctIndex: 0,
  },
  {
    question: "What is the sentiment of «እጅግ ደስ ብሎኛል»?",
    choices: ["Negative", "Neutral", "Positive"],
    correctIndex: 2,
  },
  {
    question: "Is «ወንድ» a gendered noun?",
    choices: ["Yes", "No"],
    correctIndex: 0,
  },
];

const annotationQuizQuestions = [
  {
    question: "What is the intent of the phrase «እባክህ መረጃውን ላክልኝ»?",
    choices: ["Request", "Statement", "Command"],
    correctIndex: 0,
  },
  {
    question: "Is this content safe or unsafe? «ይህን ዘር አሁን ማጥፋት አለብን»",
    choices: ["Safe", "Unsafe content"],
    correctIndex: 1,
  },
];

function scoreQuiz(answers: Array<number | null>, questions: { correctIndex: number }[]) {
  const answeredQuestions = answers.filter((answer) => answer !== null).length;
  if (answeredQuestions !== questions.length) {
    return null;
  }

  const correctAnswers = answers.reduce<number>((count, answer, index) => {
    return count + (answer === questions[index].correctIndex ? 1 : 0);
  }, 0);

  return Math.round((correctAnswers / questions.length) * 100);
}

function QuizCard({
  title,
  questions,
  answers,
  onChange,
}: {
  title: string;
  questions: { question: string; choices: string[] }[];
  answers: Array<number | null>;
  onChange: (nextAnswers: Array<number | null>) => void;
}) {
  const [index, setIndex] = useState(0);

  return (
    <div className="p-4 rounded-lg border border-border bg-background space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground">{index + 1} / {questions.length}</div>
        </div>
        <div className="text-xs text-muted-foreground">
          {answers.filter((answer) => answer !== null).length} / {questions.length} answered
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium leading-relaxed">{questions[index].question}</div>
        <div className="grid grid-cols-1 gap-2">
          {questions[index].choices.map((choice, choiceIndex) => {
            const selected = answers[index] === choiceIndex;
            return (
              <button
                key={choice}
                type="button"
                onClick={() => {
                  const nextAnswers = [...answers];
                  nextAnswers[index] = choiceIndex;
                  onChange(nextAnswers);
                }}
                className={`p-3 rounded-md text-sm text-left border transition-colors ${selected ? "bg-primary/10 border-primary text-foreground" : "bg-background border-border hover:border-orange-500/40"}`}
              >
                {choice}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIndex((currentIndex) => Math.max(0, currentIndex - 1))}
          disabled={index === 0}
          className="px-3 py-1.5 rounded-md border text-sm font-medium disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setIndex((currentIndex) => Math.min(questions.length - 1, currentIndex + 1))}
          disabled={index >= questions.length - 1}
          className="px-3 py-1.5 rounded-md border text-sm font-medium disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function AnnotatorAmharicQuiz({
  answers,
  onChange,
}: {
  answers: Array<number | null>;
  onChange: (nextAnswers: Array<number | null>) => void;
}) {
  return <QuizCard title="Amharic Quiz" questions={amharicQuizQuestions} answers={answers} onChange={onChange} />;
}

function AnnotatorAnnotationTest({
  answers,
  onChange,
}: {
  answers: Array<number | null>;
  onChange: (nextAnswers: Array<number | null>) => void;
}) {
  return <QuizCard title="Annotation Test" questions={annotationQuizQuestions} answers={answers} onChange={onChange} />;
}

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
  const [amharicQuizAnswers, setAmharicQuizAnswers] = useState<Array<number | null>>(() => Array(amharicQuizQuestions.length).fill(null));
  const [annotationQuizAnswers, setAnnotationQuizAnswers] = useState<Array<number | null>>(() => Array(annotationQuizQuestions.length).fill(null));

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
      const agreements = (compliance.agreements as Record<string, boolean> | undefined) ?? {};
      const nextAgreements = {
        ownership_confirmed: Boolean(agreements.ownership_confirmed),
        no_copyright_content: Boolean(agreements.no_copyright_content),
        no_pii: Boolean(agreements.no_pii),
        liability_acceptance: Boolean(agreements.liability_acceptance),
        dataset_usage_consent: Boolean(agreements.dataset_usage_consent),
      };

      if (!Object.values(nextAgreements).every(Boolean)) {
        setError("You must confirm all contributor agreements to continue.");
        return;
      }

      updateCompliance({ agreements: nextAgreements });
    }

    if (role === "annotator") {
      const amharicQuizScore = scoreQuiz(amharicQuizAnswers, amharicQuizQuestions);
      const annotationTestScore = scoreQuiz(annotationQuizAnswers, annotationQuizQuestions);
      const availabilityHoursPerWeek = Number(compliance.availability_hours_per_week ?? 0);
      const preferredDomains = Array.isArray(compliance.preferred_domains)
        ? compliance.preferred_domains.filter(Boolean)
        : [];

      if (amharicQuizScore === null || annotationTestScore === null) {
        setError("Please answer every quiz question before continuing.");
        return;
      }

      if (!availabilityHoursPerWeek || preferredDomains.length === 0) {
        setError("Complete the annotator profile fields before continuing.");
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
      const domainSpecialization = Array.isArray(compliance.domain_specialization)
        ? compliance.domain_specialization.filter(Boolean)
        : [];

      if (!institution || !yearsOfExperience || domainSpecialization.length === 0) {
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
              Complete both quizzes below. All questions must be answered before you can continue.
            </div>

            <div className="grid grid-cols-1 gap-4">
              <AnnotatorAmharicQuiz answers={amharicQuizAnswers} onChange={setAmharicQuizAnswers} />

              <AnnotatorAnnotationTest answers={annotationQuizAnswers} onChange={setAnnotationQuizAnswers} />

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
                <DomainDropdownPicker
                  label="Preferred Domains"
                  value={Array.isArray(compliance.preferred_domains) ? compliance.preferred_domains : []}
                  onChange={(selectedDomains) => {
                    setCompliance({ preferred_domains: selectedDomains });
                    setError("");
                  }}
                  helperText="Pick a domain from the dropdown, then add it to your selected list."
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
                <DomainDropdownPicker
                  label="Domain Specialization"
                  value={Array.isArray(compliance.domain_specialization) ? compliance.domain_specialization : []}
                  onChange={(selectedDomains) => {
                    setCompliance({ domain_specialization: selectedDomains });
                    setError("");
                  }}
                  helperText=""
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