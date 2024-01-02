"use client";

import { useImagePreviews } from "@/components/ui/dropzone";
import { MAX_FEATURED_IMAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  CreateUpdateFormValues,
  ExistingImagePayload,
  NewImagePayload,
} from "@/schemas";
import { Controller, UseFormReturn } from "react-hook-form";

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
      <h2 className="text-lg font-bold">New Images</h2>
      <Controller
        control={form.control}
        name="images.newImages"
        render={({ field }) => {
          const newImagePreviews = useImagePreviews(
            field.value.map((image) => image.file),
          );

          return (
            <div className="grid grid-cols-4 gap-2 border border-orange-500 p-4">
              {newImagePreviews.map(({ preview }, index) => {
                const fieldValueItem = field.value[index];
                if (!fieldValueItem) return;
                const isFeatured = fieldValueItem.featured;
                const featuredDisabled = tooManyFeatured && !isFeatured;

                return (
                  <div key={`${name}-${index}`} className="flex flex-col gap-2">
                    <img src={preview} className="aspect-square object-cover" />

                    <div className="flex flex-col gap-2">
                      <label
                        className={cn(
                          "flex gap-2 border border-dashed bg-neutral-50 px-2",
                          featuredDisabled && "cursor-not-allowed opacity-50",
                        )}
                      >
                        <input
                          type="checkbox"
                          disabled={featuredDisabled}
                          checked={isFeatured}
                          onChange={(e) => {
                            const newImages: NewImagePayload[] = [
                              ...field.value,
                            ];

                            const toChange = newImages.find(
                              (_, i) => i === index,
                            );

                            if (!toChange) return;
                            toChange.featured = e.target.checked;

                            field.onChange(newImages);
                          }}
                        />
                        Featured
                      </label>

                      <button
                        className="flex gap-2 border border-dashed bg-neutral-50 px-2"
                        type="button"
                        onClick={() => {
                          const newImages = field.value.filter(
                            (_, i) => i !== index,
                          );

                          field.onChange(newImages);
                        }}
                      >
                        Remove image
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }}
      />

      <h2 className="text-lg font-bold">Existing Images</h2>
      <Controller
        control={form.control}
        name="images.existingImages"
        render={({ field }) => {
          return (
            <div className="grid grid-cols-4 gap-2 border border-orange-500 p-4">
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
                    <img src={url} className="aspect-square object-cover" />

                    <div className="flex flex-col gap-2">
                      <label
                        className={cn(
                          "flex gap-2 border border-dashed bg-neutral-50 px-2",
                          featuredDisabled && "cursor-not-allowed opacity-50",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isFeatured}
                          disabled={toDelete || featuredDisabled}
                          onChange={(e) => {
                            const newImages: ExistingImagePayload[] = [
                              ...field.value,
                            ];

                            const toChange = newImages.find(
                              (_, i) => i === index,
                            );

                            if (!toChange) return;
                            toChange.featured = e.target.checked;

                            field.onChange(newImages);
                          }}
                        />
                        Featured
                      </label>

                      <label className="flex gap-2 border border-dashed bg-neutral-50 px-2">
                        <input
                          type="checkbox"
                          checked={toDelete}
                          onChange={(e) => {
                            const newImages: ExistingImagePayload[] = [
                              ...field.value,
                            ];

                            const toChange = newImages.find(
                              (_, i) => i === index,
                            );

                            if (!toChange) return;
                            toChange.delete = e.target.checked;

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
          );
        }}
      />
    </>
  );
}
