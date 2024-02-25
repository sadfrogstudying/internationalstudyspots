import { api } from "@/trpc/server";
import type { MarkerData } from "@/types/map-types";
import { type Metadata } from "next";
import { unstable_cache } from "next/cache";
import { default as nextDynamic } from "next/dynamic";
const Map = nextDynamic(() => import("@/components/map"), {
  ssr: false,
});

const getSpots = unstable_cache(
  async () => await api.studySpot.getAll.query(),
  undefined,
  // force this function to cache for ISR
  // https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#fetching-data-on-the-server-with-third-party-libraries
  { revalidate: 15 },
);

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return {
    title: "Map - International Study Spots",
    description:
      "An interactive map to help you find places to study, read, work (WFH) around the world.  Good for digital nomads, remote workers, students and anyone wanting a nice space for a little while.",
  };
}

export default async function MapPage() {
  const spots = await getSpots();

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
