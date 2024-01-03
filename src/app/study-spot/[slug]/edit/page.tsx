"use client";

import { uploadFilesToS3UsingPresignedUrls } from "@/lib/helpers";
import type { CreateUpdateFormValues, UpdateInput } from "@/schemas";
import { api } from "@/trpc/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateUpdateSpotForm = dynamic(
  () => import("@/components/create-update-spot-form"),
  { ssr: false, loading: () => <div className="">Loading Form 📝...</div> },
);

export default function EditStudySpotPage({
  params,
}: {
  params: { slug: string };
}) {
  // To capture the form data from the form component
  const [formData, setFormData] = useState<CreateUpdateFormValues>();

  const apiUtils = api.useUtils();
  const router = useRouter();

  const { data, isLoading } = api.studySpot.bySlug.useQuery(params.slug);

  const { mutate: update, isLoading: updateLoading } =
    api.studySpot.update.useMutation({
      onSuccess: (res) => {
        void apiUtils.studySpot.bySlug.invalidate(res.slug);
        router.push(`/study-spot/${res.slug}`);
      },
    });

  const { mutate: getPresignedUrl } =
    api.studySpot.getPresignedUrls.useMutation({
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

  const submitDisabled = updateLoading;

  function getButtonText() {
    if (updateLoading) return "Updating...";
    return "Submit";
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Not found</div>;
  }

  return (
    <CreateUpdateSpotForm
      initialValues={data}
      onSubmit={handleSubmit}
      buttonLabel={getButtonText()}
      submitDisabled={submitDisabled}
    />
  );
}
