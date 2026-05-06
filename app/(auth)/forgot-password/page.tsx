"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useForgotPassword } from "@/lib/hooks";
import { getErrorMessage } from "@/lib/utils/error-helper";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [successMessage, setSuccessMessage] = useState("");
  const [generalError, setGeneralError] = useState("");
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setGeneralError("");
    setSuccessMessage("");
    forgotPasswordMutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          setSuccessMessage("If an account exists for this email, a reset link has been sent.");
        },
        onError: (error) => setGeneralError(getErrorMessage(error)),
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card/60 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-bold tracking-tight">Forgot password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send a reset link.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          {generalError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {generalError}
            </div>
          )}
          {successMessage && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 flex gap-2 items-start">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={`flex h-11 w-full rounded-lg border bg-background px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${errors.email ? "border-destructive focus-visible:ring-destructive" : "border-input hover:border-border"}`}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={forgotPasswordMutation.isPending}
            className="w-full flex h-12 items-center justify-center rounded-xl brand-gradient-btn px-8 text-sm font-bold text-white shadow-lg brand-shadow transition-all hover:-translate-y-0.5 disabled:opacity-50"
          >
            {forgotPasswordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
            Send reset link
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Remembered it? <Link href="/login" className="text-orange-600 hover:text-orange-500 font-medium">Back to login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}