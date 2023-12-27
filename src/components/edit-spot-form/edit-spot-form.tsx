"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { type UpdateSpotFormValues, updateSpotSchemaClient } from "@/schemas";
import type { RouterOutputs } from "@/trpc/shared";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AccordionItem } from "@/components/form/accordion-item";
import { Accordion } from "@/components/ui/accordion";
import InputsRequired from "@/components/edit-spot-form/inputs-required";
import InputsLocation from "@/components/edit-spot-form/inputs-location";
import InputsGeneral from "@/components/edit-spot-form/inputs-general";
import InputGrid from "@/components/form/input-grid";

export default function EditSpotForm({
  onSubmit,
  buttonLabel = "Submit",
  submitDisabled = false,
  initialValues,
}: {
  onSubmit: (formValues: UpdateSpotFormValues) => void;
  buttonLabel?: string;
  submitDisabled?: boolean;
  initialValues: NonNullable<RouterOutputs["studySpot"]["bySlug"]>;
}) {
  const form = useForm<UpdateSpotFormValues>({
    resolver: zodResolver(updateSpotSchemaClient),
    defaultValues: {
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
      latitude: 0,
      longitude: 0,
      wifi: false,
      powerOutlets: false,
      canStudyForLong: undefined,
      sunlight: undefined,
      drinks: undefined,
      food: undefined,
      naturalViews: undefined,
      images: [],

      // For update
      imagesToDelete: [],
      spotId: undefined,
    },
    values: {
      ...initialValues,
      spotId: initialValues.id,
      images: [],
      imagesToDelete: [],
      canStudyForLong: initialValues.canStudyForLong ?? undefined,
      sunlight: initialValues.sunlight ?? undefined,
      drinks: initialValues.drinks ?? undefined,
      food: initialValues.food ?? undefined,
      naturalViews: initialValues.naturalViews ?? undefined,
    },
  });

  function handleSubmit(formValues: UpdateSpotFormValues) {
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
