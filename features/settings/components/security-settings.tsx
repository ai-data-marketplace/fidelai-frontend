"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { useChangePassword } from '@/lib/hooks';
import { getErrorMessage, getFieldErrors } from '@/lib/utils/error-helper';

const passwordSchema = z.object({
  current: z.string().min(1, "Required"),
  newPassword: z.string().min(8, "Must be at least 8 characters"),
  confirm: z.string()
}).refine(data => data.newPassword === data.confirm, {
  message: "The passwords don't match",
  path: ["confirm"]
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function SecuritySettings() {
  const [generalError, setGeneralError] = useState("");
  const changePasswordMutation = useChangePassword();
  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current: "", newPassword: "", confirm: "" },
  });

  const onSubmit = (data: PasswordFormValues) => {
    setGeneralError("");
    changePasswordMutation.mutate(
      {
        current_password: data.current,
        new_password: data.newPassword,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Password updated successfully");
          reset();
        },
        onError: (error) => {
          const fieldErrors = getFieldErrors(error);
          if (fieldErrors.password) {
            setError("newPassword", { message: fieldErrors.password });
          }
          if (fieldErrors.current) {
            setError("current", { message: fieldErrors.current });
          }
          if (Object.keys(fieldErrors).length === 0) {
            setGeneralError(getErrorMessage(error));
          }
        },
      }
    );
  };

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div className="pb-4 border-b">
          <h3 className="text-lg font-bold">Change Password</h3>
          <p className="text-sm text-muted-foreground">Keep your account secure by updating your password regularly.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <input type="password" {...register('current')} className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" />
            {errors.current && <p className="text-xs text-destructive">{errors.current.message as string}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <input type="password" {...register('newPassword')} className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" />
            {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message as string}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <input type="password" {...register('confirm')} className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" />
            {errors.confirm && <p className="text-xs text-destructive">{errors.confirm.message as string}</p>}
          </div>
          {generalError && <p className="text-xs text-destructive">{generalError}</p>}
          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="h-10 px-6 rounded-lg bg-primary text-white font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center"
          >
            {changePasswordMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Update Password
          </button>
        </form>
      </section>

      <section className="bg-destructive/5 rounded-2xl border border-destructive/20 p-8 space-y-6">
        <div className="flex items-center gap-3 text-destructive">
          <AlertTriangle size={20} />
          <h3 className="text-lg font-bold">Danger Zone</h3>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-bold text-destructive">Delete Account</h4>
          <p className="text-xs text-muted-foreground">Permanently remove your account and all associated data. This action is irreversible.</p>
          <button className="mt-4 px-4 py-2 text-xs font-bold bg-destructive text-white rounded-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-destructive/20 flex items-center gap-2">
            <Trash2 size={14} />
            Delete Permanently
          </button>
        </div>
      </section>
    </div>
  );
}
