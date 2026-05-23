"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { useChangePassword, useDeleteAccount } from '@/lib/hooks';
import { getErrorMessage, getFieldErrors } from '@/lib/utils/error-helper';
import { useAuth } from '@/context/auth-context';

const passwordSchema = z.object({
  current: z.string().min(1, "Required"),
  newPassword: z.string().min(8, "Must be at least 8 characters"),
  confirm: z.string()
}).refine(data => data.newPassword === data.confirm, {
  message: "The passwords don't match",
  path: ["confirm"]
});

const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

export function SecuritySettings() {
  const router = useRouter();
  const { logout } = useAuth();
  const [generalError, setGeneralError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const changePasswordMutation = useChangePassword();
  const deleteAccountMutation = useDeleteAccount();

  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current: "", newPassword: "", confirm: "" },
  });

  const {
    register: registerDelete,
    handleSubmit: handleDeleteSubmit,
    formState: { errors: deleteErrors },
    setError: setDeleteErrorField,
    reset: resetDeleteForm,
  } = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: "" },
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

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteError("");
    resetDeleteForm();
  };

  const onDeleteAccount = (data: DeleteAccountFormValues) => {
    setDeleteError("");
    deleteAccountMutation.mutate(
      { password: data.password },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Account deleted successfully");
          logout();
          router.replace("/login");
        },
        onError: (error) => {
          const fieldErrors = getFieldErrors(error);
          if (fieldErrors.password) {
            setDeleteErrorField("password", { message: fieldErrors.password });
            return;
          }
          setDeleteError(getErrorMessage(error));
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
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="mt-4 px-4 py-2 text-xs font-bold bg-destructive text-white rounded-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-destructive/20 flex items-center gap-2"
          >
            <Trash2 size={14} />
            Delete Permanently
          </button>
        </div>
      </section>

      <Modal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete account permanently"
      >
        <form onSubmit={handleDeleteSubmit(onDeleteAccount)} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. Enter your password to confirm you want to permanently delete your account.
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              {...registerDelete('password')}
              className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
              placeholder="Enter your password"
            />
            {deleteErrors.password && (
              <p className="text-xs text-destructive">{deleteErrors.password.message as string}</p>
            )}
          </div>
          {deleteError && <p className="text-xs text-destructive">{deleteError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeDeleteModal}
              disabled={deleteAccountMutation.isPending}
              className="h-10 px-4 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={deleteAccountMutation.isPending}
              className="h-10 px-4 rounded-lg bg-destructive text-white text-sm font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center"
            >
              {deleteAccountMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Delete Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
