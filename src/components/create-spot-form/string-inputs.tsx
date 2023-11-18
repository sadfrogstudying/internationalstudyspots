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
import { cn } from "@/lib/utils";

type CreateSpotFormValues = z.infer<typeof createSpotSchemaClient>;

const stringInputs = [
  {
    name: "name",
    label: "Name",
    description: "What is the name of this spot?",
    placeholder: "John Doe",
    required: true,
  },
  {
    name: "website",
    label: "Website",
    description: "What is the website of this spot?",
    placeholder: "https://example.com",
  },
  {
    name: "description",
    label: "Description",
    description: "What is the description of this spot?",
    placeholder: "A nice spot to study.",
  },
  {
    name: "noiseLevel",
    label: "Noise Level",
    description: "What is the noise level of this spot?",
    placeholder: "Low",
  },
  {
    name: "venueType",
    label: "Venue Type",
    description: "What is the venue type of this spot?",
    placeholder: "Cafe",
  },
  {
    name: "placeId",
    label: "Place ID",
    description: "What is the place ID of this spot?",
    placeholder: "",
  },
  {
    name: "address",
    label: "Address",
    description: "What is the address of this spot?",
    placeholder: "1234 Main St",
  },
  {
    name: "country",
    label: "Country",
    description: "What is the country of this spot?",
    placeholder: "United States",
  },
  {
    name: "city",
    label: "City",
    description: "What is the city of this spot?",
    placeholder: "San Francisco",
  },
  {
    name: "state",
    label: "State",
    description: "What is the state of this spot?",
    placeholder: "California",
  },
  {
    name: "comfort",
    label: "Comfort",
    description: "What is the comfort of this spot?",
    placeholder: "Comfortable",
  },
  {
    name: "views",
    label: "Views",
    description: "What are the views of this spot?",
    placeholder: "Nice",
  },
  {
    name: "temperature",
    label: "Temperature",
    description: "What is the temperature of this spot?",
    placeholder: "Warm",
  },
  {
    name: "music",
    label: "Music",
    description: "What is the music of this spot?",
    placeholder: "None",
  },
  {
    name: "lighting",
    label: "Lighting",
    description: "What is the lighting of this spot?",
    placeholder: "Bright",
  },
  {
    name: "distractions",
    label: "Distractions",
    description: "What are the distractions of this spot?",
    placeholder: "None",
  },
  {
    name: "crowdedness",
    label: "Crowdedness",
    description: "What is the crowdedness of this spot?",
    placeholder: "Not crowded",
  },
  {
    name: "proximityToAmenities",
    label: "Proximity To Amenities",
    description: "What is the proximity to amenities of this spot?",
    placeholder: "Close",
  },
  {
    name: "studyBreakFacilities",
    label: "Study Break Facilities",
    description: "What are the study break facilities of this spot?",
    placeholder: "None",
  },
] as const;

export default function StringInputs({
  form,
}: {
  form: UseFormReturn<CreateSpotFormValues>;
}) {
  return (
    <>
      {stringInputs.map((input) => (
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
                <Input placeholder={input.placeholder} {...field} />
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
