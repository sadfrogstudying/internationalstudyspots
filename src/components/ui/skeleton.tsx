import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}

/** This will dynamically adjust for height depending on font-size */
function SkeletonText({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative w-full", className)} {...props}>
      &nbsp;
      <Skeleton className="absolute left-0 top-0 h-full w-full border border-white" />
    </div>
  );
}

export { Skeleton, SkeletonText };
