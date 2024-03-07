"use client";

/**
 * This filter context utilises "split providers" to prevent excessive re-renders for the spot grid
 */

import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { type SpotBooleanSchema } from "@/schemas";

type BooleanFilters = Partial<SpotBooleanSchema>;
type CountriesFilters = string[];

interface FiltersData extends BooleanFilters {
  countries: CountriesFilters;
}

interface FiltersApi {
  toggleCountryFilter: (country: string) => void;
  toggleBooleanFilter: (_: keyof BooleanFilters) => void;
  confirmFilters: () => void;
  clearFilters: () => void;
}

const defaultBooleanFilters = {
  powerOutlets: false,
  wifi: false,
  naturalViews: false,
};

const defaultCountriesFilters = {
  countries: [],
};

const defaultFilters: FiltersData = {
  ...defaultBooleanFilters,
  ...defaultCountriesFilters,
};

const FilterContextData = createContext<FiltersData | null>(null);
const FilterContextApi = createContext<FiltersApi | null>(null);

export const FilterController = ({ children }: { children: ReactNode }) => {
  const [booleanFilters, setBooleanFilters] = useState<BooleanFilters>(
    defaultBooleanFilters,
  );
  const [countryFilters, setCountryFilters] = useState<CountriesFilters>([]);
  const [appliedFilters, setAppliedFilters] =
    useState<FiltersData>(defaultFilters);

  /** Filter Data */
  const filterData = useMemo(() => appliedFilters, [appliedFilters]);

  /** Filter Api */
  const filterApi = useMemo(() => {
    const filterApiInner: FiltersApi = {
      toggleBooleanFilter: (filter: keyof BooleanFilters) => {
        setBooleanFilters((prev) => ({
          ...prev,
          [filter]: !prev[filter],
        }));
      },
      clearFilters: () => {
        setBooleanFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
      },
      confirmFilters: () => {
        setAppliedFilters({
          ...booleanFilters,
          countries: [...countryFilters],
        });
      },
      toggleCountryFilter: (countryToToggle: string) => {
        if (countryFilters.includes(countryToToggle)) {
          setCountryFilters((c) =>
            c.filter((country) => country !== countryToToggle),
          );
        } else {
          setCountryFilters((c) => [...c, countryToToggle]);
        }
      },
    };

    return filterApiInner;
  }, [booleanFilters, countryFilters]);

  return (
    <FilterContextData.Provider value={filterData}>
      <FilterContextApi.Provider value={filterApi}>
        {children}
      </FilterContextApi.Provider>
    </FilterContextData.Provider>
  );
};

export const useFilterData = () => {
  const filterDataContext = useContext(FilterContextData);

  if (!filterDataContext)
    throw new Error("useFilterData has to be used within <FilterController>");

  return filterDataContext;
};

export const useFilterApi = () => {
  const filterApiContext = useContext(FilterContextApi);

  if (!filterApiContext)
    throw new Error("useFilterApi has to be used within <FilterController>");

  return filterApiContext;
};
