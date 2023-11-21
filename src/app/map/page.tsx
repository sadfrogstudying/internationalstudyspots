import { type MarkerData } from "@/components/map";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/server";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map"), {
  loading: () => (
    <Skeleton
      className="absolute top-0 mb-4 flex h-screen w-full items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-300 font-mono"
      role="progressbar"
    >
      Loading Map...
    </Skeleton>
  ),
  ssr: false,
});

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

  return (
    <Map
      allMarkerData={markerData}
      className="h-screen"
      infoPanel
      // timeRefreshed={timeRefreshed}
      timeRefreshed={0}
    />
  );
}
