"use client";

import { type UpdateUserClient, updateUserClientSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";
import TextInput from "../input/text-input";
import ImageInput from "../input/image-input";
import Image from "next/image";
import { useEffect } from "react";

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
      profileImage: [], // not implemented
    },
    disabled: isLoading,
  });

  function handleSubmit(formValues: UpdateUserClient) {
    onSubmit(formValues);
  }

  // profile image logic will be refactored to new component
  // This method will watch specified inputs and return their
  // values. It is useful to render input value and for
  // determining what to render by condition.
  const newProfileImage = form.watch("profileImage")[0];

  useEffect(() => {
    if (newProfileImage) {
      const newProfileImageWithPreview = Object.assign(newProfileImage, {
        preview: URL.createObjectURL(newProfileImage),
      });

      form.setValue("profileImage", [newProfileImageWithPreview]);
    }

    // this probably won't work as it will run after a new image is added
    // way around might be to keep a reference within the useEffect
    return () => {
      newProfileImage?.preview && URL.revokeObjectURL(newProfileImage.preview);
    };
  }, [form, newProfileImage]);

  const previewUrl = newProfileImage?.preview
    ? newProfileImage?.preview
    : profileImage?.url;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        {previewUrl ? (
          <Image
            className="aspect-square w-40 bg-gray-100 object-cover"
            src={previewUrl}
            alt="User profile image"
            width={160}
            height={160}
            // test that this works
            onLoad={() => URL.revokeObjectURL(previewUrl)}
          />
        ) : (
          <div className="aspect-square w-40 bg-gray-100 object-cover" />
        )}

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

          <ImageInput
            name="profileImage"
            control={form.control}
            input={{
              label: "Profile Image",
              description: "Upload a profile image",
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
