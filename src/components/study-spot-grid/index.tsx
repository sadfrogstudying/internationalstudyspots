"use client";

import * as React from "react";
import { api } from "@/trpc/react";
import ImageCarousel from "./image-carousel";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

import { useInView } from "react-intersection-observer";
import useDebounce from "@/hooks/use-debounce";

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
    rootMargin: "400px",
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
                <Link
                  key={studySpot.id}
                  href={`/study-spot/${studySpot.slug}`}
                  className="group relative rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {/* Add offset to prevent disgusting "flasing" umount */}
                  <UnmountAfter delay={i * 50 + 200}>
                    <SkeletonGridItem
                      className="animate-fade-out duration-250 absolute -z-10 w-full opacity-0"
                      style={{
                        animationDelay: `${i * 50}ms`,
                        animationFillMode: "backwards",
                      }}
                    />
                  </UnmountAfter>

                  <div
                    className="animate-fade-in duration-250 space-y-4"
                    style={{
                      animationDelay: `${i * 50}ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <ImageCarousel
                      images={studySpot.images}
                      name={studySpot.name}
                    />
                    <ul>
                      <li className="truncate text-ellipsis font-bold">
                        {studySpot.state}, {studySpot.country}
                      </li>
                      <li>
                        <h2 className="truncate text-ellipsis">
                          {studySpot.name}
                        </h2>
                      </li>
                      <li className="truncate text-ellipsis">
                        {studySpot.venueType}
                      </li>
                      <li className="truncate text-ellipsis">
                        Wifi: {studySpot.wifi ? "Yes" : "No"}
                      </li>
                      <li className="truncate text-ellipsis">
                        Power Outlets: {studySpot.powerOutlets ? "Yes" : "No"}
                      </li>
                    </ul>
                  </div>
                </Link>
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

const SkeletonGridItem = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      <Skeleton className="aspect-square w-full sm:aspect-[3/4]" />
      <div>
        <Skeleton className="h-6 w-1/3 border border-white" />
        <Skeleton className="h-6 w-3/4 border border-white" />
        <Skeleton className="h-6 w-1/4 border border-white" />
        <Skeleton className="h-6 w-1/3 border border-white" />
        <Skeleton className="h-6 w-1/3 border border-white" />
      </div>
    </div>
  );
};

const UnmountAfter = ({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) => {
  const [mounted, setMounted] = React.useState(true);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setMounted(false);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  return mounted ? children : null;
};
