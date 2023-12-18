"use client";

import { type UpdateUserClient, updateUserClientSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";
import TextInput from "../input/text-input";
import ImageInput from "../input/image-input";

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
        <ImageInput
          name="profileImage"
          control={form.control}
          input={{
            label: "Profile Image",
            description: "Upload a profile image",
            required: false,
          }}
          className="aspect-square h-auto w-40 bg-gray-100 object-cover"
          labelClassName="w-full flex-col text-center"
          overlayPreview
          defaultImage={profileImage?.url}
        />

        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-4">
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
        </div>
        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
