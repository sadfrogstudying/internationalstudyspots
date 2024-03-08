"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/trpc/react";
import type { CreateUpdateFormValues } from "@/schemas";
import { uploadFilesToS3UsingPresignedUrls } from "@/lib/utils";

import ServerErrorMessage from "@/components/server-error-message";
import ServerZodError from "@/components/server-zod-error";
import CreateUpdateSpotForm from "@/components/create-update-spot-form";

export default function EditSpotFormController({ slug }: { slug: string }) {
  // To capture the form data from the form component
  const [formData, setFormData] = useState<CreateUpdateFormValues>();

  const apiUtils = api.useUtils();
  const router = useRouter();

  const { data, isLoading } = api.studySpot.bySlug.useQuery(slug);

  const {
    mutate: update,
    isLoading: updateLoading,
    error: updateError,
    isSuccess: updateSuccess,
  } = api.studySpot.update.useMutation({
    onSuccess: (res) => {
      void apiUtils.studySpot.bySlug.invalidate(res.slug);
      router.push(`/study-spot/${res.slug}`);
    },
  });

  const {
    mutate: getPresignedUrl,
    isLoading: presignedUrlsLoading,
    error: presignedUrlsError,
  } = api.studySpot.getPresignedUrls.useMutation({
    onSuccess: async (presignedUrls) => {
      if (!formData || !data) return;

      // Handle existing images
      const existingImages = formData.images.existingImages.filter(
        (image, i) =>
          image.delete || image.featured !== data.images[i]?.featured,
      );
      const existingImagesPayload =
        existingImages.length > 0 ? existingImages : undefined;

      // Early update if no new images
      if (!presignedUrls) {
        update({
          ...formData,
          id: data.id,
          images: {
            existingImages: existingImagesPayload,
          },
        });
        return;
      }

      // Handle new images
      const imageUrls = await uploadFilesToS3UsingPresignedUrls(
        presignedUrls,
        formData.images.newImages.map((image) => image.file),
      );
      const newImages = imageUrls.map((url, index) => ({
        url,
        featured: formData.images.newImages[index]?.featured ?? false,
      }));
      const newImagePayload = newImages.length > 0 ? newImages : undefined;

      update({
        ...formData,
        id: data.id,
        images: {
          newImages: newImagePayload,
          existingImages: existingImagesPayload,
        },
      });
    },
  });

  function handleSubmit(formValues: CreateUpdateFormValues) {
    setFormData(formValues);

    const newImages = formValues.images.newImages.map((image) => ({
      contentLength: image.file.size,
      contentType: image.file.type,
    }));

    getPresignedUrl({
      ...formValues,
      images: newImages,
      id: data?.id,
    });
  }

  function getButtonText() {
    const hasNewImages = !!formData?.images?.newImages?.length;

    if (presignedUrlsLoading && hasNewImages) return "Uploading images...";
    if (presignedUrlsLoading) return "Updating...";
    if (updateLoading) return "Updating...";
    if (updateSuccess) return "Redirecting you now...";

    return "Submit";
  }

  const submitDisabled = updateLoading || presignedUrlsLoading || updateSuccess;

  if (isLoading) {
    return <div>Loading spot details 📍...</div>;
  }

  if (!data) {
    return <div>Spot not found!</div>;
  }

  return (
    <>
      <CreateUpdateSpotForm
        initialValues={data}
        onSubmit={handleSubmit}
        buttonLabel={getButtonText()}
        submitDisabled={submitDisabled}
      />

      {!!presignedUrlsError?.data?.zodError && (
        <ServerZodError zodError={presignedUrlsError.data.zodError} />
      )}

      {!!updateError?.data?.zodError && (
        <ServerZodError zodError={updateError.data.zodError} />
      )}

      <ServerErrorMessage
        message={presignedUrlsError?.message ?? updateError?.message}
        code={presignedUrlsError?.data?.code ?? updateError?.data?.code}
      />
    </>
  );
}
