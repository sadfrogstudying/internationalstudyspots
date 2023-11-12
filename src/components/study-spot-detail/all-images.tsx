// Eventually this will use it's own query for the images

import { type RouterOutputs } from "@/trpc/shared";
import Image from "next/image";
import UnmountAfter from "../unmount-after";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
type StudySpot = RouterOutputs["studySpot"]["bySlug"];

export default function AllImages({ studySpot }: { studySpot?: StudySpot }) {
  return (
    <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
      {studySpot ? (
        studySpot?.images.slice(0, 15).map((image, i) => {
          const animationDelay = i * 50;
          const durationTiming = 250;
          const animationDuration = `duration-${durationTiming}`;
          const timingOffset = 200;

          return (
            <div className="relative" key={`all-images-item-${image.id}`}>
              <UnmountAfter
                delay={animationDelay + durationTiming + timingOffset}
              >
                <Skeleton
                  className={cn(
                    "absolute aspect-square h-full w-full animate-fade-out duration-500",
                    animationDuration,
                  )}
                  style={{
                    animationDelay: `${animationDelay}ms`,
                  }}
                />
              </UnmountAfter>

              <Image
                src={image.url}
                alt={`Image of ${studySpot?.name}`}
                width={image.width}
                height={image.height}
                className={cn(
                  "aspect-square animate-fade-in object-cover duration-500",
                  animationDuration,
                )}
                sizes="(max-width: 768px) 30vw, 22vw"
                style={{
                  animationDelay: `${i * 50}ms`,
                  animationFillMode: "backwards",
                }}
              />
            </div>
          );
        })
      ) : (
        <>
          <Skeleton className="aspect-square w-full min-w-0" />
          <Skeleton className="aspect-square w-full min-w-0" />
          <Skeleton className="aspect-square w-full min-w-0" />
          <Skeleton className="aspect-square w-full min-w-0" />
          <Skeleton className="aspect-square w-full min-w-0" />
        </>
      )}
    </div>
  );
}
