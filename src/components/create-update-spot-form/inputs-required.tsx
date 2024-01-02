import type { UseFormReturn } from "react-hook-form";

import type { CreateUpdateFormValues } from "@/schemas";

import TextInput from "@/components/input/text-input";
import CheckboxInput from "@/components/input/checkbox-input";
import ImageInput from "@/components/input/image-input";
import { DropzoneLabel } from "../ui/dropzone";

export default function InputsRequired({
  form,
}: {
  form: UseFormReturn<CreateUpdateFormValues>;
}) {
  return (
    <>
      <TextInput
        name="name"
        control={form.control}
        input={{
          label: "Name",
          description: "What is the name of this spot?",
          placeholder: "Leible",
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
        name="images.newImages"
        control={form.control}
        input={{
          label: "Images",
          description: "Upload some images",
          required: false,
        }}
        maxFiles={8}
      >
        <DropzoneLabel className="truncate" />
      </ImageInput>

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
