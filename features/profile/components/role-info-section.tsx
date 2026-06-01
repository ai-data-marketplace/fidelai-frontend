"use client";

import { UserRole } from "@/lib/mocks/dashboard";
import { Briefcase, BookOpen, Microscope, Zap, Shield } from "lucide-react";

interface RoleInfoSectionProps {
  role: UserRole;
}

export function RoleInfoSection({ role }: RoleInfoSectionProps) {
  const roleConfig = {
    contributor: {
      icon: Zap,
      title: "Data Contribution Info",
      details: [
        { label: "Primary Type", value: "Text Dataset Contributor" },
        { label: "Verified Corpora", value: "12 Datasets" },
        { label: "Trust Score", value: "98/100" },
      ],
    },
    annotator: {
      icon: Briefcase,
      title: "Annotation Expertise",
      details: [
        { label: "Domains", value: "Linguistics, Politics, Social Media" },
        { label: "Experience", value: "2+ Years" },
        { label: "Accuracy Rate", value: "96.4%" },
      ],
    },
    expert: {
      icon: Microscope,
      title: "Adjudication Credentials",
      details: [
        { label: "Specialization", value: "Amharic Phonetics & Morphology" },
        { label: "Institution", value: "AAU - Department of Linguistics" },
        { label: "Seniority", value: "Senior Adjudicator" },
      ],
    },
    buyer: {
      icon: BookOpen,
      title: "Purchasing Profile",
      details: [
        { label: "Organization", value: "EthioAI Research Lab" },
        { label: "Primary Use", value: "LLM Fine-tuning" },
        { label: "Tier", value: "Enterprise" },
      ],
    },
    admin: {
      icon: Shield,
      title: "Administrative Access",
      details: [
        { label: "Access Level", value: "Super Admin" },
        { label: "Responsible Areas", value: "Platform Oversight, User Audits" },
      ],
    },
  };

  const config = roleConfig[role] || roleConfig.contributor;

  return (
    <div className="bg-card rounded-2xl border p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <config.icon size={20} />
        </div>
        <h3 className="text-lg font-bold">{config.title}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {config.details.map((detail, index) => (
          <div key={index} className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{detail.label}</p>
            <p className="font-semibold text-sm">{detail.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
