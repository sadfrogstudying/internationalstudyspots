"use client";

import CreateUpdateSpotForm from "@/components/create-update-spot-form";
import { CreateUpdateFormValues } from "@/schemas";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function EditStudySpotPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const { data, isLoading } = api.studySpot.bySlug.useQuery(params.slug);
  const { mutate, isLoading: updateLoading } = api.studySpot.update.useMutation(
    {
      onSuccess: () => {
        router.push(`/study-spot/${params.slug}`);
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
    throw new Error("Not implemented");

    mutate(formValues);
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
