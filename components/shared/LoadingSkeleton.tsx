import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function LoadingSkeleton({ className }: { className?: string } = {}) {
  if (className) {
    return <Skeleton className={cn(className)} />;
  }

  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-[250px]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 border rounded-xl space-y-3">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        ))}
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 border rounded-xl space-y-3 bg-card animate-pulse">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <div className="pt-2">
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
