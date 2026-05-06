"use client";

import { useState, use } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useResetPassword } from "@/lib/hooks";
import { getErrorMessage, getFieldErrors } from "@/lib/utils/error-helper";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one digit.")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage({ params }: { params: Promise<{ uid: string; token: string }> }) {
  const { uid, token } = use(params);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setGeneralError("");
    resetPasswordMutation.mutate(
      { uid, token, new_password: data.newPassword },
      {
        onSuccess: () => {
          setSuccess(true);
          window.setTimeout(() => router.push("/login"), 1800);
        },
        onError: (error) => {
          const fieldErrors = getFieldErrors(error);
          if (Object.keys(fieldErrors).length > 0) {
            Object.entries(fieldErrors).forEach(([field, message]) => {
              setError(field as keyof ResetPasswordFormValues, { message });
            });
          } else {
            setGeneralError(getErrorMessage(error));
          }
        },
      }
    );
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card/60 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Password reset</h1>
          <p className="mt-3 text-sm text-muted-foreground">Your password was updated successfully.</p>
          <Link href="/login" className="mt-6 inline-flex h-11 items-center justify-center rounded-xl brand-gradient-btn px-6 text-sm font-bold text-white">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card/60 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-bold tracking-tight">Create new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter a strong password to finish resetting your account.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          {generalError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {generalError}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium">New password</label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                {...register("newPassword")}
                className={`flex h-11 w-full rounded-lg border bg-background px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-10 ${errors.newPassword ? "border-destructive focus-visible:ring-destructive" : "border-input hover:border-border"}`}
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className={`flex h-11 w-full rounded-lg border bg-background px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : "border-input hover:border-border"}`}
            />
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full flex h-12 items-center justify-center rounded-xl brand-gradient-btn px-8 text-sm font-bold text-white shadow-lg brand-shadow transition-all hover:-translate-y-0.5 disabled:opacity-50"
          >
            {resetPasswordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Reset password
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Remembered it? <Link href="/login" className="text-orange-600 hover:text-orange-500 font-medium">Back to login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}