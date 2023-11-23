"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { type CreateSpotFormValues, createSpotSchemaClient } from "@/schemas";
import { AccordionItem } from "../form/accordion-item";
import inputs from "./form-config";
import { Accordion } from "../ui/accordion";
import { InputGenerator } from "../form/input-generator";

export default function CreateSpotFormV2({
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
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex-gap-2 flex flex-col"
      >
        <Accordion type="multiple" className="w-full">
          {inputs.map(({ inputs, category, hasAccordion }) => {
            return hasAccordion ? (
              <AccordionItem label={category} key={`accordion-${category}`}>
                <div className="rounded border border-neutral-400">
                  <div className="grid grid-cols-1 gap-4 border-l-4 border-neutral-400 p-4 sm:grid-cols-2 md:grid-cols-4">
                    {inputs.map((input) => {
                      return InputGenerator(input, form);
                    })}
                  </div>
                </div>
              </AccordionItem>
            ) : (
              <div
                className="rounded border border-neutral-400"
                key={`accordion-${category}`}
              >
                <div className="grid grid-cols-1 gap-4 border-l-4 border-neutral-400 p-4 sm:grid-cols-2 md:grid-cols-4">
                  {inputs.map((input) => {
                    return InputGenerator(input, form);
                  })}
                </div>
              </div>
            );
          })}
        </Accordion>

        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
