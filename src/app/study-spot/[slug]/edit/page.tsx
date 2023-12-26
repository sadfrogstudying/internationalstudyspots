"use client";

import EditSpotForm from "@/components/edit-spot-form";
import { api } from "@/trpc/react";

export default function EditStudySpotPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data, isLoading } = api.studySpot.bySlug.useQuery(params.slug);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Not found</div>;
  }

  return (
    <EditSpotForm
      initialValues={data}
      onSubmit={(formVals) => console.log(formVals)}
    />
  );
}
