"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { type CreateSpotFormValues, createSpotSchemaClient } from "@/schemas";

import { Accordion } from "@/components/ui/accordion";
import InputsRequired from "@/components/create-spot-form/inputs-required";
import InputsLocation from "@/components/create-spot-form/inputs-location";
import InputsGeneral from "@/components/create-spot-form/inputs-general";
import ImageManager from "@/components/create-spot-form/image-manager";
import { AccordionItem } from "@/components/form/accordion-item";
import InputGrid from "@/components/form/input-grid";

export default function CreateSpotFormV2({
  onSubmit,
  buttonLabel = "Submit",
  submitDisabled = false,
}: {
  onSubmit: (formValues: CreateSpotFormValues) => void;
  buttonLabel?: string;
  submitDisabled?: boolean;
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
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex-gap-2 flex flex-col"
      >
        <Accordion type="multiple" className="w-full">
          <InputGrid>
            <InputsRequired form={form} />
          </InputGrid>

          <div className="mt-4 grid grid-cols-4 gap-4">
            <ImageManager files={form.watch("images")} />
          </div>

          <AccordionItem label="Location 📍">
            <InputGrid>
              <InputsLocation form={form} />
            </InputGrid>
          </AccordionItem>

          <AccordionItem label="General 🤖">
            <InputGrid>
              <InputsGeneral form={form} />
            </InputGrid>
          </AccordionItem>
        </Accordion>

        <Button
          className="mt-4"
          type="submit"
          disabled={submitDisabled || !form.formState.isDirty}
        >
          {form.formState.isDirty ? buttonLabel : "No changes"}
        </Button>
      </form>
    </Form>
  );
}
