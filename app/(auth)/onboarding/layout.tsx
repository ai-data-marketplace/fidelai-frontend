"use client";

import { OnboardingProvider } from "@/context/onboarding-context";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { motion } from "framer-motion";
import Link from "next/link";
import { Database } from "lucide-react";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen py-4 lg:py-8 w-full flex items-center justify-center p-4 bg-background/50 relative">
        <div className="w-full max-w-5xl bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row relative z-10">
          
          <div className="lg:w-1/3 bg-muted/30 border-b lg:border-b-0 lg:border-r border-border/50 p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-12 group w-fit">
                <div className="w-9 h-9 rounded-xl brand-gradient-logo flex items-center justify-center shadow-lg brand-shadow brand-shadow-hover transition-shadow">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  <span className="brand-text">Fidel AI</span>
                </span>
              </Link>
              
              <StepIndicator />
            </div>
            

          </div>

          <div className="lg:w-2/3 p-8 lg:p-16 flex flex-col justify-center">
            {children}
          </div>
        </div>
      </div>
    </OnboardingProvider>
  );
}
