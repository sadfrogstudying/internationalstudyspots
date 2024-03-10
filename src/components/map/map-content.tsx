import { useEffect, useState } from "react";
import L, { type LatLng } from "leaflet";
import { Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import type { MarkerData } from "@/types/map-types";
import { useMapQueryParams } from "@/hooks/use-map-query-params";
import MapInfoPanel from "./map-info-panel";
import useDebounce from "@/hooks/use-debounce";

interface Props {
  markerData: MarkerData[];
  infoPanel?: { timeRefreshed: number };
}

export default function MapContent({ markerData, infoPanel }: Props) {
  const map = useMap();

  const { id, updateMapQueryParams, clearMapQueryParams } = useMapQueryParams();

  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(
    markerData.find((marker) => marker.id === id) ?? null,
  );
  const [userCoords, setUserCoords] = useState<LatLng | null>(null);

  const debouncedRequest = useDebounce(() => {
    const coords = map.getCenter();
    const zoom = map.getZoom();

    updateMapQueryParams({
      lat: coords.lat,
      lng: coords.lng,
      zoom,
    });
  }, 750);

  useEffect(() => {
    map.on("moveend", debouncedRequest);
  });

  return (
    <>
      {infoPanel && (
        <MapInfoPanel
          selectedMarker={selectedMarker}
          timeRefreshed={infoPanel.timeRefreshed}
          clearSelectedMarker={() => {
            setSelectedMarker(null);
            clearMapQueryParams(["id"]);
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
                updateMapQueryParams({
                  lat: marker.latitude,
                  lng: marker.longitude,
                  id: marker.id,
                });
              },
              keypress: () => {
                setSelectedMarker(marker);
                updateMapQueryParams({
                  lat: marker.latitude,
                  lng: marker.longitude,
                  id: marker.id,
                });
              },
            }}
          />
        ))}
      </MarkerClusterGroup>
    </>
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
