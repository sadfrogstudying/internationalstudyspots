"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { type UpdateUserClient, updateUserClientSchema } from "@/schemas/user";
import { uploadFilesToS3UsingPresignedUrls } from "@/lib/helpers";
import { api } from "@/trpc/react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/input/text-input";
import ImageInput from "@/components/input/image-input";
import ServerZodError from "@/components/server-zod-error";

export default function EditUserForm() {
  const { data, isLoading } = api.user.currentBySession.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 2,
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

  const apiUtils = api.useUtils();
  const router = useRouter();

  const {
    mutate: update,
    isLoading: updateLoading,
    error: updateError,
  } = api.user.update.useMutation({
    onSuccess: () => {
      void apiUtils.user.currentBySession.invalidate();
      router.push(`/account/${form.getValues("username")}`);
      form.reset();
    },
  });

  const {
    mutate: getPresignedUrl,
    error: getPresignedUrlError,
    isLoading: getPresignedUrlLoading,
  } = api.user.getPresignedUrl.useMutation({
    onSuccess: async (presignedUrl) => {
      if (!presignedUrl) {
        update({ ...form.getValues(), profileImage: undefined });
        return;
      }

      const imageUrls = await uploadFilesToS3UsingPresignedUrls(
        [presignedUrl],
        form.getValues("profileImage"),
      );

      update({ ...form.getValues(), profileImage: imageUrls[0] });
    },
  });

  function handleSubmit(formValues: UpdateUserClient) {
    const profileImage = formValues.profileImage.map((file) => ({
      contentLength: file.size,
      contentType: file.type,
    }))[0];

    getPresignedUrl({
      ...formValues,
      profileImage,
    });
  }

  function getButtonText() {
    if (updateLoading) return "Creating...";
    if (getPresignedUrlLoading) return "Uploading images...";
    return "Submit";
  }

  const submitDisabled =
    updateLoading || getPresignedUrlLoading || !form.formState.isDirty;

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
        <Button className="mt-4" type="submit" disabled={submitDisabled}>
          {getButtonText()}
        </Button>
      </form>

      <div className="space-y-4">
        {!!updateError?.data?.zodError && (
          <ServerZodError zodError={updateError?.data?.zodError} />
        )}
        {updateError && !updateError?.data?.zodError && (
          <ErrorMessage message={updateError.message} />
        )}
        {!!getPresignedUrlError?.data?.zodError && (
          <ServerZodError zodError={getPresignedUrlError?.data?.zodError} />
        )}
        {getPresignedUrlError && !getPresignedUrlError?.data?.zodError && (
          <ErrorMessage message={getPresignedUrlError.message} />
        )}
      </div>
    </Form>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="text-destructive" role="alert">
      <div className="font-bold">
        An error occured on the server, please try again.
      </div>
      <p className="text-[0.8rem]">Message: {message}</p>
    </div>
  );
}
