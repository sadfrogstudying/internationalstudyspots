import { Skeleton } from "../ui/skeleton";

export default function SkeletonGridItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      <Skeleton className="aspect-square w-full sm:aspect-[3/4]" />
      <div>
        <Skeleton className="h-6 w-1/3 border border-white" />
        <Skeleton className="h-6 w-3/4 border border-white" />
        <Skeleton className="h-6 w-1/4 border border-white" />
        <div className="flex">
          <Skeleton className="h-6 w-6 border border-white" />
          <Skeleton className="h-6 w-6 border border-white" />
        </div>
      </div>
    </div>
  );
}
