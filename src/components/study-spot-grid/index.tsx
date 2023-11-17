"use client";

import * as React from "react";
import { api } from "@/trpc/react";

import { useInView } from "react-intersection-observer";
import useDebounce from "@/hooks/use-debounce";
import SkeletonGridItem from "./grid-item-skeleton";

import dynamic from "next/dynamic";
import { useFilterData } from "./filter-context";

const GridItem = dynamic(() => import("./grid-item"), {
  loading: () => <SkeletonGridItem />,
});

const PAGE_SIZE = 8;

export default function StudySpotGrid() {
  const { appliedFilters } = useFilterData();
  const { data, isFetching, fetchNextPage } =
    api.studySpot.getAll.useInfiniteQuery(
      {
        where: {
          ...appliedFilters,
        },
      },
      {
        getNextPageParam: (lastQuery) => lastQuery[lastQuery.length - 1]?.id,
        refetchOnWindowFocus: false,
      },
    );

  const noNextPage = data?.pages.some((page) => page.length < PAGE_SIZE);

  const debouncedRequest = useDebounce(() => {
    void fetchNextPage();
  }, 250);

  const { ref } = useInView({
    rootMargin: "800px",
    onChange: (inView) => {
      if (inView) debouncedRequest();
    },
  });

  const noResults = data?.pages.length === 1 && data?.pages[0]?.length === 0;

  return (
    <React.Fragment>
      <div className="relative grid w-full animate-fade-in grid-cols-2 gap-8 duration-1000 lg:grid-cols-3 lg:gap-4 lg:gap-y-8 xl:grid-cols-4">
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

        {isFetching &&
          !noNextPage &&
          Array.from(Array(PAGE_SIZE).keys()).map((x) => (
            <SkeletonGridItem key={`loading-skele-${x}`} />
          ))}

        {!isFetching &&
          !noNextPage &&
          Array.from(Array(Math.ceil(PAGE_SIZE)).keys()).map((x) => (
            <SkeletonGridItem key={`skele-${x}`} />
          ))}

        <div ref={ref} />
      </div>
    </React.Fragment>
  );
}
