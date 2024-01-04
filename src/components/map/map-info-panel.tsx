import Link from "next/link";
import MapControls from "./map-controls";
import type { MarkerData } from "./index";
import { useEffect, useRef } from "react";
import L, { type LatLng } from "leaflet";
import { CopyIcon } from "lucide-react";
import ImageCarousel from "../study-spot-grid/image-carousel";

const MapInfoPanel = ({
  selectedMarker,
  clearSelectedMarker,
  setUserCoords,
  userCoords,
  timeRefreshed,
}: {
  selectedMarker: MarkerData | null;
  clearSelectedMarker: () => void;
  setUserCoords: (latlng: L.LatLng) => void;
  userCoords: LatLng | null;
  timeRefreshed: number;
}) => {
  const copyToClipboard = async (text: string) =>
    await navigator.clipboard.writeText(text);

  const panelRef = useRef<HTMLDivElement>(null);

  // Prevent user from dragging the map when clicking on the controls
  useEffect(() => {
    if (!panelRef.current) return;
    L.DomEvent.disableClickPropagation(panelRef.current);
  }, []);

  const localeTimeString = new Date(timeRefreshed).toLocaleTimeString(
    undefined,
    {
      hour12: true,
      timeStyle: "medium",
    },
  );

  return (
    <div className="pointer-events-none fixed bottom-4 flex w-full cursor-default justify-center p-4 text-sm md:justify-normal">
      <div
        className="group pointer-events-auto mx-4 flex w-full max-w-md flex-col gap-6 rounded-md bg-white p-4 shadow-lg md:mx-0"
        ref={panelRef}
      >
        <h2 className="text-bold hidden items-center gap-2 text-xl xs:flex">
          <span>
            StudySpots<strong>Locator</strong>
          </span>
        </h2>

        <div className="md:space-y-4">
          {!selectedMarker ? (
            <div>
              <p>
                Map data will be refreshed with latest data once every minute.
              </p>
              <br />
              <p>
                Last updated <strong>{localeTimeString}</strong>
              </p>
            </div>
          ) : (
            <div className="pointer-events-auto flex items-center gap-4 md:flex-col md:items-start md:space-y-4">
              <div className="w-32 md:w-48">
                <ImageCarousel
                  key={selectedMarker.name}
                  images={selectedMarker.images}
                  name={selectedMarker.name}
                  sizes="20vw"
                />
              </div>
              <div className="w-1/2 space-y-1 text-sm md:w-full md:text-xs">
                <Link
                  href={`/study-spot/${selectedMarker.slug}`}
                  className="block w-full rounded-md text-base font-bold hover:bg-gray-100 active:bg-gray-200 md:text-xs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedMarker.name}
                </Link>
                <p
                  onClick={() => void copyToClipboard(selectedMarker.address)}
                  className="cursor-pointer truncate rounded-md hover:bg-gray-100 active:bg-gray-200"
                >
                  <CopyIcon
                    className="inline h-2 w-2"
                    style={{ transform: `translateY(-2px)` }}
                  />{" "}
                  {selectedMarker.address}
                </p>
                <br />
                <p className="hidden md:block">
                  Some description could be shown here, and will be hidden on
                  mobile to keep compact
                </p>
              </div>
            </div>
          )}
        </div>

        <MapControls
          clearSelectedMarker={clearSelectedMarker}
          selectedMarker={!!selectedMarker}
          setUserCoords={setUserCoords}
          userCoords={userCoords}
        />
      </div>
    </div>
  );
};

export default MapInfoPanel;
