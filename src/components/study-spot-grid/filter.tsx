"use client";

import { api } from "@/trpc/react";
import { SkeletonText } from "../ui/skeleton";
import UnmountAfter from "../unmount-after";
import { useFilterApi } from "./filter-context";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

export default function Filter() {
  const { toggleBooleanFilter, confirmFilters, clearFilters } = useFilterApi();

  const booleanFiltersForRender = [
    { readable: "Power Outlets", name: "powerOutlets" },
    { readable: "Wifi", name: "wifi" },
    { readable: "Natural Views", name: "naturalViews" },
  ] as const;

  return (
    <div className="space-y-4 pt-0">
      <div>
        <h3 className="font-bold">Filter</h3>
        <ul>
          {booleanFiltersForRender.map((filter) => {
            return (
              <li key={filter.name} className="flex items-center gap-2">
                <Checkbox
                  id={filter.name.toLowerCase()}
                  onCheckedChange={() => toggleBooleanFilter(filter.name)}
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
        <CountriesFilter />
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

function CountriesFilter() {
  const { toggleCountryFilter } = useFilterApi();

  const {
    data: countries,
    isInitialLoading,
    isError,
  } = api.studySpot.getCountries.useQuery(undefined, {
    refetchOnMount: false,
  });

  if (isInitialLoading) return <SkeletonList />;

  if (isError)
    return <div className="text-destructive">Error getting countries...</div>;

  if (countries?.length === 0)
    return <div className="text-neutral-500">No countries found</div>;

  return (
    <>
      <ul>
        {countries?.map((country, i) => (
          <ListItem key={country} className="flex items-center gap-2" i={i}>
            <Checkbox
              id={country.toLowerCase()}
              onCheckedChange={() => toggleCountryFilter(country)}
            />
            <label htmlFor={country.toLowerCase()}>{country}</label>
          </ListItem>
        ))}
      </ul>
    </>
  );
}

function ListItem({
  i,
  children,
  className,
}: {
  i: number;
  children: React.ReactNode;
  className?: string;
}) {
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
        className={cn(`animate-fade-in duration-500`, className)}
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
