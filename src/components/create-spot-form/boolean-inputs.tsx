import { type createSpotSchemaClient } from "@/schemas";
import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";

type CreateSpotFormValues = z.infer<typeof createSpotSchemaClient>;

const booleanInputs = [
  {
    name: "wifi",
    label: "Wifi",
    description: "Does this spot have wifi?",
  },
  {
    name: "powerOutlets",
    label: "Power Outlets",
    description: "Does this spot have power outlets?",
  },
  {
    name: "canStudyForLong",
    label: "Study for long",
    description: "Can you study for long?",
  },
  {
    name: "sunlight",
    label: "Sunlight",
    description: "Is there adequate sunlight?",
  },
  {
    name: "drinks",
    label: "Drinks",
    description: "Can you buy drinks?",
  },
  {
    name: "food",
    label: "Food",
    description: "Can you buy food?",
  },
  {
    name: "naturalViews",
    label: "Natural Views",
    description: "Can you see nature?",
  },
] as const;

export default function BooleanInputs({
  form,
}: {
  form: UseFormReturn<CreateSpotFormValues>;
}) {
  return (
    <>
      {booleanInputs.map((input) => (
        <FormField
          key={`input-${input.name}`}
          control={form.control}
          name={input.name}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{input.label}</FormLabel>
                <FormDescription>{input.description}</FormDescription>
              </div>
            </FormItem>
          )}
        />
      ))}
    </>
  );
}
