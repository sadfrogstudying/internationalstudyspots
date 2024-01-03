"use client";

import type { CreateUpdateFormValues, UpdateInput } from "@/schemas";
import { api } from "@/trpc/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const CreateUpdateSpotForm = dynamic(
  () => import("@/components/create-update-spot-form"),
  { ssr: false, loading: () => <div className="">Loading Form 📝...</div> },
);

export default function EditStudySpotPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const { data, isLoading } = api.studySpot.bySlug.useQuery(params.slug);
  const { mutate, isLoading: updateLoading } = api.studySpot.update.useMutation(
    {
      onSuccess: (res) => {
        router.push(`/study-spot/${res.slug}`);
      },
    },
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Not found</div>;
  }

  function getButtonText() {
    if (updateLoading) return "Updating...";
    return "Submit";
  }

  function handleSubmit(formValues: CreateUpdateFormValues) {
    console.log("formValues", formValues);
    if (!data) return;

    // const newImagesPayload = newImageUrls.map((url, i) => ({
    //   url,
    //   featured: values.images.newImages[i].featured,
    // }));

    const changedExistingImages = formValues.images.existingImages.filter(
      (image, i) => {
        if (image.delete) return true;
        return image.featured !== data.images[i]?.featured;
      },
    );

    const payload = {
      ...formValues,
      id: data.id,
      images: {
        existingImages: [],
        newImages: [],
      },
    };

    mutate(payload);
  }

  const submitDisabled = updateLoading;

  return (
    <CreateUpdateSpotForm
      initialValues={data}
      onSubmit={handleSubmit}
      buttonLabel={getButtonText()}
      submitDisabled={submitDisabled}
    />
  );
}
