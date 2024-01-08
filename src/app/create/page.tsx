"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { api } from "@/trpc/react";
import type { CreateUpdateFormValues } from "@/schemas";
import { uploadFilesToS3UsingPresignedUrls } from "@/lib/helpers";

const ServerZodError = dynamic(() => import("@/components/server-zod-error"), {
  ssr: false,
});

const ServerErrorMessage = dynamic(
  () => import("@/components/server-error-message"),
  {
    ssr: false,
  },
);

const CreateUpdateSpotForm = dynamic(
  () => import("@/components/create-update-spot-form"),
  { ssr: false, loading: () => <div className="">Loading Form 📝...</div> },
);

export default function CreatePage() {
  // To capture the form data from the form component
  const [formData, setFormData] = useState<CreateUpdateFormValues>();

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
      const newImages = formData?.images?.newImages;
      if (!newImages || !presignedUrls) return;

      const imageUrls = await uploadFilesToS3UsingPresignedUrls(
        presignedUrls,
        newImages.map((image) => image.file),
      );

      const imagePayload = imageUrls.map((url, index) => ({
        featured: newImages[index]?.featured ?? false,
        url,
      }));

      create({
        ...formData,
        images: imagePayload,
      });
    },
  });

  function handleSubmit(formValues: CreateUpdateFormValues) {
    setFormData(formValues);

    const images = formValues.images.newImages.map((image) => ({
      contentLength: image.file.size,
      contentType: image.file.type,
    }));

    getPresignedUrls({
      ...formValues,
      images,
    });
  }

  function getButtonText() {
    const hasNewImages = !!formData?.images?.newImages?.length;

    if (presignedUrlsLoading && hasNewImages) return "Uploading images...";
    if (presignedUrlsLoading) return "Creating...";
    if (createLoading) return "Creating...";
    if (createSuccess) return "Redirecting you now...";

    return "Submit";
  }

  const submitDisabled = createLoading || presignedUrlsLoading || createSuccess;

  return (
    <>
      <CreateUpdateSpotForm
        onSubmit={handleSubmit}
        buttonLabel={getButtonText()}
        submitDisabled={submitDisabled}
      />

      {!!presignedUrlsError?.data?.zodError && (
        <ServerZodError zodError={presignedUrlsError.data.zodError} />
      )}

      {!!createError?.data?.zodError && (
        <ServerZodError zodError={createError.data.zodError} />
      )}

      <ServerErrorMessage
        message={presignedUrlsError?.message ?? createError?.message}
        code={presignedUrlsError?.data?.code ?? createError?.data?.code}
      />
    </>
  );
}
