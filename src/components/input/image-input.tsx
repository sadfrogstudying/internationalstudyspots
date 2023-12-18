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
import Dropzone, { type DropzoneProps } from "@/components/ui/dropzone";

interface Input {
  label: string;
  description: string;
  required: boolean;
}

type DropzonePropsForwarded = Omit<DropzoneProps, "onChange">;

export default function ImageInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  input,
  dragLabel,
  className,
  labelClassName,
  overlayPreview,
  maxFiles,
  defaultImage,
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  input: Input;
} & DropzonePropsForwarded) {
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
              dragLabel={dragLabel}
              className={className}
              labelClassName={labelClassName}
              maxFiles={maxFiles}
              overlayPreview={overlayPreview}
              defaultImage={defaultImage}
            />
          </FormControl>
          <FormDescription>{input.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
