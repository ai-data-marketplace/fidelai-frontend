import {  Mail } from "lucide-react";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { Suspense } from "react";
export default function VerifyEmailPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 md:p-10 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 text-orange-600">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Check your email</h2>
          <p className="text-sm text-muted-foreground mb-8">
            We've sent a 6-digit verification code to your email address. Please enter it below.
          </p>
 <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
        </div>
      </div>
    </div>
  );
}
