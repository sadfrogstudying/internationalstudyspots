"use client";

import EditSpotForm from "@/components/edit-spot-form";
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

  const submitDisabled = updateLoading;

  return (
    <EditSpotForm
      initialValues={data}
      onSubmit={(formVals) => {
        mutate({ ...formVals, images: [], imagesToDelete: [] });
      }}
      buttonLabel={getButtonText()}
      submitDisabled={submitDisabled}
    />
  );
}
