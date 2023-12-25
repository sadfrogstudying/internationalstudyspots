import { Wifi, WifiOff, Zap, ZapOff } from "lucide-react";

import UnmountAfter from "../unmount-after";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { type RouterOutputs } from "@/trpc/shared";
import { cn, isEmptyString } from "@/lib/utils";
type StudySpot = RouterOutputs["studySpot"]["bySlug"];

export default function Summary({ studySpot }: { studySpot?: StudySpot }) {
  const durationTiming = 500;
  const animationDuration = `duration-${durationTiming}`;
  const timingOffset = 200;

  return (
    <ul>
      {studySpot ? (
        <>
          <li className="relative truncate font-bold">
            <UnmountAfter delay={timingOffset}>
              <SkeletonText
                className={cn(
                  "absolute w-36 max-w-full animate-fade-out opacity-0",
                  animationDuration,
                )}
              />
            </UnmountAfter>
            {[studySpot.state, studySpot.country]
              .filter((str) => !isEmptyString(str))
              .join(", ") || "No Location"}
          </li>
          <li className="relative">
            <UnmountAfter delay={200}>
              <SkeletonText
                className={cn(
                  "absolute w-56 max-w-full animate-fade-out opacity-0",
                  animationDuration,
                )}
              />
            </UnmountAfter>
            <h2 className="truncate">{studySpot.name}</h2>
          </li>
          <li className="relative truncate">
            <UnmountAfter delay={200}>
              <SkeletonText
                className={cn(
                  "absolute w-20 max-w-full animate-fade-out opacity-0",
                  animationDuration,
                )}
              />
            </UnmountAfter>
            {studySpot.venueType}
          </li>
          <li>
            <ul className="flex gap-2">
              <li className="relative">
                <UnmountAfter delay={200}>
                  <Skeleton
                    className={cn(
                      "absolute h-full w-full animate-fade-out opacity-0",
                      animationDuration,
                    )}
                  />
                </UnmountAfter>

                {studySpot.wifi ? <Wifi /> : <WifiOff />}
              </li>
              <li className="relative">
                <UnmountAfter delay={200}>
                  <Skeleton
                    className={cn(
                      "absolute h-full w-full animate-fade-out opacity-0",
                      animationDuration,
                    )}
                  />
                </UnmountAfter>

                {studySpot.powerOutlets ? <Zap /> : <ZapOff />}
              </li>
            </ul>
          </li>
        </>
      ) : (
        <>
          <SkeletonText className="w-36 max-w-full" />
          <SkeletonText className="w-56 max-w-full" />
          <SkeletonText className="w-20 max-w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-6 border border-white" />
            <Skeleton className="h-6 w-6 border border-white" />
          </div>
        </>
      )}
    </ul>
  );
}
