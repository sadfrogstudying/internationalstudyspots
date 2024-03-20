import { cn } from "@/lib/utils";
import {
  Button,
  GridListItem,
  Text,
  type GridListItemProps,
} from "react-aria-components";
import { type ListData } from "react-stately";
import RacCheckbox from "../../ui/rac-checkbox";
import Image from "next/image";

interface ImageItem {
  id: number;
  name: string;
  featured: boolean;
  url: string;
  delete?: boolean;
}

export default function ImageInputRow({
  item,
  list,
  index,
  featuredCount,
  interactionDisabled,
  children,
}: {
  item: ImageItem;
  list: ListData<ImageItem>;
  index: number;
  featuredCount: number;
  interactionDisabled?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <MyItem textValue={item.name} id={item.id}>
      <div className="relative aspect-square w-14 min-w-0 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
        <Image
          src={item.url}
          alt={item.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex flex-col items-start truncate">
        <Text className="sr-only truncate" slot="description">
          Image {index}
        </Text>
        <RacCheckbox
          slot={null}
          isSelected={item.featured}
          isDisabled={
            ((!item.featured && featuredCount > 3) || interactionDisabled) ??
            item.delete
          }
          onChange={() => {
            const currentValue = list.getItem(item.id);
            const newValue = {
              ...currentValue,
              featured: !currentValue.featured,
            };
            list.update(item.id, newValue);
          }}
        >
          Featured
        </RacCheckbox>
      </div>

      {children}
    </MyItem>
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
          `flex items-center gap-2 rounded-sm p-2`,
          isDragging && "bg-fuchsia-50 opacity-40",
          isFocused && "bg-green-50",
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
            <RacCheckbox slot="selection" />
          )}
          {children}
        </>
      )}
    </GridListItem>
  );
}
