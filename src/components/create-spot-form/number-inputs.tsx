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
import { Input } from "../ui/input";

type CreateSpotFormValues = z.infer<typeof createSpotSchemaClient>;

const numberInputs = [
  {
    name: "latitude",
    label: "Latitude",
    description: "Latitude of the spot.",
  },
  {
    name: "longitude",
    label: "Longitude",
    description: "Longitude of the spot.",
  },
] as const;

export default function NumberInputs({
  form,
}: {
  form: UseFormReturn<CreateSpotFormValues>;
}) {
  return (
    <>
      {numberInputs.map((input) => (
        <FormField
          key={`input-${input.name}`}
          control={form.control}
          name={input.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{input.label}</FormLabel>
              <FormControl>
                <Input type="number" placeholder={input.label} {...field} />
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
