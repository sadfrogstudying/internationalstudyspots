"use client";

import dynamic from "next/dynamic";
import { api } from "@/trpc/react";

import { useFilterData } from "../study-spot-grid/filter-context";

import { Separator } from "../ui/separator";
import Hero from "./hero";
import Summary from "./summary";

const List = dynamic(() => import("./list"));
const AllImages = dynamic(() => import("./all-images"));

interface Props {
  slug: string;
}

export default function StudySpotDetail({ slug }: Props) {
  const { data } = api.studySpot.bySlug.useQuery(slug);

  const { appliedFilters } = useFilterData();

  const apiUtils = api.useUtils();
  // If user was on grid page, will use that to optimistically render some data quickly
  // It will be replaced with the fresh data when query completes
  // Remember, need to call it with the same args as the query in the grid
  const cachedStudySpot = apiUtils.studySpot.getAll
    .getInfiniteData({
      where: { ...appliedFilters },
    })
    ?.pages?.flatMap((page) => page)
    .find((studySpot) => studySpot.slug === slug);

  return (
    <div className="max-w-7xl space-y-12 p-4">
      <Hero studySpot={data} />

      <div>
        <Separator className="mb-2" />
        <Summary studySpot={data ?? cachedStudySpot} />
      </div>

      <div className="space-y-2">
        <Separator className="mb-2" />
        <List studySpot={data} />
      </div>

      <div>
        <Separator className="mb-2" />
        <AllImages studySpot={data} />
      </div>
    </div>
  );
}