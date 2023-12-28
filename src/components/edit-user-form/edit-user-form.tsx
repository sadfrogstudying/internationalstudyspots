"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { type UpdateUserClient, updateUserClientSchema } from "@/schemas/user";
import { api } from "@/trpc/react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import TextInput from "@/components/input/text-input";
import ImageInput from "@/components/input/image-input";
import { AccordionItem } from "@/components/form/accordion-item";
import InputGrid from "@/components/form/input-grid";
import {
  DropzoneLabel,
  DropzoneOverlayPreview,
} from "@/components/ui/dropzone";

export default function EditUserForm({
  onSubmit,
  buttonLabel = "Submit",
  submitDisabled = false,
}: {
  onSubmit: (formValues: UpdateUserClient) => void;
  buttonLabel?: string;
  submitDisabled?: boolean;
}) {
  const { data, isLoading } = api.user.currentBySession.useQuery(undefined);

  const {
    username,
    name,
    description,
    profileImage,
    city,
    country,
    interests,
    occupation,
    tagline,
  } = data ?? {};

  const form = useForm<UpdateUserClient>({
    resolver: zodResolver(updateUserClientSchema),
    defaultValues: {
      name: "",
      username: "",
      description: "",
      city: "",
      country: "",
      interests: "",
      occupation: "",
      tagline: "",
      profileImage: [],
    },
    values: {
      name: name ?? "",
      username: username ?? "",
      description: description ?? "",
      city: city ?? "",
      country: country ?? "",
      interests: interests ?? "",
      occupation: occupation ?? "",
      tagline: tagline ?? "",
      profileImage: [],
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
        <InputGrid>
          <ImageInput
            name="profileImage"
            control={form.control}
            input={{
              label: "Profile Image",
              description: "Upload a profile image",
              required: false,
            }}
            className="aspect-square h-auto w-40 bg-gray-100 object-cover"
          >
            <DropzoneLabel className="justify-center" />
            <DropzoneOverlayPreview
              files={form.watch("profileImage")}
              defaultImage={profileImage?.url}
            />
          </ImageInput>

          <TextInput
            name="username"
            control={form.control}
            input={{
              label: "Username",
              description: "What is your username?",
              placeholder: "WultuhWhite",
              required: true,
            }}
          />
        </InputGrid>

        <Accordion type="single" collapsible>
          <AccordionItem label="More Details ⚙️">
            <InputGrid>
              <TextInput
                name="name"
                control={form.control}
                input={{
                  label: "Name",
                  description: "What is your name?",
                  placeholder: "Walter White",
                  required: false,
                }}
              />

              <TextInput
                name="city"
                control={form.control}
                input={{
                  label: "City",
                  description: "Which city are you from?",
                  placeholder: "Sydney",
                  required: false,
                }}
              />

              <TextInput
                name="country"
                control={form.control}
                input={{
                  label: "Country",
                  description: "Which country are you from?",
                  placeholder: "Australia",
                  required: false,
                }}
              />

              <TextInput
                name="interests"
                control={form.control}
                input={{
                  label: "Interests",
                  description: "What are your interests?",
                  placeholder: "Programming, Gaming, Music",
                  required: false,
                }}
              />

              <TextInput
                name="occupation"
                control={form.control}
                input={{
                  label: "Occupation",
                  description: "What is your occupation?",
                  placeholder: "Software Engineer",
                  required: false,
                }}
              />

              <TextInput
                name="tagline"
                control={form.control}
                input={{
                  label: "Tagline",
                  description: "What is your tagline?",
                  placeholder: "...",
                  required: false,
                }}
              />
            </InputGrid>
          </AccordionItem>
        </Accordion>

        <Button
          className="mt-4"
          type="submit"
          disabled={submitDisabled || !form.formState.isDirty}
        >
          {form.formState.isDirty ? buttonLabel : "No changes"}
        </Button>
      </form>
    </Form>
  );
}
