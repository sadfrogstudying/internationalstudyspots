import { useMapEvents } from "react-leaflet";
import { Button } from "../ui/button";

import { cn } from "@/lib/utils";
import type { LatLng } from "leaflet";
import { useState } from "react";
import { InfoIcon, Minus, Navigation, Plus } from "lucide-react";

type State = {
  status: "initial" | "loading" | "success" | "error";
};

const MapControls = ({
  className,
  setUserCoords,
  userCoords,
}: {
  className?: string;
  setUserCoords: (latlng: LatLng) => void;
  userCoords: LatLng | null;
}) => {
  const [coords, setUserCoordsStatus] = useState<State>({
    status: "initial",
  });

  const map = useMapEvents({
    locationfound(e) {
      map.setView(e.latlng, 24);
      setUserCoords && setUserCoords(e.latlng);
      setUserCoordsStatus({ status: "success" });
    },
    locationerror() {
      setUserCoordsStatus({ status: "error" });
    },
  });

  return (
    <>
      {coords.status === "error" && (
        <div className="fixed left-0 top-16 p-4 pr-20 text-red-500">
          Grr.. you must allow location access to get your current location. If
          you&apos;re using Chrome, click the{" "}
          <InfoIcon
            className="inline h-4 w-4"
            aria-describedby="View site information icon"
          />{" "}
          next to the address bar and click &quot;reset permission&quot;, then
          reload.
        </div>
      )}
      <div className="pointer-events-auto fixed right-4 top-16 h-fit sm:static">
        <div
          className={cn(
            "flex flex-col divide-y rounded bg-lime-100 shadow-lg",
            className,
          )}
        >
          <Button
            variant="ghost"
            className="rounded-none rounded-b-md rounded-t-md bg-white focus-visible:z-10 active:z-10 sm:rounded-b-none"
            size="icon"
            onClick={() => {
              map.locate();

              !userCoords &&
                coords.status === "initial" &&
                setUserCoordsStatus({ status: "loading" });
            }}
            disabled={coords.status === "loading"}
          >
            <Navigation className="h-5" fill="black" />
          </Button>
          <Button
            variant="ghost"
            className="hidden rounded-none bg-white focus-visible:z-10 active:z-10 sm:flex"
            size="icon"
            onClick={() => map.zoomIn()}
          >
            <Plus className="h-5" />
          </Button>
          <Button
            variant="ghost"
            className="hidden rounded-none rounded-b-md bg-white focus-visible:z-10 active:z-10 sm:flex"
            size="icon"
            onClick={() => map.zoomOut()}
          >
            <Minus className="h-5" />
          </Button>
        </div>
      </div>
    </>
  );
};
export default MapControls;
