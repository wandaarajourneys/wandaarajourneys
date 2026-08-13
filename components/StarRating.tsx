import { Star, StarHalf } from "lucide-react";

export function StarRating({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${rating} out of 5`}>
      <div className="flex text-terracotta-500" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) return <Star key={i} size={16} fill="currentColor" strokeWidth={0} />;
          if (i === full && hasHalf)
            return <StarHalf key={i} size={16} fill="currentColor" strokeWidth={0} />;
          return <Star key={i} size={16} className="text-sand-300" strokeWidth={1.5} />;
        })}
      </div>
      <span className="text-sm text-teal-700/70">
        {rating.toFixed(1)}
        {reviewCount ? ` (${reviewCount})` : ""}
      </span>
    </div>
  );
}
