"use client";

import React, { useEffect } from "react";

import { useDragAndDrop } from "react-aria-components";

// Manages state for an immutable list data structure,
// and provides convenience methods to update the data over time.
// This uses useListData from React Stately to manage the item list.
// Note that useListData is a convenience hook, not a requirement.
// You can manage your state however you wish.
import { useListData } from "react-stately";

import { withErrorBoundary } from "react-error-boundary";
import { type ControllerRenderProps } from "react-hook-form";
import RacCheckbox from "@/components/ui/rac-checkbox";
import RacGridList from "@/components/ui/rac-grid-list";
import ImageInputRow from "../image-input-row";

interface ImageItem {
  id: number;
  name: string;
  featured: boolean;
  url: string;
  delete: boolean;
}

type OnChange = ControllerRenderProps["onChange"];

function ExistingImageInputImplementationComponent({
  onChange,
  value,
  featuredCount,
}: {
  onChange: OnChange;
  value: ImageItem[];
  featuredCount: number;
}) {
  const list = useListData<ImageItem>({
    initialItems: value,
  });

  useEffect(() => {
    onChange(list.items);
  }, [list.items, onChange]);

  const { dragAndDropHooks } = useDragAndDrop({
    getDropOperation(_, types) {
      return types.has("image/png") || types.has("image/jpeg")
        ? "copy"
        : "cancel";
    },
  });

  return (
    <div className="flex flex-col gap-4 text-sm">
      <RacGridList
        aria-label="Images"
        selectionMode="none"
        items={list.items}
        dragAndDropHooks={dragAndDropHooks}
        disabledBehavior="all"
        className="border border-black"
      >
        {list.items.map((item, i) => (
          <ImageInputRow
            key={item.id}
            item={item}
            list={list}
            index={i}
            featuredCount={featuredCount}
          >
            <RacCheckbox
              className="ml-auto"
              slot={null}
              isSelected={item.delete}
              onChange={() => {
                const currentValue = list.getItem(item.id);

                list.update(item.id, {
                  ...currentValue,
                  featured: false,
                  delete: !currentValue.delete,
                });
              }}
            >
              Delete
            </RacCheckbox>
          </ImageInputRow>
        ))}
      </RacGridList>
    </div>
  );
}

const ExistingImageInputImplementation = withErrorBoundary(
  ExistingImageInputImplementationComponent,
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

export default ExistingImageInputImplementation;
