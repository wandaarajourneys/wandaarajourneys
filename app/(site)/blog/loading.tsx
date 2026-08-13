import { CardGridSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="py-16">
      <div className="container-page">
        <CardGridSkeleton count={6} />
      </div>
    </div>
  );
}
