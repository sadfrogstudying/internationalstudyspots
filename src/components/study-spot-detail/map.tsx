"use client";

import { api } from "@/trpc/react";
import dynamic from "next/dynamic";
import { Link } from "../ui/link";

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
});

export default function StudySpotDetailMap({ id }: { id: number }) {
  const { data: spot } = api.studySpot.byId.useQuery(id);

  if (!spot) return null;

  return (
    <Link
      href={`/map?lat=${spot.latitude}&lng=${spot.longitude}&id=${spot.id}&zoom=${18}`}
      className="block h-full w-full cursor-pointer"
    >
      <div className="h-96 w-full overflow-hidden">
        <Map
          markerData={spot ? [spot] : []}
          center={[spot.latitude, spot.longitude]}
          dragging={false}
          boxZoom={false}
          doubleClickZoom={false}
          scrollWheelZoom={false}
          touchZoom={false}
          keyboard={false}
        />
      </div>
    </Link>
  );
}
