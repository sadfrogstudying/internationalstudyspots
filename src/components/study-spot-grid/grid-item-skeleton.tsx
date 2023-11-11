import { Skeleton, SkeletonText } from "../ui/skeleton";

export default function SkeletonGridItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      <Skeleton className="aspect-square w-full sm:aspect-[3/4]" />
      <div>
        <SkeletonText className="w-1/3" />
        <SkeletonText className="w-3/4" />
        <SkeletonText className="w-1/4" />
        <div className="mt-2 flex gap-2">
          <Skeleton className="h-6 w-6 border border-white" />
          <Skeleton className="h-6 w-6 border border-white" />
        </div>
      </div>
    </div>
  );
}
