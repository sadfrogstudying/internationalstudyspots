import Link from "next/link";
import MapControls from "./map-controls";
import type { MarkerData } from "@/types/map-types";
import { useEffect, useRef } from "react";
import L, { type LatLng } from "leaflet";
import {
  CopyIcon,
  TreePine,
  Wifi,
  WifiOff,
  X,
  Zap,
  ZapOff,
} from "lucide-react";
import ImageCarousel from "../study-spot-grid/image-carousel";
import { Button } from "../ui/button";
import TooltipBase from "../study-spot-grid/tooltip-base";

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

  const featuredImages =
    selectedMarker?.images.filter((image) => image.featured) ?? [];

  return (
    <>
      <div className="pointer-events-none fixed bottom-4 flex w-full cursor-default justify-center gap-2 p-4 text-sm md:justify-normal">
        <div
          className="group pointer-events-auto relative mx-4 flex h-32 w-full max-w-sm flex-col gap-6 overflow-hidden rounded-md bg-white shadow-lg md:mx-0 md:h-auto md:max-w-xs md:p-4"
          ref={panelRef}
        >
          {selectedMarker && (
            <Button
              variant="ghost"
              className="absolute right-2 top-2 h-8 w-8 md:h-10 md:w-10"
              size="icon"
              onClick={clearSelectedMarker}
            >
              <X className="h-5" />
            </Button>
          )}

          <h2 className="text-bold hidden items-center gap-2 text-xl md:flex">
            <span>
              StudySpots<strong>Locator</strong>
            </span>
          </h2>

          <div className="h-full md:space-y-4">
            {!selectedMarker ? (
              <div className="p-4 md:p-0">
                <p>
                  Map data will be refreshed with latest data once every minute.
                </p>
                <br />
                <p>
                  Last updated <strong>{localeTimeString}</strong>
                </p>
              </div>
            ) : (
              <div className="pointer-events-auto flex h-full items-center md:h-auto md:flex-col md:items-start md:space-y-4">
                <div className="aspect-square h-full animate-fade-in md:aspect-[3/4] md:w-full">
                  <ImageCarousel
                    key={selectedMarker.name}
                    images={featuredImages}
                    name={selectedMarker.name}
                    sizes="(max-width: 767px) 30vw, 20vw"
                    controlsAlwaysVisible
                    priority
                  />
                </div>
                <ul className="flex flex-grow flex-col gap-1 truncate p-4 pr-12 text-sm md:w-full md:p-0 md:text-xs">
                  <li>
                    <Link
                      href={`/study-spot/${selectedMarker.slug}`}
                      className="block w-full truncate rounded-md font-bold underline hover:bg-gray-100 active:bg-gray-200 md:text-xs"
                    >
                      {selectedMarker.name}
                    </Link>
                  </li>
                  <li
                    onClick={() => void copyToClipboard(selectedMarker.address)}
                    className="cursor-pointer truncate rounded-md hover:bg-gray-100 active:bg-gray-200"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <CopyIcon className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{selectedMarker.address}</span>
                    </div>
                  </li>
                  <li className="truncate">{selectedMarker.venueType}</li>
                  <li className="mt-2">
                    <ul className="flex w-full flex-row gap-2">
                      <li>
                        {selectedMarker.wifi ? (
                          <TooltipBase content={"Has Wifi"}>
                            <Wifi />
                          </TooltipBase>
                        ) : (
                          <TooltipBase content={"Doesn't Have Wifi"}>
                            <WifiOff className="text-neutral-200" />
                          </TooltipBase>
                        )}
                      </li>
                      <li>
                        {selectedMarker.powerOutlets ? (
                          <TooltipBase content={"Has Power Outlets"}>
                            <Zap />
                          </TooltipBase>
                        ) : (
                          <TooltipBase content={"Doesn't Have Power Outlets"}>
                            <ZapOff className="text-neutral-200" />
                          </TooltipBase>
                        )}
                      </li>
                      <li>
                        {selectedMarker.naturalViews ? (
                          <TooltipBase content={"Has Natural Views"}>
                            <TreePine />
                          </TooltipBase>
                        ) : (
                          <TooltipBase content={"Doesn't Have Natural Views"}>
                            <TreePine className="text-neutral-200" />
                          </TooltipBase>
                        )}
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <MapControls setUserCoords={setUserCoords} userCoords={userCoords} />
      </div>
    </>
  );
};

export default MapInfoPanel;
