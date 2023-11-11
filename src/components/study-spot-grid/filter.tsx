"use client";

import { api } from "@/trpc/react";
import { SkeletonText } from "../ui/skeleton";
import UnmountAfter from "../unmount-after";

const filters = [
  { category: "Display", options: ["Grid Mode"] },
  { category: "Sort", options: ["Power Outlets", "Wifi", "Natural Views"] },
];

export default function Filter() {
  const { data, isFetched, isError } = api.studySpot.getCountries.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );

  return (
    <div className="space-y-4 pt-0">
      {filters.map((filter) => {
        return (
          <div key={filter.category}>
            <h3 className="font-bold">{filter.category}</h3>
            <ul>
              {filter.options.map((option) => {
                return <li key={`${filter.category}-${option}`}>{option}</li>;
              })}
            </ul>
          </div>
        );
      })}

      <div>
        <h3 className="font-bold">Countries</h3>

        {!isError ? (
          <>
            <ul>
              {data?.map((x, i) => (
                <ListItem key={x.country} i={i}>
                  {x.country}
                </ListItem>
              ))}
            </ul>

            {!isFetched && <SkeletonList />}
          </>
        ) : (
          <div className="text-destructive">Error getting countries...</div>
        )}
      </div>
    </div>
  );
}

function ListItem({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <li className="relative">
      <UnmountAfter delay={i * 50 + 200}>
        <SkeletonText
          className="duration-250 absolute -z-10 w-full animate-fade-out opacity-0"
          style={{
            animationDelay: `${i * 50}ms`,
            animationFillMode: "backwards",
          }}
        />
      </UnmountAfter>
      <span
        className="animate-fade-in duration-500"
        style={{
          animationDelay: `${i * 50}ms`,
          animationFillMode: "backwards",
        }}
      >
        {children}
      </span>
    </li>
  );
}

function SkeletonList() {
  return (
    <ul>
      <SkeletonText />
      <SkeletonText />
      <SkeletonText />
      <SkeletonText />
    </ul>
  );
}
