"use client";

import { useState, useTransition } from "react";
import { Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

export function ConfirmDeleteButton({
  itemLabel,
  onDelete,
  onDeleted,
}: {
  itemLabel: string;
  onDelete: () => Promise<{ success: boolean; error?: string }>;
  onDeleted?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function confirmDelete() {
    startTransition(async () => {
      const result = await onDelete();
      if (!result.success) {
        toast.error(result.error || "Delete failed.");
        return;
      }
      toast.success(`Deleted ${itemLabel}.`);
      setOpen(false);
      onDeleted?.();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full p-1.5 text-teal-700/50 hover:bg-terracotta-50 hover:text-terracotta-600 transition-colors"
        aria-label={`Delete ${itemLabel}`}
      >
        <Trash2 size={16} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <h2 className="font-display text-lg text-teal-800">Delete {itemLabel}?</h2>
              <button onClick={() => setOpen(false)} className="text-teal-700/50 hover:text-teal-800" aria-label="Cancel">
                <X size={18} />
              </button>
            </div>
            <p className="mt-2 text-sm text-teal-700/70">
              This can&apos;t be undone. {itemLabel} will be permanently removed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-teal-700/20 px-4 py-2 text-sm font-semibold text-teal-800 hover:border-teal-700/40 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isPending}
                className="rounded-full bg-terracotta-500 px-4 py-2 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors disabled:opacity-60"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
