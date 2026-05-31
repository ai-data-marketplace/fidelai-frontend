"use client";

export function SettingsForm() {
  return (
    <form className="mt-6 space-y-4">
      <div className="space-y-1">
        <label htmlFor="settings-name" className="text-sm font-medium">
          Display Name
        </label>
        <input
          id="settings-name"
          type="text"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="settings-bio" className="text-sm font-medium">
          Bio
        </label>
        <textarea
          id="settings-bio"
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Save Changes
      </button>
    </form>
  );
}
