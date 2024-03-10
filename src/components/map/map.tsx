"use client";

import { type MapOptions } from "leaflet";

import type { MarkerData } from "@/types/map-types";
import MapLayout from "./map-layout";
import { useMapQueryParams } from "@/hooks/use-map-query-params";
import MapContent from "./map-content";

interface Props extends MapOptions {
  markerData: MarkerData[];
  center: NonNullable<MapOptions["center"]>;
  infoPanel?: { timeRefreshed: number };
}

export default function Map({ markerData, infoPanel, ...props }: Props) {
  const { latLng, zoom } = useMapQueryParams();

  return (
    <MapLayout {...props} center={latLng ?? props.center} zoom={zoom}>
      <MapContent markerData={markerData} infoPanel={infoPanel} />
    </MapLayout>
  );
}
