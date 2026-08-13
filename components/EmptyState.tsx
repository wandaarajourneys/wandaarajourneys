import { Compass } from "lucide-react";

export function EmptyState({
  title = "Nothing here yet",
  description = "Try adjusting your filters or check back soon.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/60 border border-dashed border-teal-700/20 py-16 px-6 text-center">
      <Compass className="text-teal-700/30" size={36} aria-hidden="true" />
      <h3 className="font-display text-xl text-teal-800">{title}</h3>
      <p className="text-sm text-teal-700/60 max-w-sm">{description}</p>
    </div>
  );
}
