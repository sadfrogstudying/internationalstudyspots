import { cn } from "@/lib/utils";
import { GridList, type GridListProps } from "react-aria-components";

export default function RacGridList<T extends object>({
  children,
  className,
  ...props
}: GridListProps<T>) {
  return (
    <GridList
      {...props}
      className={({ isDropTarget, isFocusVisible }) =>
        cn(
          `max-h-96 overflow-scroll rounded-sm p-2`,
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
