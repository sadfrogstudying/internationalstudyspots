"use client";

import { useState } from "react";

import L, { type LatLng, type MapOptions } from "leaflet";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import type { MarkerData } from "@/types/map-types";
import MapLayout from "./map-layout";
import MapInfoPanel from "./map-info-panel";
import { useMapQueryParams } from "@/hooks/use-map-query-params";

interface Props extends MapOptions {
  markerData: MarkerData[];
  center: NonNullable<MapOptions["center"]>;
  infoPanel?: { timeRefreshed: number };
}

export default function Map({ markerData, infoPanel, ...props }: Props) {
  const { latLng, id, updateMapQueryParams, clearMapQueryParams } =
    useMapQueryParams();

  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(
    markerData.find((marker) => marker.id === id) ?? null,
  );
  const [userCoords, setUserCoords] = useState<LatLng | null>(null);

  return (
    <MapLayout {...props} center={latLng ?? props.center}>
      {infoPanel && (
        <MapInfoPanel
          selectedMarker={selectedMarker}
          timeRefreshed={infoPanel.timeRefreshed}
          clearSelectedMarker={() => {
            setSelectedMarker(null);
            clearMapQueryParams();
          }}
          setUserCoords={(latLng) => setUserCoords(latLng)}
          userCoords={userCoords}
        />
      )}

      {userCoords && (
        <Marker
          position={userCoords}
          icon={userIcon}
          alt="Your location"
          title="Your location"
        />
      )}

      <MarkerClusterGroup chunkedLoading>
        {markerData.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.latitude, marker.longitude]}
            autoPan
            icon={marker.id === selectedMarker?.id ? selectedIcon : defaultIcon}
            alt={`Location of ${marker.name}`}
            title={`Location of ${marker.name}`}
            eventHandlers={{
              click: () => {
                setSelectedMarker(marker);
                updateMapQueryParams(
                  marker.latitude,
                  marker.longitude,
                  marker.id,
                );
              },
              keypress: () => {
                setSelectedMarker(marker);
                updateMapQueryParams(
                  marker.latitude,
                  marker.longitude,
                  marker.id,
                );
              },
            }}
          />
        ))}
      </MarkerClusterGroup>
    </MapLayout>
  );
}

const defaultIcon = new L.Icon({
  iconSize: [32, 32],
  iconAnchor: [12, 12],
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  iconUrl: "/leaflet/images/marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});

const selectedIcon = new L.Icon({
  iconSize: [32, 32],
  iconAnchor: [12, 12],
  iconRetinaUrl: "/leaflet/images/selected-marker-icon-2x.png",
  iconUrl: "/leaflet/images/selected-marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});

const userIcon = new L.Icon({
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  iconRetinaUrl: "/leaflet/images/user-marker-icon-2x.png",
  iconUrl: "/leaflet/images/user-marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});
