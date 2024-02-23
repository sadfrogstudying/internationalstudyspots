"use client";

import { Wifi, WifiOff, Zap, ZapOff } from "lucide-react";

import UnmountAfter from "../unmount-after";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { cn, isEmptyString } from "@/lib/utils";
import { api } from "@/trpc/react";

export default function Summary({ slug }: { slug: string }) {
  const { data: studySpot } = api.studySpot.bySlug.useQuery(slug);

  const durationTiming = 500;
  const animationDuration = `duration-${durationTiming}`;
  const timingOffset = 200;

  if (!studySpot) return null;

  return (
    <ul>
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
        <UnmountAfter delay={timingOffset}>
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
        <UnmountAfter delay={timingOffset}>
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
            <UnmountAfter delay={timingOffset}>
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
            <UnmountAfter delay={timingOffset}>
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
    </ul>
  );
}
