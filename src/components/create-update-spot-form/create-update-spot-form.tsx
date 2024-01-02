"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { type CreateUpdateFormValues, createUpdateFormSchema } from "@/schemas";

import { Accordion } from "@/components/ui/accordion";
import InputsRequired from "@/components/create-update-spot-form/inputs-required";
import InputsLocation from "@/components/create-update-spot-form/inputs-location";
import InputsGeneral from "@/components/create-update-spot-form/inputs-general";
import ImageManager from "@/components/create-update-spot-form/image-manager";
import { AccordionItem } from "@/components/form/accordion-item";
import InputGrid from "@/components/form/input-grid";
import type { RouterOutputs } from "@/trpc/shared";

export default function CreateUpdateSpotForm({
  onSubmit,
  buttonLabel = "Submit",
  submitDisabled = false,
  initialValues,
}: {
  onSubmit: (formValues: CreateUpdateFormValues) => void;
  buttonLabel?: string;
  submitDisabled?: boolean;
  /** Only for update mode */
  initialValues?: RouterOutputs["studySpot"]["bySlug"];
}) {
  const form = useForm<CreateUpdateFormValues>({
    resolver: zodResolver(createUpdateFormSchema),
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
      images: {
        newImages: [],
        existingImages: [],
      },
    },
    ...(initialValues && {
      values: {
        ...initialValues,
        canStudyForLong: initialValues.canStudyForLong ?? undefined,
        sunlight: initialValues.sunlight ?? undefined,
        drinks: initialValues.drinks ?? undefined,
        food: initialValues.food ?? undefined,
        naturalViews: initialValues.naturalViews ?? undefined,
        images: {
          existingImages: initialValues.images.map((image) => ({
            ...image,
            delete: false,
          })),
          newImages: [],
        },
      },
    }),
  });

  console.log(form.formState.errors);

  function handleSubmit(formValues: CreateUpdateFormValues) {
    onSubmit(formValues);
  }

  const images = form.watch("images");
  const featuredCount = getTotalFeaturedCount(images);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex-gap-2 flex flex-col"
      >
        <Accordion type="multiple" className="w-full">
          <h2 className="py-4 text-lg font-bold">Required 🚨</h2>
          <InputGrid>
            <InputsRequired form={form} />
          </InputGrid>

          <h2 className="py-4 text-lg font-bold">Images 🌅</h2>
          <div className="rounded border border-l-4 border-neutral-400">
            <div className="flex flex-col gap-4 p-4">
              <ImageManager form={form} featuredCount={featuredCount} />
            </div>
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

function getTotalFeaturedCount(images: CreateUpdateFormValues["images"]) {
  const newImageFeaturedCount = images.newImages.reduce(
    (count, image) => (image.featured ? count + 1 : count),
    0,
  );

  const existingImageFeaturedCount = images.existingImages.reduce(
    (count, image) => (image.featured ? count + 1 : count),
    0,
  );

  return newImageFeaturedCount + existingImageFeaturedCount;
}
