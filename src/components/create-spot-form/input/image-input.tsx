import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import Dropzone from "@/components/ui/dropzone";

interface Input {
  label: string;
  description: string;
  required: boolean;
}

export default function ImageInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  input,
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  input: Input;
}) {
  return (
    <FormField
      key={`input-${props.name}`}
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex gap-1">
            {input.label}

            {input.required && (
              <span className="text-orange-500" aria-hidden>
                *
              </span>
            )}
          </FormLabel>
          <FormControl>
            <Dropzone
              ref={field.ref}
              onChange={(files) => field.onChange(files)}
              name={field.name}
            />
          </FormControl>
          <FormDescription>{input.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
