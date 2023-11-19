import { type createSpotSchemaClient } from "@/schemas";
import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";
import dynamic from "next/dynamic";
const LocationSearch = dynamic(
  () => import("@/components/create-spot-form/location-search"),
  {
    loading: () => <div></div>,
    ssr: false,
  },
);

type CreateSpotFormValues = z.infer<typeof createSpotSchemaClient>;

export default function LocationInputs({
  form,
}: {
  form: UseFormReturn<CreateSpotFormValues>;
}) {
  const onSelectedPlaceReady = () => {
    console.log("onSelectedPlaceReady");
  };

  return (
    <>
      <LocationSearch onSelectedPlaceReady={onSelectedPlaceReady} />
    </>
  );
}
