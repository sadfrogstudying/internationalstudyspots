import type { UseFormReturn } from "react-hook-form";

import type { CreateSpotFormValues } from "@/schemas";

import TextInput from "@/components/input/text-input";
import CheckboxInput from "@/components/input/checkbox-input";
import ImageInput from "@/components/input/image-input";

export default function InputsRequired({
  form,
}: {
  form: UseFormReturn<CreateSpotFormValues>;
}) {
  return (
    <>
      <TextInput
        name="name"
        control={form.control}
        input={{
          label: "Name",
          description: "What is the name of this spot?",
          placeholder: "WultuhWhite",
          required: true,
        }}
      />

      <TextInput
        name="venueType"
        control={form.control}
        input={{
          label: "Venue Type",
          description: "What is the venue type of this spot?",
          placeholder: "Cafe",
          required: true,
        }}
      />

      <ImageInput
        name="images"
        control={form.control}
        input={{
          label: "Profile Image",
          description: "Upload a profile image",
          required: false,
        }}
        maxFiles={8}
      />

      <CheckboxInput
        name="wifi"
        control={form.control}
        input={{
          label: "Wifi",
          description: "Does this spot have wifi?",
          required: true,
        }}
      />

      <CheckboxInput
        name="powerOutlets"
        control={form.control}
        input={{
          label: "Power Outlets",
          description: "Does this spot have power outlets?",
          required: true,
        }}
      />
    </>
  );
}
