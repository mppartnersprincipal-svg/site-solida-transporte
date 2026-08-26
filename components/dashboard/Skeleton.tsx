import { cn } from "@/lib/utils";

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div aria-hidden style={style} className={cn("animate-pulse rounded-xl bg-line/70", className)} />;
}

export function CardSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="rounded-2xl border border-line bg-white">
      <div className="border-b border-line px-5 py-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="mt-2 h-3 w-72" />
      </div>
      <div className="p-5">
        <Skeleton style={{ height }} className="w-full" />
      </div>
    </div>
  );
}

export function KpiSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-line bg-white p-5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-4 h-8 w-20" />
          <Skeleton className="mt-3 h-3 w-24" />
        </div>
      ))}
    </div>
  );
}
