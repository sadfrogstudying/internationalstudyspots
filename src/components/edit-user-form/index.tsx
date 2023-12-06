"use client";

import { type UpdateUserClient, updateUserClientSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import inputs from "./form-config";
import { Button } from "../ui/button";
import { InputGenerator } from "../form/input-generator";
import { api } from "@/trpc/react";

export default function EditUserForm({
  onSubmit,
}: {
  onSubmit: (formValues: UpdateUserClient) => void;
}) {
  const { data, isLoading } = api.user.currentBySession.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const {
    username,
    name,
    description,
    // profileImage,
    city,
    country,
    interests,
    occupation,
    tagline,
  } = data ?? {};

  const form = useForm<UpdateUserClient>({
    resolver: zodResolver(updateUserClientSchema),
    defaultValues: {
      // strings
      name: "",
      username: "",
      description: "",
      city: "",
      country: "",
      interests: "",
      occupation: "",
      tagline: "",

      // images
      profileImage: [],
    },
    values: {
      // strings
      name: name ?? "",
      username: username ?? "",
      description: description ?? "",
      city: city ?? "",
      country: country ?? "",
      interests: interests ?? "",
      occupation: occupation ?? "",
      tagline: tagline ?? "",

      // images
      profileImage: [], // not implemented
    },
    disabled: isLoading,
  });

  function handleSubmit(formValues: UpdateUserClient) {
    onSubmit(formValues);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="h-40 w-40 bg-neutral-200"></div>
        {inputs.map(({ inputs, category }) => {
          return (
            <div key={`accordion-${category}`}>
              <div className="grid grid-cols-4 gap-4">
                {inputs.map((input) => {
                  return InputGenerator(input, form);
                })}
              </div>
            </div>
          );
        })}
        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
