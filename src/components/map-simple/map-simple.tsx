"use client";

import L, { type MapOptions } from "leaflet";
import "leaflet/dist/leaflet.css";

import { MapContainer, Marker, TileLayer } from "react-leaflet";

import type { MarkerData } from "@/types/map-types";

interface Props extends MapOptions {
  markerData: MarkerData[];
}

const tileLayers = {
  light: "light_all",
  dark: "dark_all",
  voyager: "rastertiles/voyager_labels_under",
};

export default function MapSimple({
  markerData,
  center,
  zoom = 12,
  ...props
}: Props) {
  if (!center) return null;

  return (
    <MapContainer
      className="h-full w-full"
      zoomControl={false}
      doubleClickZoom={false}
      center={center}
      zoom={zoom}
      {...props}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={`https://{s}.basemaps.cartocdn.com/${tileLayers.light}/{z}/{x}/{y}{r}.png`}
      />
      {markerData.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.latitude, marker.longitude]}
          icon={defaultIcon}
        />
      ))}
    </MapContainer>
  );
}

const defaultIcon = new L.Icon({
  iconSize: [32, 32],
  iconAnchor: [12, 12],
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  iconUrl: "/leaflet/images/marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});
