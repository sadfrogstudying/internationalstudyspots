"use client";

import { api } from "@/trpc/react";
import { type typeToFlattenedError } from "zod";
import dynamic from "next/dynamic";
import { Link } from "@/components/ui/link";
import { Button } from "@/components/ui/button";

const CreateSpotFormV2 = dynamic(
  () => import("@/components/create-spot-form"),
  { ssr: false, loading: () => <div className="">Loading Form 📝...</div> },
);

export default function CreatePage() {
  return (
    <Layout>
      <Content />
    </Layout>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 p-4">
      <div className="rounded border p-4">
        <h1 className="mb-4 text-lg font-bold underline">Create New Spot 🧭</h1>
        {children}
      </div>
    </div>
  );
}

function Content() {
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
        <ServerZodError errors={parseZodClientError(error?.data?.zodError)} />
      )}

      {error && !error?.data?.zodError && (
        <div className="mt-4 text-destructive" role="alert">
          <div className="text-sm font-bold">
            An error occured on the server, please try again.
          </div>
          <p className="text-[0.8rem]">Message: {error.message}</p>
        </div>
      )}
    </>
  );
}

const parseZodClientError = (
  zodError:
    | typeToFlattenedError<string[] | undefined, string>
    | null
    | undefined,
) => {
  const fieldErrors = zodError?.fieldErrors;
  const fieldErrorsEntries = fieldErrors ? Object.entries(fieldErrors) : [];
  const errorMessages = fieldErrorsEntries.map(([key, value]) => [
    key,
    value?.[0] ? value[0] : "",
  ]);

  return errorMessages;
};

function ServerZodError({ errors }: { errors: string[][] }) {
  return (
    <>
      <div>
        {errors.length !== 0 && (
          <strong className="text-[0.8rem] text-destructive">
            Server validation failed:
          </strong>
        )}
        <ul className="list-disc pl-4">
          {errors.map((x) => (
            <li
              key={x[0]}
              className="text-[0.8rem] font-medium text-destructive"
              role="alert"
            >
              <strong className="capitalize">{x[0]}</strong>: {x[1]}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
