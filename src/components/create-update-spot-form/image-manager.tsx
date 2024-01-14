"use client";

import Image from "next/image";
import {
  Controller,
  type ControllerRenderProps,
  type UseFormReturn,
} from "react-hook-form";
import { MAX_FEATURED_IMAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type {
  CreateUpdateFormValues,
  ExistingImagePayload,
  NewImagePayload,
} from "@/schemas";

import { DropzoneLabel, useImagePreviews } from "@/components/ui/dropzone";
import ImageInput from "@/components/input/image-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

/** Return dropzone files, else fallback, else null. */
export default function ImageManager({
  form,
  featuredCount,
}: {
  form: UseFormReturn<CreateUpdateFormValues>;
  featuredCount: number;
}) {
  const tooManyFeatured = featuredCount >= MAX_FEATURED_IMAGES;

  return (
    <>
      <ImageInput
        name="images.newImages"
        control={form.control}
        input={{
          label: "Images",
          description: "Upload some images",
          required: true,
        }}
        transformValue={(files) =>
          files.map((file) => ({ file, featured: false }))
        }
        maxFiles={8}
      >
        <DropzoneLabel className="truncate" />
      </ImageInput>

      <Controller
        control={form.control}
        name="images.newImages"
        render={({ field }) => (
          <NewImages field={field} tooManyFeatured={tooManyFeatured} />
        )}
      />

      <Controller
        control={form.control}
        name="images.existingImages"
        render={({ field }) => (
          <ExistingImages field={field} tooManyFeatured={tooManyFeatured} />
        )}
      />
    </>
  );
}

function NewImages({
  field,
  tooManyFeatured,
}: {
  field: ControllerRenderProps<CreateUpdateFormValues, "images.newImages">;
  tooManyFeatured: boolean;
}) {
  const newImagePreviews = useImagePreviews(
    field.value.map((image) => image.file),
  );

  if (!newImagePreviews.length) return <></>;

  return (
    <ScrollArea className="h-96 w-full rounded border border-l-4 border-neutral-300 text-sm">
      <div className="flex flex-col gap-4 p-4">
        <h3 className="text-base font-bold">New</h3>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
          {newImagePreviews.map(({ preview }, index) => {
            const fieldValueItem = field.value[index];
            if (!fieldValueItem) return;
            const isFeatured = fieldValueItem.featured;
            const featuredDisabled = tooManyFeatured && !isFeatured;

            return (
              <div
                key={`newimagepreview-${index}`}
                className="relative flex flex-col gap-2"
              >
                <img src={preview} alt="New image" className="rounded" />

                <div className="flex flex-col gap-2">
                  <label
                    className={cn(
                      "flex items-center gap-2 rounded border border-dashed bg-neutral-50 px-2 py-1",
                      featuredDisabled && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <Checkbox
                      checked={isFeatured}
                      disabled={featuredDisabled}
                      onCheckedChange={(e) => {
                        const newImages: NewImagePayload[] = [...field.value];

                        const toChange = newImages.find((_, i) => i === index);

                        if (!toChange) return;
                        if (e === "indeterminate") return;

                        toChange.featured = e;

                        field.onChange(newImages);
                      }}
                    />
                    Featured
                  </label>

                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-1 top-1"
                    type="button"
                    onClick={() => {
                      const newImages = field.value.filter(
                        (_, i) => i !== index,
                      );

                      field.onChange(newImages);
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}

function ExistingImages({
  field,
  tooManyFeatured,
}: {
  field: ControllerRenderProps<CreateUpdateFormValues, "images.existingImages">;
  tooManyFeatured: boolean;
}) {
  if (!field.value?.length) return <></>;

  return (
    <ScrollArea className="h-96 w-full rounded border border-l-4 border-neutral-300 text-sm">
      <div className="flex flex-col gap-4 p-4">
        <h3 className="text-base font-bold">Existing</h3>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
          {field.value?.map(({ url }, index) => {
            const fieldValueItem = field.value.find(
              (image) => image.url === url,
            );

            if (!fieldValueItem) return null;

            const isFeatured = fieldValueItem.featured;
            const toDelete = fieldValueItem.delete;
            const featuredDisabled = tooManyFeatured && !isFeatured;

            return (
              <div key={url} className="flex flex-col gap-2">
                <div className="relative aspect-square">
                  <Image
                    src={url}
                    alt="Existing image"
                    className={cn(
                      "rounded object-contain",
                      toDelete && "opacity-50",
                    )}
                    fill
                    sizes="(max-width: 767px) 50vw, (max-width: 1023px) 25vw, 16vw"
                    priority={index < 5}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    className={cn(
                      "flex items-center gap-2 rounded border border-dashed bg-neutral-50 px-2 py-1",
                      featuredDisabled && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <Checkbox
                      checked={isFeatured}
                      disabled={toDelete || featuredDisabled}
                      onCheckedChange={(e) => {
                        const newImages: ExistingImagePayload[] = [
                          ...field.value,
                        ];

                        const toChange = newImages.find((_, i) => i === index);

                        if (!toChange) return;
                        if (e === "indeterminate") return;

                        toChange.featured = e;

                        field.onChange(newImages);
                      }}
                    />
                    Featured
                  </label>

                  <label className="flex items-center gap-2 rounded border border-dashed bg-neutral-50 px-2 py-1">
                    <Checkbox
                      checked={toDelete}
                      onCheckedChange={(e) => {
                        const newImages: ExistingImagePayload[] = [
                          ...field.value,
                        ];

                        const toChange = newImages.find((_, i) => i === index);

                        if (!toChange) return;
                        if (e === "indeterminate") return;

                        toChange.delete = e;

                        field.onChange(newImages);
                      }}
                    />
                    Delete
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}
