"use client";

import {
  type ReactNode,
  type SetStateAction,
  type Dispatch,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { type SpotBooleanSchema } from "@/schemas";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createUrl } from "@/lib/helpers";
import { filterKeys } from "@/lib/constants";

/** Used to set default input value */
interface FilterData extends Partial<SpotBooleanSchema> {
  country?: string;
}

interface FilterApi {
  setFilters: Dispatch<SetStateAction<FilterData>>;
  confirmFilters: () => void;
  clearFilters: () => void;
  /** Used to make the inputs controlled */
  filters: FilterData;
}

const FilterContextData = createContext<FilterData | null>(null);
const FilterContextApi = createContext<FilterApi | null>(null);

export const FilterController = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Gets search params, transforms it to an object with the correct type
  const filterData = useMemo((): FilterData => {
    const entriesIterable = searchParams.entries();

    function transform(value: string) {
      if (value === "true") return true;
      if (value === "false") return null;
      if (typeof value === "string" && !!value.trim()) return value;
      return null;
    }

    function isKeyOfFilterData(key: string): key is keyof FilterData {
      return filterKeys.includes(key);
    }

    const obj: Record<string, string | boolean> = {};

    for (const [key, v] of entriesIterable) {
      // Ensure key is key of filter data
      if (!isKeyOfFilterData(key)) continue;

      // Transform param to usable type
      const value = transform(v);

      if (value === null) continue;

      obj[key] = value;
    }

    return obj;
  }, [searchParams]);

  // Set default state to param state
  const [filters, setFilters] = useState<FilterData>(filterData);

  const filterApi = useMemo(
    (): FilterApi => ({
      setFilters,
      filters,
      clearFilters: () => {
        router.replace(pathname, {
          scroll: false,
        });

        // Set form state to param state
        setFilters({});
      },
      confirmFilters: () => {
        // Base option params on current params so we can preserve any other param state in the url.
        const filterSearchParams = new URLSearchParams();

        // Update the url params from state
        let key: keyof FilterData;
        for (key in filters) {
          let value = filters[key];

          // If the value is falsy, don't add it to the url params
          if (!value) continue;
          if (key === "country" && value === "all") continue;
          if (typeof value === "boolean") value = "true";

          filterSearchParams.set(key, value);
        }

        // Update route
        const filterUrl = createUrl(pathname, filterSearchParams);
        router.replace(filterUrl, {
          scroll: false,
        });
      },
    }),
    [filters, pathname, router],
  );

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
