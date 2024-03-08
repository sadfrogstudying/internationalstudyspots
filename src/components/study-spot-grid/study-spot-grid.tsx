"use client";

import * as React from "react";
import { api } from "@/trpc/react";
import dynamic from "next/dynamic";

import { useInView } from "react-intersection-observer";
import useDebounce from "@/hooks/use-debounce";
import SkeletonGridItem from "./grid-item-skeleton";

import { useFilterData } from "@/components/study-spot-grid/filter-context";
import { useWindowSize } from "@/hooks/use-window-size";

const GridItem = dynamic(() => import("./grid-item"), {
  loading: () => <SkeletonGridItem />,
});

const PAGE_SIZE = 16;

export default function StudySpotGrid() {
  const appliedFilters = useFilterData();
  const { country, ...filters } = appliedFilters ?? {};
  const { data, isFetching, fetchNextPage, isInitialLoading } =
    api.studySpot.getAll.useInfiniteQuery(
      {
        filters,
        country,
        take: PAGE_SIZE,
      },
      {
        getNextPageParam: (lastQuery) => lastQuery[lastQuery.length - 1]?.id,
      },
    );

  const noNextPage = data?.pages.some((page) => page.length < PAGE_SIZE);

  const debouncedRequest = useDebounce(() => {
    void fetchNextPage();
  }, 250);

  const { width } = useWindowSize();

  const getRootMargin = () => {
    if (width < 768) return 4500;
    return 1400;
  };

  const { ref } = useInView({
    rootMargin: `${getRootMargin()}px`,
    onChange: (inView) => {
      if (inView) debouncedRequest();
    },
  });

  const noResults = data?.pages.length === 1 && data?.pages[0]?.length === 0;

  return (
    <div className="relative grid w-full animate-fade-in gap-4 gap-y-8 duration-1000 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
      {isInitialLoading && <SkeletonGridItems />}
      {data?.pages.map((page, i) => (
        <React.Fragment key={`page-${i}`}>
          {page.map((studySpot, i) => {
            return (
              <GridItem
                studySpot={studySpot}
                i={i}
                key={`study-spot-${studySpot.id}`}
              />
            );
          })}
        </React.Fragment>
      ))}

      {noResults && (
        <div className="col-span-full">
          <h2 className="text-center text-2xl font-bold">
            No results found for your chosen filters
          </h2>
        </div>
      )}

      {isFetching && !noNextPage && <SkeletonGridItems />}
      {!isFetching && !noNextPage && <SkeletonGridItems />}

      <div ref={ref} />
    </div>
  );
}

function SkeletonGridItems() {
  return Array.from(Array(PAGE_SIZE / 2).keys()).map((x) => (
    <SkeletonGridItem key={`skele-${x}`} />
  ));
}
