"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useFilterData } from "@/components/study-spot-grid/filter-context";
import Hero from "@/components/study-spot-detail/hero";
import Author from "@/components/study-spot-detail/author";
import Summary from "@/components/study-spot-detail/summary";

const MapSimple = dynamic(() => import("@/components/map-simple"), {
  ssr: false,
});

const DeleteAlertDialog = dynamic(
  () => import("../study-spot-grid/delete-alert-dialog"),
);

const List = dynamic(() => import("./list"));
const AllImages = dynamic(() => import("./all-images"));

interface Props {
  slug: string;
}

export default function StudySpotDetail({ slug }: Props) {
  const { data } = api.studySpot.bySlug.useQuery(slug);
  const { data: author, isLoading: authorLoading } =
    api.studySpot.authorBySlug.useQuery(slug, {
      enabled: !!data,
    });
  const { data: user, isLoading: userLoading } =
    api.user.currentBySession.useQuery();

  const isAuthor = user?.username === author?.username;

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
    <div className="mx-auto max-w-screen-2xl space-y-12 p-4">
      <Hero studySpot={data} />

      <div>
        <Separator className="mb-2" />
        <Summary studySpot={data ?? cachedStudySpot} />
        <div className="mt-4 flex gap-2">
          <Button
            className={cn(
              !data && "pointer-events-none bg-primary/10 text-transparent",
            )}
            asChild
          >
            <Link href={`/study-spot/${slug}/edit`}>Edit Spot</Link>
          </Button>
          {!!isAuthor && !userLoading && data?.id && (
            <DeleteAlertDialog
              className="animate-fade-in duration-500"
              id={data?.id}
            />
          )}
        </div>
      </div>

      <div>
        <Separator className="mb-2" />
        <Author author={author} loading={authorLoading} />
      </div>

      <div>
        <Separator className="mb-2" />
        <div className="relative h-96 w-full overflow-hidden bg-gray-200">
          <MapSimple
            markerData={data ? [data] : []}
            center={data ? [data.latitude, data.longitude] : undefined}
          />
        </div>
      </div>

      <div>
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
