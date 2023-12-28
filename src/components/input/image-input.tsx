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
import { type DropzoneProps, Dropzone } from "@/components/ui/dropzone";

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
  className,
  maxFiles,
  children,
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  input: Input;
} & DropzonePropsForwarded) {
  return (
    <FormField
      key={`input-${props.name}`}
      control={props.control}
      name={props.name}
      render={({ field }) => {
        return (
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
                className={className}
                maxFiles={maxFiles}
              >
                {children}
              </Dropzone>
            </FormControl>
            <FormDescription>{input.description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
