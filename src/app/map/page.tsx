import { api } from "@/trpc/server";
import type { MarkerData } from "@/types/map-types";
import { type Metadata } from "next";
import { default as nextDynamic } from "next/dynamic";
const Map = nextDynamic(() => import("@/components/map"), {
  ssr: false,
});

/**
 * https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
 *
 * force-static: Force static rendering and cache the data of a
 * layout or page by forcing cookies(), headers() and
 * useSearchParams() to return empty values.
 */
export const dynamic = "force-static";
/** Revalidate the data at most every 60 seconds */
export const revalidate = 60;

export function generateMetadata(): Metadata {
  return {
    title: "Map - International Study Spots",
    description:
      "An interactive map to help you find places to study, read, work (WFH) around the world.  Good for digital nomads, remote workers, students and anyone wanting a nice space for a little while.",
  };
}

export default async function MapPage() {
  const spots = await api.studySpot.getAll.query();

  const markerData: MarkerData[] = spots.map((spot) => spot);

  const timeRefreshed = Date.now();

  return (
    <div className="absolute left-0 top-0 z-10 h-full w-full overflow-hidden rounded-md bg-primary/10">
      <Map
        markerData={markerData}
        infoPanel={{ timeRefreshed }}
        center={[-33.8721876, 151.2058977]}
      />
    </div>
  );
}
