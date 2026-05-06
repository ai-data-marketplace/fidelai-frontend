"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResendCode, useVerifyEmail } from "@/lib/hooks";
import { getErrorMessage } from "@/lib/utils/error-helper";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendCode();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6).replace(/[^0-9]/g, "");
    if (!pastedData) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);
    
    const nextFocusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6 || !email) return;

    setGeneralError("");
    verifyMutation.mutate(
      { email, code: fullCode },
      {
        onSuccess: (data) => {
          setIsSuccess(true);
          const normalizedRole = (data.user.role || "").toLowerCase();
          const targetRoute = normalizedRole === "unknown" ? "/onboarding" : normalizedRole ? `/${normalizedRole}` : "/dashboard/profile";
          window.setTimeout(() => router.push(targetRoute), 1200);
        },
        onError: (error) => setGeneralError(getErrorMessage(error)),
      }
    );
  };

  const handleResend = () => {
    if (!email || cooldown > 0) return;
    setGeneralError("");
    setResendMessage("");
    resendMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setResendMessage("Verification code sent again.");
          setCooldown(60);
        },
        onError: (error) => setGeneralError(getErrorMessage(error)),
      }
    );
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
          className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-500"
        >
          <CheckCircle2 className="w-8 h-8" />
        </motion.div>
        <h3 className="text-xl font-bold mb-2">Email Verified!</h3>
        <p className="text-sm text-muted-foreground">
          Redirecting you to complete your profile...
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 mt-6">
      {generalError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {generalError}
        </div>
      )}
      {resendMessage && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
          {resendMessage}
        </div>
      )}

      <div className="flex justify-between gap-2 max-w-xs mx-auto">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-14 text-center text-xl font-bold rounded-lg border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={verifyMutation.isPending || code.join("").length !== 6 || !email}
        className="w-full flex h-12 items-center justify-center rounded-xl brand-gradient-btn px-8 text-sm font-bold text-white shadow-lg brand-shadow brand-shadow-hover transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
      >
        {verifyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Verify Email
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Didn't receive the code?{" "}
        <button type="button" onClick={handleResend} disabled={!email || cooldown > 0 || resendMutation.isPending} className="font-medium text-orange-600 hover:text-orange-500 hover:underline transition-colors disabled:opacity-50 disabled:no-underline">
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
        </button>
      </p>
    </form>
  );
}
