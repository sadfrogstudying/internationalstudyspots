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
import { Input } from "@/components/ui/input";

interface Input {
  label: string;
  description: string;
  placeholder: string;
  required: boolean;
}

export default function TextInput<
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
            <Input
              role="textbox"
              placeholder={input.placeholder}
              {...field}
              required={input.required}
            />
          </FormControl>
          <FormDescription>{input.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
