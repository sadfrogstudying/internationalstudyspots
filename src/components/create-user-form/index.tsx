import { type CreateUserClient, createUserClientSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormReturn, useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { Accordion } from "../ui/accordion";
import inputs, { type Input } from "./form-config";
import { AccordionItem } from "../form/accordion-item";
import TextInput from "@/components/input/text-input";
import ImageInput from "@/components/input/image-input";
import CheckboxInput from "@/components/input/checkbox-input";
import TextAreaInput from "@/components/input/textarea-input";
import LocationSearchInput from "@/components/input/location-search";
import { Button } from "../ui/button";

export default function CreateUserForm({
  onSubmit,
}: {
  onSubmit: (formValues: CreateUserClient) => void;
}) {
  const form = useForm<CreateUserClient>({
    resolver: zodResolver(createUserClientSchema),
    defaultValues: {
      // strings
      username: "",
      description: "",
      city: "",
      country: "",
      interests: "",
      occupation: "",
      tagline: "",

      // images
      profilePicture: [],
    },
  });

  function handleSubmit(formValues: CreateUserClient) {
    onSubmit(formValues);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex-gap-2 flex flex-col"
      >
        <Accordion type="multiple" className="w-full space-y-4">
          {inputs.map(({ inputs, category, hasAccordion }) => {
            return hasAccordion ? (
              <AccordionItem label={category} key={`accordion-${category}`}>
                {inputs.map((input) => {
                  return GenerateInput(input, form);
                })}
              </AccordionItem>
            ) : (
              <div
                className="rounded border border-neutral-400"
                key={`accordion-${category}`}
              >
                <div className="grid grid-cols-1 gap-4 border-l-4 border-neutral-400 p-4 sm:grid-cols-2 md:grid-cols-4">
                  {inputs.map((input) => {
                    return GenerateInput(input, form);
                  })}
                </div>
              </div>
            );
          })}
        </Accordion>
        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export function GenerateInput(
  input: Input,
  form: UseFormReturn<CreateUserClient>,
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
  return (
    <LocationSearchInput
      key={`input-locationSearch`}
      onSelectedPlaceReady={() => console.log("READY")}
    />
  );
}
