"use client";

import React, { useState } from "react";

import type {
  CheckboxProps,
  GridListItemProps,
  GridListProps,
} from "react-aria-components";
import { Checkbox, DropIndicator } from "react-aria-components";
import { Button, FileTrigger } from "react-aria-components";
import {
  GridList,
  GridListItem,
  Text,
  isFileDropItem,
  useDragAndDrop,
} from "react-aria-components";
import { UploadIcon } from "@radix-ui/react-icons";

// Manages state for an immutable list data structure,
// and provides convenience methods to update the data over time.
// This uses useListData from React Stately to manage the item list.
// Note that useListData is a convenience hook, not a requirement.
// You can manage your state however you wish.
import { useListData } from "react-stately";

import Image from "next/image";
import { cn } from "@/lib/utils";
import useImageCompression from "@/hooks/use-image-compression";
import { withErrorBoundary } from "react-error-boundary";
import { X } from "lucide-react";

const ALLOWED_TYPES = ["image/jpeg", "image/png"];

interface ImageItem {
  id: number;
  url: string;
  name: string;
  file: File;
}

// Users can
// - drop data on the list as a whole
// - reorder items

function ImageInputV2Component() {
  const list = useListData<ImageItem>({
    initialItems: [],
  });

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
    }));
  }

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => {
        const item = list.getItem(key);

        return {
          "text/plain": item.name,
        };
      }),
    onRootDrop: (e) => {
      if (isCompressing) return;

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
    onReorder(e) {
      if (e.target.dropPosition === "before") {
        list.moveBefore(e.target.key, e.keys);
      } else if (e.target.dropPosition === "after") {
        list.moveAfter(e.target.key, e.keys);
      }
    },
    getDropOperation(_, types) {
      return types.has("image/png") ||
        types.has("image/jpeg") ||
        types.has("text/plain")
        ? "copy"
        : "cancel";
    },
    renderDragPreview() {
      return (
        <div className="rounded bg-orange-500 px-2 text-white">
          I am the captain now
        </div>
      );
    },
    renderDropIndicator(target) {
      return (
        <DropIndicator target={target} className="relative w-full">
          {({ isDropTarget }) =>
            isDropTarget && (
              <div className="absolute left-0 top-0 -mt-[0.5px] flex w-full justify-center border-t border-green-500"></div>
            )
          }
        </DropIndicator>
      );
    },
  });

  return (
    <div className="flex flex-col gap-4 text-sm">
      <FileTrigger
        acceptedFileTypes={["image/jpeg", "image/png"]}
        allowsMultiple
        onSelect={async (e) => {
          if (!e) return;
          const files = Array.from(e);
          const imageItems =
            await confirmFormatCompressAndTransformImages(files);
          list.append(...imageItems);
        }}
      >
        <Button
          className={`flex w-fit items-center gap-2 rounded-md bg-neutral-100 px-4 py-1 font-bold text-neutral-600 hover:bg-neutral-50 active:bg-neutral-300 ${
            isCompressing ? "animate-pulse cursor-no-drop" : ""
          }`}
          isDisabled={isCompressing}
        >
          <UploadIcon className="shrink-0" /> Select files{" "}
          {isCompressing && "(Compressing...)"}
        </Button>
      </FileTrigger>

      {error && (
        <div className="text-red-600" role="alert">
          {error}
        </div>
      )}

      <MyGridList
        aria-label="Images"
        selectionMode="none"
        items={list.items}
        renderEmptyState={() => "Drop images here."}
        dragAndDropHooks={dragAndDropHooks}
        disabledBehavior="all"
        disabledKeys={isCompressing ? list.items.map(({ id }) => id) : []}
        className={cn(
          isCompressing && "animate-pulse cursor-no-drop bg-yellow-400",
          list.items.length > 0 && "bg-green-50",
        )}
      >
        {list.items.map((item) => (
          <MyItem textValue={item.name} key={item.id} id={item.id}>
            <div className="relative aspect-square w-14 min-w-0 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
              <Image
                src={item.url}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col truncate">
              <Text className="truncate font-bold" slot="description">
                {item.name}
              </Text>
              <span className="truncate">{item.id}</span>
            </div>
            <button
              className="ml-auto flex aspect-square flex-shrink-0 items-center justify-center rounded p-1 hover:bg-neutral-200"
              disabled={isCompressing}
              onClick={() => {
                if (isCompressing) return;
                list.remove(item.id);
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </MyItem>
        ))}
      </MyGridList>
    </div>
  );
}

function MyGridList<T extends object>({
  children,
  className,
  ...props
}: GridListProps<T>) {
  return (
    <GridList
      {...props}
      className={({ isDropTarget, isFocusVisible }) =>
        cn(
          `rounded-lg border border-black p-2`,
          className,
          isDropTarget && "bg-purple-300",
          isDropTarget && "bg-neutral-300",
          isFocusVisible && "ring-2",
        )
      }
    >
      {children}
    </GridList>
  );
}

function MyItem({ children, ...props }: Omit<GridListItemProps, "className">) {
  const textValue = typeof children === "string" ? children : undefined;

  return (
    <GridListItem
      textValue={textValue}
      {...props}
      className={({ isDragging, isFocused }) =>
        cn(
          `flex items-center gap-2 rounded-lg p-2`,
          isDragging && "bg-fuchsia-50 opacity-40",
          isFocused && "bg-green-100",
        )
      }
    >
      {({ selectionMode, selectionBehavior, allowsDragging }) => (
        <>
          {/* Add elements for drag and drop and selection. */}
          {allowsDragging && (
            <Button className="px-2" slot="drag">
              ≡
            </Button>
          )}
          {selectionMode === "multiple" && selectionBehavior === "toggle" && (
            <MyCheckbox slot="selection" />
          )}
          {children}
        </>
      )}
    </GridListItem>
  );
}

function MyCheckbox({ children, ...props }: CheckboxProps) {
  return (
    <Checkbox
      {...props}
      className={({ isIndeterminate, isSelected }) =>
        cn(
          "flex h-4 w-4 items-center justify-center rounded border bg-neutral-100",
          (isIndeterminate || isSelected) && "border-purple-500 bg-purple-500",
        )
      }
    >
      {({ isIndeterminate, isSelected }) => (
        <>
          <div
            className={cn(
              "h-3 w-3 fill-none stroke-none stroke-[3px]",
              (isIndeterminate || isSelected) && "stroke-white",
            )}
          >
            <svg viewBox="0 0 18 18" aria-hidden="true">
              {isIndeterminate ? (
                <rect x={1} y={7.5} width={15} height={3} />
              ) : (
                <polyline points="1 9 7 14 15 4" />
              )}
            </svg>
          </div>
          {children}
        </>
      )}
    </Checkbox>
  );
}

const ImageInputV2 = withErrorBoundary(ImageInputV2Component, {
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
});

export default ImageInputV2;
