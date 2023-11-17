"use client";

import { type SpotBooleanSchema } from "@/schemas";
import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type Filters = Partial<SpotBooleanSchema>;

const defaultFilters: Filters = {
  powerOutlets: false,
  wifi: false,
  naturalViews: false,
};

const FilterContextData = createContext<{
  appliedFilters: Filters | null;
}>({
  appliedFilters: {
    ...defaultFilters,
  },
});

const FilterContextApi = createContext({
  toggleFilter: (_: keyof Filters) => {
    void null;
  },
  confirmFilters: () => {
    void null;
  },
  clearFilters: () => {
    void null;
  },
  filters: {
    ...defaultFilters,
  },
});

export const FilterController = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(filters);

  const data = useMemo(() => {
    /**
     * Conversion to ensure filter values are either `true` or `undefined`
     * E.g. not allowing people to search "No Wifi"
     */
    const filterEntries: [string, true | undefined][] = Object.entries(
      appliedFilters,
    ).map(([key, value]) => [key, !value ? undefined : true]);

    const filterTransformed = Object.fromEntries(filterEntries);

    return { appliedFilters: filterTransformed };
  }, [appliedFilters]);

  const api = useMemo(() => {
    const toggleFilter = (filter: keyof Filters) => {
      setFilters((prev) => ({
        ...prev,
        [filter]: !prev[filter],
      }));
    };

    const clearFilters = () => {
      setFilters(defaultFilters);
      setAppliedFilters(defaultFilters);
    };

    const confirmFilters = () => {
      setAppliedFilters(filters);
    };

    return { toggleFilter, confirmFilters, clearFilters, filters };
  }, [filters]);

  return (
    <FilterContextData.Provider value={data}>
      <FilterContextApi.Provider value={api}>
        {children}
      </FilterContextApi.Provider>
    </FilterContextData.Provider>
  );
};

export const useFilterData = () => useContext(FilterContextData);
export const useFilterApi = () => useContext(FilterContextApi);
