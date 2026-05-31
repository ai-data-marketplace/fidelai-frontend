"use client";

export function UploadForm() {
  return (
    <form className="mt-6 space-y-4">
      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium">
          Dataset Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Enter dataset title"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Describe the dataset..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <select
          id="category"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Select category</option>
          <option value="text">Text</option>
          <option value="audio">Audio</option>
          <option value="image">Image</option>
          <option value="translation">Translation</option>
        </select>
      </div>
      <div className="space-y-1">
        <label htmlFor="file" className="text-sm font-medium">
          File
        </label>
        <input
          id="file"
          type="file"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Upload Dataset
      </button>
    </form>
  );
}
