"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { createSpotSchemaClient } from "@/schemas";
import BooleanInputs from "./boolean-inputs";
import StringInputs from "./string-inputs";
import NumberInputs from "./number-inputs";
import ImageInputs from "./images.inputs";

type CreateSpotFormValues = z.infer<typeof createSpotSchemaClient>;

export default function CreateSpotForm({
  onSubmit,
}: {
  onSubmit: (formValues: CreateSpotFormValues) => void;
}) {
  const form = useForm<CreateSpotFormValues>({
    resolver: zodResolver(createSpotSchemaClient),
    defaultValues: {
      // string
      name: "",
      website: "",
      description: "",
      noiseLevel: "",
      venueType: "",
      placeId: "",
      address: "",
      country: "",
      city: "",
      state: "",
      comfort: "",
      views: "",
      temperature: "",
      music: "",
      lighting: "",
      distractions: "",
      crowdedness: "",
      proximityToAmenities: "",
      studyBreakFacilities: "",

      // number
      latitude: 0,
      longitude: 0,

      // boolean
      wifi: false,
      powerOutlets: false,
      canStudyForLong: undefined,
      sunlight: undefined,
      drinks: undefined,
      food: undefined,
      naturalViews: undefined,

      // images
      images: [],
    },
  });

  function handleSubmit(formValues: CreateSpotFormValues) {
    onSubmit(formValues);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StringInputs form={form} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NumberInputs form={form} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <BooleanInputs form={form} />
        </div>

        <div>
          <ImageInputs form={form} />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
