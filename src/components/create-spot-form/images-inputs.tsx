import { type createSpotSchemaClient } from "@/schemas";
import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Dropzone from "../ui/dropzone";
import { cn } from "@/lib/utils";

type CreateSpotFormValues = z.infer<typeof createSpotSchemaClient>;

const imageInputs = [
  {
    name: "images",
    label: "Images",
    description: "Images of the spot.",
    required: true,
  },
] as const;

export default function ImageInputs({
  form,
}: {
  form: UseFormReturn<CreateSpotFormValues>;
}) {
  return (
    <>
      {imageInputs.map((input) => (
        <FormField
          key={`input-${input.name}`}
          control={form.control}
          name={input.name}
          render={({ field }) => (
            <FormItem
              className={cn(
                Object.hasOwn(input, "required") &&
                  "rounded border border-violet-300 p-4",
              )}
            >
              <FormLabel className="flex w-full items-center justify-between">
                {input.label}
                {Object.hasOwn(input, "required") && (
                  <span className="rounded bg-violet-300 px-2 text-sm text-primary">
                    Required
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
      ))}
    </>
  );
}
