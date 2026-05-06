"use client";

import { useOnboarding, OnboardingRole } from "@/context/onboarding-context";
import { Upload, PenTool, ShieldCheck, ShoppingBag, ArrowRight, ImagePlus, X } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const roles: { 
  id: OnboardingRole; 
  title: string; 
  desc: string; 
  icon: any; 
  color: string; 
  dotColor: string;
  border: string; 
  bg: string; 
  activeBg: string 
}[] = [
  { 
    id: "contributor", 
    title: "Contributor", 
    desc: "Upload Amharic data & earn", 
    icon: Upload,
    color: "text-slate-600 dark:text-slate-400",
    dotColor: "bg-slate-600 dark:bg-slate-400",
    border: "border-slate-300 dark:border-slate-700",
    bg: "bg-slate-500/5",
    activeBg: "bg-slate-500/20"
  },
  { 
    id: "annotator", 
    title: "Annotator", 
    desc: "Label data & get paid", 
    icon: PenTool,
    color: "text-blue-500",
    dotColor: "bg-blue-500",
    border: "border-blue-500",
    bg: "bg-blue-500/5",
    activeBg: "bg-blue-500/20"
  },
  { 
    id: "expert", 
    title: "Expert", 
    desc: "Review & ensure quality", 
    icon: ShieldCheck,
    color: "text-emerald-500",
    dotColor: "bg-emerald-500",
    border: "border-emerald-500",
    bg: "bg-emerald-500/5",
    activeBg: "bg-emerald-500/20"
  },
  { 
    id: "buyer", 
    title: "Buyer", 
    desc: "Purchase top-tier datasets", 
    icon: ShoppingBag,
    color: "text-amber-600",
    dotColor: "bg-amber-600",
    border: "border-amber-600",
    bg: "bg-amber-600/5",
    activeBg: "bg-amber-600/20"
  },
];

export function PersonalInfoForm() {
  const { role, setRole, profile, setProfile, profile_picture, setProfilePicture, setCurrentStep, markStepComplete } = useOnboarding();
  const router = useRouter();
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!profile_picture) {
      setProfilePreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(profile_picture);
    setProfilePreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [profile_picture]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!profile.country) newErrors.country = "Country is required";
    if (!profile.native_language) newErrors.nativeLanguage = "Native language is required";
    if (!role) newErrors.role = "Please select a role";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      markStepComplete(1);
      setCurrentStep(2);
      router.push("/onboarding/step-2");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Profile & Role</h2>
        <p className="text-muted-foreground">Share the profile details required to start your onboarding application.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number (Optional)</label>
          <input 
            type="tel" 
            value={profile.phone_number || ""}
            onChange={(e) => setProfile({ phone_number: e.target.value })}
            placeholder="+251 911 234 567"
            className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all hover:border-border"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Country / Region</label>
          <div className="relative">
            <select 
              value={profile.country || ""}
              onChange={(e) => setProfile({ country: e.target.value })}
              className="flex h-11 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all hover:border-border appearance-none w-full"
            >
              <option value="" disabled className="dark:bg-[#0f172a] dark:text-white">Select your country</option>
              <option value="Ethiopia" className="dark:bg-[#0f172a] dark:text-white">Ethiopia</option>
              <option value="United States" className="dark:bg-[#0f172a] dark:text-white">United States</option>
              <option value="United Kingdom" className="dark:bg-[#0f172a] dark:text-white">United Kingdom</option>
              <option value="Kenya" className="dark:bg-[#0f172a] dark:text-white">Kenya</option>
              <option value="Other" className="dark:bg-[#0f172a] dark:text-white">Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Native Language</label>
          <div className="relative">
            <select 
              value={profile.native_language || ""}
              onChange={(e) => setProfile({ native_language: e.target.value })}
              className="flex h-11 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all hover:border-border appearance-none w-full"
            >
              <option value="" disabled className="dark:bg-[#0f172a] dark:text-white">Select primary language</option>
              <option value="Amharic" className="dark:bg-[#0f172a] dark:text-white">Amharic</option>
              <option value="Oromo" className="dark:bg-[#0f172a] dark:text-white">Oromiffa</option>
              <option value="Tigrinya" className="dark:bg-[#0f172a] dark:text-white">Tigrinya</option>
              <option value="English" className="dark:bg-[#0f172a] dark:text-white">English</option>
              <option value="Other" className="dark:bg-[#0f172a] dark:text-white">Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          {errors.nativeLanguage && <p className="text-xs text-destructive">{errors.nativeLanguage}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Profile Picture (Optional)</label>
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-border/70 bg-muted/20 p-4">
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-background border border-border/60 shrink-0">
              {profilePreviewUrl ? (
                <img
                  src={profilePreviewUrl}
                  alt="Selected profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlus className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-600"
              />
              <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, JPEG, or WEBP. Optional for now.</p>
            </div>
            {profile_picture && (
              <button
                type="button"
                onClick={() => setProfilePicture(null)}
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
          {profile_picture && <p className="text-xs text-emerald-600">Selected: {profile_picture.name}</p>}
        </div>
      </div>

      <div className="pt-4 border-t border-border/50">
        <label className="text-base font-semibold mb-4 block">Select your primary role</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roles.map((r) => (
            <button
              type="button"
              key={r.id}
              onClick={() => {
                setRole(r.id);
                setErrors({ ...errors, role: "" });
              }}
              className={`flex items-start gap-4 p-5 rounded-2xl transition-all relative overflow-hidden ${
                role === r.id 
                  ? `${r.activeBg} shadow-lg scale-[1.02]` 
                  : "bg-background hover:bg-muted/30"
              }`}
            >
              {role === r.id && (
                <div className={`absolute top-0 right-0 w-8 h-8 ${r.activeBg} rounded-bl-xl flex items-center justify-center opacity-40`}>
                   <div className={`w-2 h-2 rounded-full ${r.dotColor}`} />
                </div>
              )}
              <div className={`p-3 rounded-xl ${role === r.id ? "bg-background shadow-sm" : r.bg} shrink-0 transition-all`}>
                <r.icon className={`w-6 h-6 ${r.color}`} />
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-base mb-1 transition-colors ${role === r.id ? "text-foreground" : "text-foreground/80"}`}>{r.title}</h4>
                <p className={`text-xs transition-colors ${role === r.id ? "text-muted-foreground" : "text-muted-foreground/70"}`}>{r.desc}</p>
              </div>
            </button>
          ))}
        </div>
        {errors.role && <p className="text-xs text-destructive mt-2">{errors.role}</p>}
      </div>

      <div className="flex justify-end pt-6">
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
