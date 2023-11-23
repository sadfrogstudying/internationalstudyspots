import { type CreateUserClient, createUserClientSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { Accordion } from "../ui/accordion";
import inputs from "./form-config";
import { AccordionItem } from "../form/accordion-item";
import { Button } from "../ui/button";
import { InputGenerator } from "../form/input-generator";

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
                <div className="rounded border border-neutral-400">
                  <div className="grid grid-cols-1 gap-4 border-l-4 border-neutral-400 p-4 sm:grid-cols-2 md:grid-cols-4">
                    {inputs.map((input) => {
                      return InputGenerator(input, form);
                    })}
                  </div>
                </div>
              </AccordionItem>
            ) : (
              <div
                className="rounded border border-neutral-400"
                key={`accordion-${category}`}
              >
                <div className="grid grid-cols-1 gap-4 border-l-4 border-neutral-400 p-4 sm:grid-cols-2 md:grid-cols-4">
                  {inputs.map((input) => {
                    return InputGenerator(input, form);
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
