import type { UseFormReturn } from "react-hook-form";

import type { CreateSpotFormValues } from "@/schemas";

import TextInput from "@/components/input/text-input";
import TextAreaInput from "@/components/input/textarea-input";
import CheckboxInput from "@/components/input/checkbox-input";

export default function InputsGeneral({
  form,
}: {
  form: UseFormReturn<CreateSpotFormValues>;
}) {
  return (
    <>
      <TextInput
        name="website"
        control={form.control}
        input={{
          label: "Website",
          description: "What is the website of this spot?",
          placeholder: "https://example.com",
          required: false,
        }}
      />

      <TextInput
        name="noiseLevel"
        control={form.control}
        input={{
          label: "Noise Level",
          description: "What is the noise level of this spot?",
          placeholder: "Low",
          required: false,
        }}
      />

      <TextInput
        name="comfort"
        control={form.control}
        input={{
          label: "Comfort",
          description: "What is the comfort of this spot?",
          placeholder: "Comfortable",
          required: false,
        }}
      />

      <TextInput
        name="views"
        control={form.control}
        input={{
          label: "Views",
          description: "What are the views of this spot?",
          placeholder: "Nice",
          required: false,
        }}
      />

      <TextInput
        name="temperature"
        control={form.control}
        input={{
          label: "Temperature",
          description: "What is the temperature of this spot?",
          placeholder: "Warm",
          required: false,
        }}
      />

      <TextInput
        name="music"
        control={form.control}
        input={{
          label: "Music",
          description: "What is the music of this spot?",
          placeholder: "None",
          required: false,
        }}
      />

      <TextInput
        name="lighting"
        control={form.control}
        input={{
          label: "Lighting",
          description: "What is the lighting of this spot?",
          placeholder: "Bright",
          required: false,
        }}
      />

      <TextInput
        name="distractions"
        control={form.control}
        input={{
          label: "Distractions",
          description: "What are the distractions of this spot?",
          placeholder: "None",
          required: false,
        }}
      />

      <TextInput
        name="crowdedness"
        control={form.control}
        input={{
          label: "Crowdedness",
          description: "What is the crowdedness of this spot?",
          placeholder: "Not crowded",
          required: false,
        }}
      />

      <TextInput
        name="proximityToAmenities"
        control={form.control}
        input={{
          label: "Proximity To Amenities",
          description: "What is the proximity to amenities of this spot?",
          placeholder: "Close",
          required: false,
        }}
      />

      <TextInput
        name="studyBreakFacilities"
        control={form.control}
        input={{
          label: "Study Break Facilities",
          description: "What are the study break facilities of this spot?",
          placeholder: "None",
          required: false,
        }}
      />

      <TextAreaInput
        name="description"
        control={form.control}
        input={{
          label: "Description",
          description: "What is the description of this spot?",
          placeholder: "A nice spot to study.",
          required: false,
        }}
      />

      <CheckboxInput
        name="naturalViews"
        control={form.control}
        input={{
          label: "Natural Views",
          description: "Are there natural views here?",
          required: false,
        }}
      />

      <CheckboxInput
        name="canStudyForLong"
        control={form.control}
        input={{
          label: "Can study for long",
          description: "Can you study for long here?",
          required: false,
        }}
      />

      <CheckboxInput
        name="sunlight"
        control={form.control}
        input={{
          label: "Sunlight",
          description: "Is there sunlight here?",
          required: false,
        }}
      />

      <CheckboxInput
        name="drinks"
        control={form.control}
        input={{
          label: "Drinks",
          description: "Are there drinks here?",
          required: false,
        }}
      />

      <CheckboxInput
        name="food"
        control={form.control}
        input={{
          label: "Food",
          description: "Is there food here?",
          required: false,
        }}
      />
    </>
  );
}
