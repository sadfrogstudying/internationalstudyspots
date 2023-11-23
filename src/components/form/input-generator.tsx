"use client";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import TextInput from "@/components/input/text-input";
import ImageInput from "@/components/input/image-input";
import CheckboxInput from "@/components/input/checkbox-input";
import TextAreaInput from "@/components/input/textarea-input";

import dynamic from "next/dynamic";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const LocationSearchInput = dynamic(
  () => import("@/components/input/location-search"),
  {
    ssr: false,
    loading: () => <LocationSearchLoading />,
  },
);
const LocationSearchLoading = () => (
  <div className="space-y-2">
    <Label asChild>
      <div>Search Location</div>
    </Label>
    <Button variant="outline" className="w-full justify-between">
      Loading...
    </Button>
  </div>
);

interface Text<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description: string;
  placeholder: string;
  required: boolean;
  inputType: "text";
}
interface TextArea<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description: string;
  placeholder: string;
  required: boolean;
  inputType: "textarea";
}
interface Image<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description: string;
  required: boolean;
  inputType: "image";
}
interface Checkbox<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description: string;
  required: boolean;
  inputType: "checkbox";
}
interface LocationSearch {
  inputType: "locationSearch";
}

export type Input<T extends FieldValues> =
  | Text<T>
  | TextArea<T>
  | Image<T>
  | Checkbox<T>
  | LocationSearch;

export function InputGenerator<T extends FieldValues>(
  input: Input<T>,
  form: UseFormReturn<T>,
) {
  if (input.inputType === "text")
    return (
      <TextInput
        key={`input-${input.name}`}
        input={{
          label: input.label,
          description: input.description,
          placeholder: input.placeholder,
          required: input.required,
        }}
        name={input.name}
        {...form}
      />
    );
  if (input.inputType === "image")
    return (
      <ImageInput
        key={`input-${input.name}`}
        input={{
          label: input.label,
          description: input.description,
          required: input.required,
        }}
        name={input.name}
        {...form}
      />
    );
  if (input.inputType === "checkbox")
    return (
      <CheckboxInput
        key={`input-${input.name}`}
        input={{
          label: input.label,
          description: input.description,
          required: input.required,
        }}
        name={input.name}
        {...form}
      />
    );
  if (input.inputType === "locationSearch")
    return (
      <LocationSearchInput
        key={`input-locationSearch`}
        onSelectedPlaceReady={() => console.log("READY")}
      />
    );
  if (input.inputType === "textarea")
    return (
      <TextAreaInput
        key={`input-${input.name}`}
        input={{
          label: input.label,
          description: input.description,
          placeholder: input.placeholder,
          required: input.required,
        }}
        name={input.name}
        {...form}
      />
    );
  return null;
}
