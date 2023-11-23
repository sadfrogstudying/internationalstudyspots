"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormReturn, useForm } from "react-hook-form";
import type z from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { createSpotSchemaClient } from "@/schemas";
import TextInput from "@/components/input/text-input";
import ImageInput from "@/components/input/image-input";
import CheckboxInput from "@/components/input/checkbox-input";
import TextAreaInput from "@/components/input/textarea-input";
import { AccordionItem } from "../form/accordion-item";
import inputs, { type Input } from "./form-config";
import { Accordion } from "../ui/accordion";

import dynamic from "next/dynamic";
import { Label } from "../ui/label";

const LocationSearchInput = dynamic(
  () => import("@/components/input/location-search"),
  { ssr: false, loading: () => <LocationSearchLoading /> },
);

const LocationSearchLoading = () => (
  <div className="space-y-2">
    <Label asChild>
      <div>Search Location</div>
    </Label>
    <Button variant="outline" className="w-full justify-between">
      Loading...
    </Button>
  </div>
);

type CreateSpotFormValues = z.infer<typeof createSpotSchemaClient>;

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
                      return GenerateInput(input, form);
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
                    return GenerateInput(input, form);
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

export function GenerateInput(
  input: Input,
  form: UseFormReturn<CreateSpotFormValues>,
) {
  if (input.inputType === "text")
    return (
      <TextInput
        key={`input-${input.name}`}
        input={{
          label: input.label,
          description: input.description,
          placeholder: input.placeholder,
          required: input.required,
        }}
        name={input.name}
        {...form}
      />
    );
  if (input.inputType === "image")
    return (
      <ImageInput
        key={`input-${input.name}`}
        input={{
          label: input.label,
          description: input.description,
          required: input.required,
        }}
        name={input.name}
        {...form}
      />
    );
  if (input.inputType === "checkbox")
    return (
      <CheckboxInput
        key={`input-${input.name}`}
        input={{
          label: input.label,
          description: input.description,
          required: input.required,
        }}
        name={input.name}
        {...form}
      />
    );
  if (input.inputType === "locationSearch")
    return (
      <LocationSearchInput
        key={`input-locationSearch`}
        onSelectedPlaceReady={() => console.log("READY")}
      />
    );
  if (input.inputType === "textarea")
    return (
      <TextAreaInput
        key={`input-${input.name}`}
        input={{
          label: input.label,
          description: input.description,
          placeholder: input.placeholder,
          required: input.required,
        }}
        name={input.name}
        {...form}
      />
    );
  return (
    <LocationSearchInput
      key={`input-locationSearch`}
      onSelectedPlaceReady={() => console.log("READY")}
    />
  );
}
