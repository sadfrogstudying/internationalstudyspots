"use client";

import { api } from "@/trpc/react";
import { SkeletonText } from "../ui/skeleton";
import UnmountAfter from "../unmount-after";
import { useFilterApi } from "./filter-context";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

const filtersToRender = [
  { readable: "Power Outlets", name: "powerOutlets" },
  { readable: "Wifi", name: "wifi" },
  { readable: "Natural Views", name: "naturalViews" },
] as const;

export default function Filter() {
  const { data, isFetched, isError } = api.studySpot.getCountries.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );

  const { toggleFilter, confirmFilters, clearFilters, filters } =
    useFilterApi();

  return (
    <div className="space-y-4 pt-0">
      <div>
        <h3 className="font-bold">Filter</h3>
        <ul>
          {filtersToRender.map((filter) => {
            return (
              <li key={filter.name} className="flex items-center gap-2">
                <Checkbox
                  id={filter.name.toLowerCase()}
                  onCheckedChange={() => toggleFilter(filter.name)}
                  checked={filters[filter.name]}
                />
                <label htmlFor={filter.name.toLowerCase()}>
                  {filter.readable}
                </label>
              </li>
            );
          })}
        </ul>
      </div>

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

      <div className="flex w-fit flex-col gap-2">
        <Button onClick={confirmFilters}>Confirm</Button>
        <Button onClick={clearFilters} variant="outline">
          Clear Filters
        </Button>
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
