"use client";

import { api } from "@/trpc/react";
import { Separator } from "../ui/separator";
import Hero from "./hero";
import Summary from "./summary";
import List from "./list";
import AllImages from "./all-images";

interface Props {
  slug: string;
}

export default function StudySpotDetail({ slug }: Props) {
  const { data } = api.studySpot.bySlug.useQuery(slug, {
    refetchOnWindowFocus: false,
  });

  const apiUtils = api.useUtils();
  // If user was on grid page, will use that to optimistically render some data quickly
  // It will be replaced with the fresh data when query completes
  const cachedGetAllQuery = apiUtils.studySpot.getAll.getInfiniteData({})
    ?.pages;
  const cachedStudySpot = cachedGetAllQuery
    ?.flatMap((page) => page)
    .find((studySpot) => studySpot.slug === slug);

  return (
    <div className="max-w-7xl space-y-12 p-4">
      <Hero studySpot={data} />

      <div>
        <Separator className="mb-2" />
        <Summary studySpot={data || cachedStudySpot} />
      </div>

      <div className="space-y-2">
        <Separator className="mb-2" />
        <List studySpot={data} />
      </div>

      <div>
        <Separator className="mb-2" />
        <AllImages studySpot={data} />
        <div className="space-y-4">
          <i className="block"> page slug: {slug}</i>
        </div>
      </div>
    </div>
  );
}
