import { cn } from "@/lib/utils";
import { Checkbox, type CheckboxProps } from "react-aria-components";

export default function RacCheckbox({
  children,
  className,
  ...props
}: CheckboxProps) {
  return (
    <Checkbox
      {...props}
      className={({ isDisabled }) =>
        cn(
          "flex items-center justify-center gap-2",
          isDisabled && "cursor-not-allowed opacity-75",
          className,
        )
      }
    >
      {({ isIndeterminate, isSelected, isFocusVisible }) => (
        <>
          <div
            className={cn(
              "h-4 w-4 rounded border bg-neutral-100 fill-none stroke-none stroke-[3px] p-[1px]",
              isFocusVisible && "ring",
              (isIndeterminate || isSelected) &&
                "border-purple-500 bg-purple-500 stroke-white",
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
