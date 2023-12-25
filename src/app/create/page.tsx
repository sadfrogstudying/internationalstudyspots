"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { api } from "@/trpc/react";
import type { CreateSpotFormValues } from "@/schemas";
import { uploadFilesToS3UsingPresignedUrls } from "@/lib/helpers";

import ServerZodError from "@/components/server-zod-error";
import ServerErrorMessage from "@/components/server-error-message";

const CreateSpotFormV2 = dynamic(
  () => import("@/components/create-spot-form"),
  { ssr: false, loading: () => <div className="">Loading Form 📝...</div> },
);

export default function CreatePage() {
  // To capture the form data from the form component
  const [formData, setFormData] = useState<CreateSpotFormValues>();

  const apiUtils = api.useUtils();
  const router = useRouter();

  const {
    mutate: create,
    error: createError,
    isLoading: createLoading,
    isSuccess: createSuccess,
  } = api.studySpot.create.useMutation({
    onSuccess: () => {
      void apiUtils.studySpot.getAll.invalidate();
      router.push("/");
    },
  });

  const {
    mutate: getPresignedUrls,
    error: presignedUrlsError,
    isLoading: presignedUrlsLoading,
  } = api.studySpot.getPresignedUrls.useMutation({
    onSuccess: async (presignedUrls) => {
      if (!formData?.images) return;

      const imageUrls = await uploadFilesToS3UsingPresignedUrls(
        presignedUrls,
        formData.images,
      );

      create({
        ...formData,
        images: imageUrls,
      });
    },
  });

  function handleSubmit(formValues: CreateSpotFormValues) {
    setFormData(formValues);

    const images = formValues.images.map((image) => ({
      contentLength: image.size,
      contentType: image.type,
    }));

    getPresignedUrls({
      ...formValues,
      images,
    });
  }

  return (
    <>
      <CreateSpotFormV2 onSubmit={handleSubmit} />

      {!!presignedUrlsError?.data?.zodError && (
        <ServerZodError zodError={presignedUrlsError.data.zodError} />
      )}
      {presignedUrlsError && !presignedUrlsError?.data?.zodError && (
        <ServerErrorMessage message={presignedUrlsError.message} />
      )}
      {!!createError?.data?.zodError && (
        <ServerZodError zodError={createError.data.zodError} />
      )}
      {createError && !createError?.data?.zodError && (
        <ServerErrorMessage message={createError.message} />
      )}
    </>
  );
}
