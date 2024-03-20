"use client";

import React, { useEffect, useState } from "react";

import { Button, FileTrigger } from "react-aria-components";
import { isFileDropItem, useDragAndDrop } from "react-aria-components";
import { UploadIcon } from "@radix-ui/react-icons";

// Manages state for an immutable list data structure,
// and provides convenience methods to update the data over time.
// This uses useListData from React Stately to manage the item list.
// Note that useListData is a convenience hook, not a requirement.
// You can manage your state however you wish.
import { useListData } from "react-stately";

import { cn } from "@/lib/utils";
import useImageCompression from "@/hooks/use-image-compression";
import { withErrorBoundary } from "react-error-boundary";
import { X } from "lucide-react";
import { type ControllerRenderProps } from "react-hook-form";

import RacGridList from "@/components/ui/rac-grid-list";
import ImageInputRow from "../image-input-row";

const ALLOWED_TYPES = ["image/jpeg", "image/png"];

interface ImageItem {
  id: number;
  url: string;
  name: string;
  file: File;
  featured: boolean;
}

type OnChange = ControllerRenderProps["onChange"];

function NewImageInputV2ImplementationComponent({
  onChange,
  maxFiles = 1,
  featuredCount,
}: {
  onChange: OnChange;
  maxFiles?: number;
  featuredCount: number;
}) {
  const list = useListData<ImageItem>({
    initialItems: [],
  });

  useEffect(() => {
    // This should probably be passed in...
    const transformDataForForm = (items: ImageItem[]) => {
      const data = items.map((item) => ({
        file: item.file,
        featured: item.featured,
      }));

      return data;
    };

    console.log("items changed, changing RHF data");

    onChange(transformDataForForm(list.items));
  }, [list.items, onChange]);

  const [error, setError] = useState<string | null>(null);
  const { compressImages, isCompressing } = useImageCompression();

  async function confirmFormatCompressAndTransformImages(
    files: File[],
  ): Promise<ImageItem[]> {
    const areImages = files
      .map((file) => file.type)
      .every((type) => ALLOWED_TYPES.includes(type));

    if (!areImages) {
      setError("Only images allowed");
      return [];
    } else setError(null);

    const compressed = await compressImages(files);

    if (!compressed) return [];

    // TODO: better IDs
    return compressed.map((file) => ({
      id: Math.random(),
      url: URL.createObjectURL(file),
      name: file.name,
      file,
      featured: false,
    }));
  }

  const { dragAndDropHooks } = useDragAndDrop({
    onRootDrop: (e) => {
      if (isCompressing) return;

      if (e.items.length > maxFiles) return;

      void (async () => {
        const files = await Promise.all(
          e.items.filter(isFileDropItem).map(async (item) => {
            return await item.getFile();
          }),
        );

        const imageItems = await confirmFormatCompressAndTransformImages(files);
        list.insert(0, ...imageItems);
      })();
    },
    getDropOperation(_, types) {
      return types.has("image/png") || types.has("image/jpeg")
        ? "copy"
        : "cancel";
    },
  });

  return (
    <>
      {error && (
        <div className="text-sm text-red-500" role="alert">
          {error}
        </div>
      )}

      <div className="flex flex-col rounded border border-neutral-400 text-sm">
        <div className="border-b border-neutral-400">
          <FileTrigger
            acceptedFileTypes={["image/jpeg", "image/png"]}
            allowsMultiple
            onSelect={async (e) => {
              if (!e) return;
              if (e.length > maxFiles) return;
              const files = Array.from(e);
              const imageItems =
                await confirmFormatCompressAndTransformImages(files);
              list.append(...imageItems);
            }}
          >
            <Button
              className={`flex w-full items-center justify-center gap-2 rounded-sm rounded-b-none bg-neutral-100 px-4 py-2 font-bold text-neutral-600 hover:bg-neutral-200 active:bg-neutral-300 ${
                isCompressing ? "animate-pulse cursor-no-drop" : ""
              }`}
              isDisabled={isCompressing}
            >
              <UploadIcon className="shrink-0" /> Select files{" "}
              {isCompressing && (
                <span role="progressbar">(Compressing...)</span>
              )}
            </Button>
          </FileTrigger>
        </div>

        <RacGridList
          aria-label="Images"
          selectionMode="none"
          items={list.items}
          renderEmptyState={() => "Drop images here."}
          dragAndDropHooks={dragAndDropHooks}
          disabledBehavior="all"
          disabledKeys={isCompressing ? list.items.map(({ id }) => id) : []}
          className={cn(
            "rounded-t-none",
            isCompressing && "animate-pulse cursor-no-drop bg-yellow-400",
          )}
        >
          {list.items.map((item, i) => (
            <ImageInputRow
              index={i}
              featuredCount={featuredCount}
              key={item.id}
              item={item}
              interactionDisabled={isCompressing}
              list={list}
            >
              <button
                className="ml-auto flex aspect-square flex-shrink-0 items-center justify-center rounded p-1 hover:bg-neutral-200"
                disabled={isCompressing}
                onClick={() => {
                  if (isCompressing) return;
                  list.remove(item.id);
                  const toRemove = list.items.findIndex(
                    (target) => target.id === item.id,
                  );
                  const newList = [...list.items];
                  newList.splice(toRemove, 1);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </ImageInputRow>
          ))}
        </RacGridList>
      </div>
    </>
  );
}

const NewImageInputImplementation = withErrorBoundary(
  NewImageInputV2ImplementationComponent,
  {
    fallbackRender: ({ resetErrorBoundary }) => (
      <div
        className="flex flex-col gap-4 rounded border border-red-500 bg-red-100 p-4 text-sm text-red-500"
        role="alert"
      >
        <h3 className="text-lg font-semibold">Error</h3>
        Something unexpected went wrong with the image uploader.
        <button
          onClick={(e) => {
            e.preventDefault();
            resetErrorBoundary();
          }}
        >
          Try again
        </button>
      </div>
    ),
  },
);

export default NewImageInputImplementation;
