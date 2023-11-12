"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { type RouterOutputs } from "@/trpc/shared";

import { Wifi, WifiOff, Zap, ZapOff } from "lucide-react";

import SkeletonGridItem from "./grid-item-skeleton";
import ImageCarousel from "./image-carousel";
import UnmountAfter from "../unmount-after";

const TooltipBase = dynamic(() => import("./tooltip-base"), { ssr: false });

type Spot = NonNullable<RouterOutputs["studySpot"]["bySlug"]>;

export default function GridItem({
  studySpot,
  i,
}: {
  studySpot: Spot;
  i: number;
}) {
  return (
    <Link
      key={studySpot.id}
      href={`/study-spot/${studySpot.slug}`}
      className="group relative rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
        <ImageCarousel images={studySpot.images} name={studySpot.name} />
        <ul>
          <li className="truncate text-ellipsis font-bold">
            {studySpot.state}, {studySpot.country}
          </li>
          <li>
            <h2 className="truncate text-ellipsis">{studySpot.name}</h2>
          </li>
          <li className="truncate text-ellipsis">{studySpot.venueType}</li>
          <li className="mt-2">
            <ul className="flex gap-2">
              <li className="truncate text-ellipsis">
                {studySpot.wifi ? (
                  <TooltipBase content={"Has Wifi"}>
                    <Wifi />
                  </TooltipBase>
                ) : (
                  <TooltipBase content={"Doesn't Have Wifi"}>
                    <WifiOff className="text-neutral-200" />
                  </TooltipBase>
                )}
              </li>
              <li className="truncate text-ellipsis">
                {studySpot.powerOutlets ? (
                  <TooltipBase content={"Has Power Outlets"}>
                    <Zap />
                  </TooltipBase>
                ) : (
                  <TooltipBase content={"Doesn't Have Power Outlets"}>
                    <ZapOff className="text-neutral-200" />
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
