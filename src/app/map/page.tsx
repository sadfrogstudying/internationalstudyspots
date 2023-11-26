import {type MarkerData } from "@/components/map";
import { api } from "@/trpc/server";
import { type Metadata } from "next";
import LazyMap from "@/components/map/lazy-map";

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

  const markerData: MarkerData[] = spots.map((spot, i) => ({
    index: i,
    name: spot.name,
    address: spot.address,
    latlng: [spot.latitude, spot.longitude],
    images: spot.images,
    slug: spot.slug,
  }));

  const timeRefreshed = Date.now();

  return (
    <LazyMap
      allMarkerData={markerData}
      className="h-screen"
      infoPanel
      timeRefreshed={timeRefreshed}
    />
  );
}
