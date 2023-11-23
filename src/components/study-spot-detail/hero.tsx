import Image from "next/image";
import UnmountAfter from "../unmount-after";
import { Skeleton } from "../ui/skeleton";

import { type RouterOutputs } from "@/trpc/shared";
type StudySpot = RouterOutputs["studySpot"]["bySlug"];

export default function Hero({ studySpot }: { studySpot?: StudySpot }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {studySpot ? (
          studySpot?.images.slice(0, 5).map((image, i) => (
            <div className="relative" key={image.id}>
              <Image
                src={image.url}
                alt={`Image of ${studySpot?.name}`}
                width={image.width}
                height={image.height}
                className="duration-250 aspect-[3/4] w-full min-w-0 animate-fade-in object-cover"
                style={{
                  animationDelay: `${i * 50}ms`,
                  animationFillMode: "backwards",
                }}
                sizes="(max-width: 1024px) 40vw, 22vw"
              />

              <UnmountAfter delay={200}>
                <Skeleton
                  className="absolute top-0 z-30 h-full w-full animate-fade-out duration-500"
                  style={{
                    animationDelay: `${i * 50}ms`,
                    animationFillMode: "backwards",
                  }}
                />
              </UnmountAfter>
            </div>
          ))
        ) : (
          <>
            <Skeleton className="aspect-[3/4] w-full min-w-0" />
            <Skeleton className="aspect-[3/4] w-full min-w-0" />
            <Skeleton className="aspect-[3/4] w-full min-w-0" />
            <Skeleton className="aspect-[3/4] w-full min-w-0" />
            <Skeleton className="aspect-[3/4] w-full min-w-0" />
          </>
        )}
      </div>
    </>
  );
}
