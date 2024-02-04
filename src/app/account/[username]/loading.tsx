import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <section className="relative h-screen max-h-96 w-full object-cover">
        <Skeleton className="h-full w-full opacity-40" />
      </section>
      <section className="mx-auto flex flex-col gap-12 px-4 xs:px-14">
        <div className="relative">
          <div className="flex w-full overflow-hidden">
            <div className="w-32 flex-shrink-0 sm:w-56" />

            <div className="absolute bottom-0 left-0 aspect-square h-auto w-32 bg-white object-cover sm:w-56">
              <Skeleton className="h-full w-full" />
            </div>

            <div className="flex flex-shrink-0 flex-col gap-0.5 self-end pl-4 pt-4">
              <h2 className="text-xl font-medium">
                <SkeletonText className="w-48" />
              </h2>

              <div className="text-base text-neutral-500">
                <SkeletonText className="w-48" />
              </div>

              <div className="text-base text-neutral-500">
                <SkeletonText className="w-48" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
