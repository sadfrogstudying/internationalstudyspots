"use client";

import { useEffect, useState } from "react";
import { ChevronsUpDown, MapPinIcon } from "lucide-react";

import Script from "next/script";
import { env } from "@/env";
import useGooglePlaces from "@/hooks/use-google-places";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { AutocompletePrediction } from "@/types/google-types";
import { Label } from "../ui/label";

interface Props {
  onSelectedPlaceReady: (place: google.maps.places.PlaceResult) => void;
}

const LocationSearchInput = ({ onSelectedPlaceReady }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<AutocompletePrediction>();
  const {
    setScriptReady,
    libraryReady,
    placesDivRef,
    onChange,
    onSelect,
    inputValue,
    predictions,
    selectedPlace,
  } = useGooglePlaces();

  useEffect(() => {
    if (selectedPlace) onSelectedPlaceReady(selectedPlace);
  }, [selectedPlace, onSelectedPlaceReady]);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`}
        onReady={() => {
          setScriptReady(true);
        }}
      />
      <div className="space-y-2">
        <Label asChild>
          <div className="font-medium">Search Location</div>
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between font-normal"
            >
              {selectedPlace ? (
                <span className="flex items-center truncate">
                  <MapPinIcon className={cn("mr-2 h-4 w-4 shrink-0")} />
                  <strong className="mr-2">
                    {value?.structured_formatting.main_text}
                  </strong>
                  <span className="truncate font-normal">
                    {value?.structured_formatting.secondary_text}
                  </span>
                </span>
              ) : (
                "Enter location..."
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
          >
            <Command loop>
              <CommandInput
                placeholder={
                  !libraryReady ? "Loading..." : "Search location..."
                }
                onValueChange={(val) => onChange(val)}
                value={inputValue}
                disabled={!libraryReady}
              />

              {inputValue.length > 0 && (
                <CommandEmpty>No locations found.</CommandEmpty>
              )}

              {predictions.length > 0 && (
                <CommandGroup>
                  {predictions.map((prediction) => {
                    return (
                      <CommandItem
                        key={
                          prediction.structured_formatting.main_text +
                          prediction.structured_formatting.secondary_text +
                          inputValue
                        }
                        value={
                          prediction.structured_formatting.main_text +
                          prediction.structured_formatting.secondary_text +
                          inputValue
                        }
                        onSelect={() => {
                          setValue(prediction);
                          onSelect(prediction.place_id);
                          setOpen(false);
                        }}
                        className="truncate"
                      >
                        <MapPinIcon
                          className={cn(
                            "mr-2 h-4 w-4 shrink-0",
                            prediction.place_id === value?.place_id
                              ? "opacity-100"
                              : "opacity-20",
                          )}
                        />
                        <strong className="mr-2">
                          {prediction.structured_formatting.main_text}
                        </strong>
                        <div className="truncate">
                          {prediction.structured_formatting.secondary_text}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}

              <Image
                src="/powered_by_google.png"
                alt="Powered by Google"
                width="120"
                height="14"
                className="ml-auto mr-2 pb-2 pt-4"
              />
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div
        className="absolute bottom-0 left-0 m-0 h-0 w-0"
        ref={placesDivRef}
      ></div>
    </>
  );
};

export default LocationSearchInput;
