import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import ExistingImageInputImplementation from "./implementation";

interface Input {
  label: string;
  description?: string;
  required: boolean;
}

export default function ExistingImageInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  input,
  featuredCount,
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  input: Input;
  featuredCount: number;
}) {
  return (
    <FormField
      key={`input-${props.name}`}
      control={props.control}
      name={props.name}
      render={({ field }) => {
        return (
          <FormItem className={"w-full"}>
            <div className="space-y-1 leading-none">
              <FormLabel className="flex gap-1">
                {input.label}
                {input.required && (
                  <span className="text-orange-500" aria-hidden>
                    *
                  </span>
                )}
              </FormLabel>
              {input.description && (
                <FormDescription>{input.description}</FormDescription>
              )}
            </div>
            <FormControl>
              <ExistingImageInputImplementation
                value={field.value}
                onChange={field.onChange}
                featuredCount={featuredCount}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
