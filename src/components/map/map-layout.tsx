"use client";

import { type MapOptions } from "leaflet";
import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer } from "react-leaflet";

const tileLayers = {
  light: "light_all",
  dark: "dark_all",
  voyager: "rastertiles/voyager_labels_under",
};

export default function MapLayout({
  center,
  zoom = 12,
  children,
  ...props
}: MapOptions & {
  children?: React.ReactNode;
}) {
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
      {children}
    </MapContainer>
  );
}
