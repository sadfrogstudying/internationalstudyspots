"use client";

import { api } from "@/trpc/react";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import UnmountAfter from "../unmount-after";
import { useFilterApi, useFilterData } from "./filter-context";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

export default function Filter() {
  const currentFilters = useFilterData();
  const { setFilters, confirmFilters, clearFilters, filters } = useFilterApi();

  return (
    <div className="space-y-4 pt-0">
      <div>
        <h3 className="font-bold">Filter</h3>
        <ul>
          {spotBooleanFilters.map((filter) => {
            return (
              <li key={filter.name} className="flex items-center gap-2">
                <Checkbox
                  id={filter.name.toLowerCase()}
                  checked={filters[filter.name] ?? false}
                  onCheckedChange={() => {
                    setFilters((p) => ({
                      ...p,
                      [filter.name]: !p[filter.name],
                    }));
                  }}
                  defaultChecked={
                    currentFilters ? currentFilters[filter.name] : false
                  }
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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { spotBooleanFilters } from "@/lib/constants";

function CountriesFilter() {
  const { country } = useFilterData();
  const { setFilters, filters } = useFilterApi();

  const {
    data: countries,
    isInitialLoading,
    isError,
  } = api.studySpot.getCountries.useQuery(undefined, {
    refetchOnMount: false,
  });

  if (isInitialLoading) return <Skeleton className="h-9 w-full" />;

  if (isError)
    return <div className="text-destructive">Error getting countries...</div>;

  if (countries?.length === 0)
    return <div className="text-neutral-500">No countries found</div>;

  return (
    <Select
      defaultValue={country}
      value={filters.country ?? ""}
      onValueChange={(newValue) => {
        setFilters((p) => ({
          ...p,
          country: newValue,
        }));
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Countries</SelectLabel>
          <SelectItem value={"all"}>All</SelectItem>
          {countries?.map((country) => (
            <SelectItem value={country} key={country}>
              {country}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );

  return (
    <>
      <ul>
        {countries?.map((country, i) => (
          <ListItem key={country} className="flex items-center gap-2" i={i}>
            <Checkbox
              id={country.toLowerCase()}
              onCheckedChange={() => {
                setFilters((p) => ({
                  ...p,
                  country,
                }));
              }}
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
