import dynamic from "next/dynamic";
import type { SetValueConfig, UseFormReturn } from "react-hook-form";

import type { CreateUpdateFormValues } from "@/schemas";

import TextInput from "@/components/input/text-input";
import { Skeleton } from "../ui/skeleton";

const LocationSearchInput = dynamic(
  () => import("@/components/input/location-search"),
  { ssr: false, loading: () => <Skeleton className="h-9 w-full" /> },
);

export default function InputsLocation({
  form,
}: {
  form: UseFormReturn<CreateUpdateFormValues>;
}) {
  function onSelectedPlaceReady(place: google.maps.places.PlaceResult) {
    const {
      place_id,
      address_components,
      formatted_address,
      geometry,
      website,
    } = place;

    const setValueOptions: SetValueConfig = {
      shouldTouch: true,
    };

    address_components?.forEach((address) => {
      if (address.types.includes("locality"))
        form.setValue("city", address.long_name);
      if (address.types.includes("country"))
        form.setValue("country", address.long_name);
      if (address.types.includes("administrative_area_level_1"))
        form.setValue("state", address.long_name);
    });

    const formVals = form.getValues();

    form.setValue("placeId", place_id, setValueOptions);
    form.setValue("latitude", geometry?.location?.lat(), setValueOptions);
    form.setValue("longitude", geometry?.location?.lng(), setValueOptions);
    form.setValue("address", formatted_address, setValueOptions);
    formVals.website === "" &&
      website &&
      website?.length < 100 &&
      form.setValue("website", website, setValueOptions);
  }

  return (
    <>
      <LocationSearchInput onSelectedPlaceReady={onSelectedPlaceReady} />

      <TextInput
        name="placeId"
        control={form.control}
        input={{
          label: "Place ID",
          description: "What is the place ID of this spot?",
          placeholder: "",
          required: false,
        }}
      />

      <TextInput
        name="address"
        control={form.control}
        input={{
          label: "Address",
          description: "What is the address of this spot?",
          placeholder: "1234 Main St",
          required: false,
        }}
      />

      <TextInput
        name="country"
        control={form.control}
        input={{
          label: "Country",
          description: "What is the country of this spot?",
          placeholder: "United States",
          required: false,
        }}
      />

      <TextInput
        name="city"
        control={form.control}
        input={{
          label: "City",
          description: "What is the city of this spot?",
          placeholder: "San Francisco",
          required: false,
        }}
      />

      <TextInput
        name="state"
        control={form.control}
        input={{
          label: "State",
          description: "What is the state of this spot?",
          placeholder: "California",
          required: false,
        }}
      />
    </>
  );
}
