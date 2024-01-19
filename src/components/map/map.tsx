"use client";

import { useState } from "react";
import L, { type LatLng, type MapOptions } from "leaflet";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import type { MarkerData } from "@/types/map-types";
import MapLayout from "./map-layout";
import MapInfoPanel from "./map-info-panel";

interface Props extends MapOptions {
  markerData: MarkerData[];
  center: NonNullable<MapOptions["center"]>;
  infoPanel?: { timeRefreshed: number };
}

export default function MapSimple({ markerData, infoPanel, ...props }: Props) {
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [userCoords, setUserCoords] = useState<LatLng | null>(null);

  return (
    <MapLayout {...props}>
      {infoPanel && (
        <MapInfoPanel
          selectedMarker={selectedMarker}
          timeRefreshed={infoPanel.timeRefreshed}
          clearSelectedMarker={() => setSelectedMarker(null)}
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
              },
              keypress: () => {
                setSelectedMarker(marker);
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
