"use client";

import * as React from "react";
import { api } from "@/trpc/react";

import { useInView } from "react-intersection-observer";
import useDebounce from "@/hooks/use-debounce";
import SkeletonGridItem from "./grid-item-skeleton";

import dynamic from "next/dynamic";

const GridItem = dynamic(() => import("./grid-item"), {
  loading: () => <SkeletonGridItem />,
});

const PAGE_SIZE = 8;

export default function StudySpotGrid() {
  const { data, isFetching, fetchNextPage } =
    api.studySpot.getAll.useInfiniteQuery(
      {},
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
    rootMargin: "700px",
    onChange: (inView) => {
      if (inView) debouncedRequest();
    },
  });

  return (
    <React.Fragment>
      <div className="animate-fade-in relative grid w-full grid-cols-2 gap-8 duration-1000 lg:grid-cols-4">
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
      </div>

      <div ref={ref} />
    </React.Fragment>
  );
}
