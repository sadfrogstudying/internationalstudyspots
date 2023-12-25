"use client";

import { api } from "@/trpc/react";
import dynamic from "next/dynamic";
import { Link } from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import ServerZodError from "@/components/server-zod-error";
import ServerErrorMessage from "@/components/server-error-message";

const CreateSpotFormV2 = dynamic(
  () => import("@/components/create-spot-form"),
  { ssr: false, loading: () => <div className="">Loading Form 📝...</div> },
);

export default function CreatePage() {
  const { mutate, data, isLoading, error } = api.studySpot.create.useMutation({
    onSuccess: (res) => {
      console.log(res);
    },
  });

  const { data: user, isLoading: userLoading } =
    api.user.currentBySession.useQuery(undefined);

  if (!user?.username && !userLoading) {
    return (
      <>
        <p className="text-gray-500">
          You need to finish creating your account before you can add spots and
          view your profile.
        </p>
        <Button asChild className="mt-4" variant="success">
          <Link href={`/account/edit`}>Finish Account</Link>
        </Button>
      </>
    );
  }

  if (userLoading) return <p>Checking User 🤦‍♂️...</p>;

  return (
    <>
      <CreateSpotFormV2
        onSubmit={(formValues) => {
          // pretend to convert images to urls
          const imageUrls = formValues.images.map(
            (image) => `www.s3.com/${image.name}`,
          );

          mutate({
            ...formValues,
            images: imageUrls,
          });
        }}
      />

      {isLoading && <p className="mt-4">Submitting...</p>}
      {data && <p className="mt-4 text-green-500">Submitted!</p>}
      {!!error?.data?.zodError && (
        <ServerZodError zodError={error?.data?.zodError} />
      )}
      {error && !error?.data?.zodError && (
        <ServerErrorMessage message={error.message} />
      )}
    </>
  );
}
