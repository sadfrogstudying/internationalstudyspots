"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { type RouterOutputs } from "@/trpc/shared";

import { Wifi, WifiOff, Zap, ZapOff, TreePine } from "lucide-react";

import SkeletonGridItem from "./grid-item-skeleton";
import ImageCarousel from "./image-carousel";
import UnmountAfter from "../unmount-after";
import { Skeleton } from "../ui/skeleton";
import { Link } from "@/components/ui/link";
import { isEmptyString } from "@/lib/utils";

const TooltipBase = dynamic(() => import("./tooltip-base"), {
  ssr: false,
  loading: () => <Skeleton className="h-6 w-6" />,
});

type Spot = RouterOutputs["studySpot"]["getAll"][number];

export default function GridItem({
  studySpot,
  i,
}: {
  studySpot: Spot;
  i: number;
}) {
  const {
    id,
    slug,
    images,
    name,
    state,
    country,
    venueType,
    wifi,
    powerOutlets,
    naturalViews,
  } = studySpot;

  const location =
    [state, country].filter((str) => !isEmptyString(str)).join(", ") ||
    "No Location";

  return (
    <Link
      key={id}
      href={`/study-spot/${slug}`}
      className="group relative h-fit rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {/* Add offset to prevent disgusting "flasing" umount */}
      <UnmountAfter delay={i * 50 + 200}>
        <SkeletonGridItem
          className="duration-250 absolute -z-10 w-full animate-fade-out opacity-0"
          style={{
            animationDelay: `${i * 50}ms`,
            animationFillMode: "backwards",
          }}
        />
      </UnmountAfter>

      <div
        className="duration-250 animate-fade-in space-y-4"
        style={{
          animationDelay: `${i * 50}ms`,
          animationFillMode: "backwards",
        }}
      >
        <ImageCarousel
          images={images}
          name={name}
          sizes="(max-width: 1024px) 40vw, 22vw"
        />
        <ul>
          <li className="truncate text-ellipsis font-bold">{location}</li>
          <li>
            <h2 className="truncate text-ellipsis">{name}</h2>
          </li>
          <li className="truncate text-ellipsis">{venueType}</li>
          <li className="mt-2">
            <ul className="flex gap-2">
              <li>
                {wifi ? (
                  <TooltipBase content={"Has Wifi"}>
                    <Wifi />
                  </TooltipBase>
                ) : (
                  <TooltipBase content={"Doesn't Have Wifi"}>
                    <WifiOff className="text-neutral-200" />
                  </TooltipBase>
                )}
              </li>
              <li>
                {powerOutlets ? (
                  <TooltipBase content={"Has Power Outlets"}>
                    <Zap />
                  </TooltipBase>
                ) : (
                  <TooltipBase content={"Doesn't Have Power Outlets"}>
                    <ZapOff className="text-neutral-200" />
                  </TooltipBase>
                )}
              </li>
              <li>
                {naturalViews ? (
                  <TooltipBase content={"Has Natural Views"}>
                    <TreePine />
                  </TooltipBase>
                ) : (
                  <TooltipBase content={"Doesn't Have Natural Views"}>
                    <TreePine className="text-neutral-200" />
                  </TooltipBase>
                )}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </Link>
  );
}
