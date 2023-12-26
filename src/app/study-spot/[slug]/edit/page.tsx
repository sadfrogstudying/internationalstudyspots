"use client";
import CreateUpdateForm from "@/components/create-spot-form";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

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
    <div></div>
    // <CreateUpdateForm
    //   onSubmit={(formValues) => console.log(formValues)}
    //   editMode={{
    //     initialData: data,
    //   }}
    // />
  );
}
