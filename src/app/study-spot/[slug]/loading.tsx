import { Separator } from "@/components/ui/separator";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="space-y-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Skeleton className="aspect-[3/4] w-full min-w-0" />
          <Skeleton className="aspect-[3/4] w-full min-w-0" />
          <Skeleton className="aspect-[3/4] w-full min-w-0" />
          <Skeleton className="aspect-[3/4] w-full min-w-0" />
        </div>
        <div>
          <Separator className="mb-2" />
          <ul>
            <>
              <SkeletonText className="w-36 max-w-full" />
              <SkeletonText className="w-56 max-w-full" />
              <SkeletonText className="w-20 max-w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-6 border border-white" />
                <Skeleton className="h-6 w-6 border border-white" />
              </div>
            </>
          </ul>
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-9 w-24 border border-white" />
          </div>
        </div>
      </div>
    </>
  );
}
