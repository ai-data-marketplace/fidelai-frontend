"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export type OnboardingRole = "contributor" | "annotator" | "expert" | "buyer" | null;

export interface ProfileData {
  full_name: string;
  phone_number: string;
  country: string;
  native_language: string;
}

export interface ReadinessData {
  completed: boolean;
  answers: Record<string, unknown>;
  score: number;
}

export interface OnboardingSubmissionState {
  currentStep: number;
  role: OnboardingRole;
  profile: ProfileData;
  role_application: {
    role_applied_for: string;
  };
  application_data: {
    step_2: Record<string, unknown>;
    step_3: {
      readiness_check: {
        answers: Record<string, unknown>;
        score: number;
      } | null;
    };
  };
  profile_picture: File | null;
  documents: File[];
  readinessData: ReadinessData;
  completedSteps: number[];
}

interface OnboardingContextType extends OnboardingSubmissionState {
  personalDetails: ProfileData;
  compliance: Record<string, unknown>;
  setCurrentStep: (step: number) => void;
  setRole: (role: OnboardingRole) => void;
  setProfile: (profile: Partial<ProfileData>) => void;
  setPersonalDetails: (details: Partial<ProfileData>) => void;
  setApplicationStep2: (data: Record<string, unknown>) => void;
  setCompliance: (data: Record<string, unknown>) => void;
  setReadinessData: (data: Partial<ReadinessData>) => void;
  setProfilePicture: (file: File | null) => void;
  addDocument: (file: File) => void;
  removeDocument: (index: number) => void;
  clearDocuments: () => void;
  markStepComplete: (step: number) => void;
  isStepComplete: (step: number) => boolean;
  buildSubmissionFormData: () => FormData;
  resetOnboarding: () => void;
}

const initialState: OnboardingSubmissionState = {
  currentStep: 1,
  role: null,
  profile: {
    full_name: "",
    phone_number: "",
    country: "",
    native_language: "",
  },
  role_application: {
    role_applied_for: "",
  },
  application_data: {
    step_2: {},
    step_3: {
      readiness_check: null,
    },
  },
  profile_picture: null,
  documents: [],
  readinessData: {
    completed: false,
    answers: {},
    score: 0,
  },
  completedSteps: [],
};

type PersistedOnboardingState = Omit<OnboardingSubmissionState, "profile_picture" | "documents">;

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

function isOnboardingRole(value: unknown): value is Exclude<OnboardingRole, null> {
  return value === "contributor" || value === "annotator" || value === "expert" || value === "buyer";
}

function normalizePersistedState(saved: string): OnboardingSubmissionState | null {
  try {
    const parsed = JSON.parse(saved) as Partial<PersistedOnboardingState> & {
      personalDetails?: Partial<{ fullName: string; phone: string; country: string; language: string }>;
      compliance?: Record<string, unknown>;
      readinessData?: Partial<ReadinessData> & { sampleData?: string; labelResult?: string; reviewDecision?: string; datasetRequirement?: string };
      role_application?: { role_applied_for?: string };
    };

    const readinessAnswers = parsed.application_data?.step_3?.readiness_check?.answers ?? parsed.readinessData?.answers ?? {};
    const readinessScoreRaw = parsed.application_data?.step_3?.readiness_check?.score ?? parsed.readinessData?.score ?? 0;
    const readinessScore = typeof readinessScoreRaw === "number" ? readinessScoreRaw : Number(readinessScoreRaw) || 0;

    return {
      ...initialState,
      currentStep: typeof parsed.currentStep === "number" ? parsed.currentStep : initialState.currentStep,
      role: isOnboardingRole(parsed.role) ? parsed.role : null,
      profile: {
        ...initialState.profile,
        full_name: parsed.profile?.full_name ?? parsed.personalDetails?.fullName ?? "",
        phone_number: parsed.profile?.phone_number ?? parsed.personalDetails?.phone ?? "",
        country: parsed.profile?.country ?? parsed.personalDetails?.country ?? "",
        native_language: parsed.profile?.native_language ?? parsed.personalDetails?.language ?? "",
      },
      role_application: {
        role_applied_for: parsed.role_application?.role_applied_for ?? (isOnboardingRole(parsed.role) ? parsed.role : ""),
      },
      application_data: {
        step_2: parsed.application_data?.step_2 ?? parsed.compliance ?? {},
        step_3: {
          readiness_check:
            parsed.application_data?.step_3?.readiness_check ??
            (Object.keys(readinessAnswers).length > 0 || readinessScore > 0
              ? { answers: readinessAnswers, score: readinessScore }
              : null),
        },
      },
      readinessData: {
        completed: Boolean(parsed.readinessData?.completed),
        answers: readinessAnswers,
        score: readinessScore,
      },
      completedSteps: Array.isArray(parsed.completedSteps)
        ? parsed.completedSteps.filter((step): step is number => typeof step === "number")
        : [],
    };
  } catch (error) {
    console.error("Failed to parse onboarding state:", error);
    return null;
  }
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingSubmissionState>(initialState);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("fidelai_onboarding");
    if (saved) {
      const nextState = normalizePersistedState(saved);
      if (nextState) {
        setState(nextState);
      }
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const { profile_picture: _profilePicture, documents: _documents, ...persistedState } = state;
    localStorage.setItem("fidelai_onboarding", JSON.stringify(persistedState));
  }, [state, isMounted]);

  const setCurrentStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const setRole = useCallback((role: OnboardingRole) => {
    setState((prev) => ({
      ...prev,
      role,
      role_application: {
        role_applied_for: role ?? "",
      },
    }));
  }, []);

  const setProfile = useCallback((profile: Partial<ProfileData>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profile },
    }));
  }, []);

  const setPersonalDetails = useCallback((details: Partial<ProfileData>) => {
    setProfile(details);
  }, [setProfile]);

  const setApplicationStep2 = useCallback((data: Record<string, unknown>) => {
    setState((prev) => ({
      ...prev,
      application_data: {
        ...prev.application_data,
        step_2: {
          ...prev.application_data.step_2,
          ...data,
        },
      },
    }));
  }, []);

  const setCompliance = useCallback((data: Record<string, unknown>) => {
    setApplicationStep2(data);
  }, [setApplicationStep2]);

  const setReadinessData = useCallback((data: Partial<ReadinessData>) => {
    setState((prev) => {
      const readinessData = {
        ...prev.readinessData,
        ...data,
      };

      return {
        ...prev,
        readinessData,
        application_data: {
          ...prev.application_data,
          step_3: {
            readiness_check: {
              answers: readinessData.answers,
              score: readinessData.score,
            },
          },
        },
      };
    });
  }, []);

  const setProfilePicture = useCallback((file: File | null) => {
    setState((prev) => ({ ...prev, profile_picture: file }));
  }, []);

  const addDocument = useCallback((file: File) => {
    setState((prev) => ({
      ...prev,
      documents: [...prev.documents, file],
    }));
  }, []);

  const removeDocument = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, currentIndex) => currentIndex !== index),
    }));
  }, []);

  const clearDocuments = useCallback(() => {
    setState((prev) => ({ ...prev, documents: [] }));
  }, []);

  const markStepComplete = useCallback((step: number) => {
    setState((prev) => ({
      ...prev,
      completedSteps: prev.completedSteps.includes(step)
        ? prev.completedSteps
        : [...prev.completedSteps, step],
    }));
  }, []);

  const isStepComplete = useCallback(
    (step: number) => state.completedSteps.includes(step),
    [state.completedSteps]
  );

  const buildSubmissionFormData = useCallback(() => {
    if (!state.role) {
      throw new Error("Select a role before submitting onboarding.");
    }

    const formData = new FormData();
    formData.append("profile", JSON.stringify(state.profile));
    formData.append("role_application", JSON.stringify({ role_applied_for: state.role }));
    formData.append(
      "application_data",
      JSON.stringify({
        step_2: state.application_data.step_2,
        step_3: {
          readiness_check: state.application_data.step_3.readiness_check ?? {
            answers: state.readinessData.answers,
            score: state.readinessData.score,
          },
        },
      })
    );

    if (state.profile_picture) {
      formData.append("profile_picture", state.profile_picture);
    }

    state.documents.forEach((file) => {
      formData.append("documents", file);
    });

    return formData;
  }, [state]);

  const resetOnboarding = useCallback(() => {
    setState(initialState);
    localStorage.removeItem("fidelai_onboarding");
  }, []);

  if (!isMounted) return null;

  return (
    <OnboardingContext.Provider
      value={{
        ...state,
        personalDetails: state.profile,
        compliance: state.application_data.step_2,
        setCurrentStep,
        setRole,
        setProfile,
        setPersonalDetails,
        setApplicationStep2,
        setCompliance,
        setReadinessData,
        setProfilePicture,
        addDocument,
        removeDocument,
        clearDocuments,
        markStepComplete,
        isStepComplete,
        buildSubmissionFormData,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
