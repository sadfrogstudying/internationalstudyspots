"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { type typeToFlattenedError } from "zod";
import AccountDetails from "./account-details";
import { Button } from "../ui/button";

const CreateUserForm = dynamic(() => import("@/components/create-user-form"), {
  ssr: false,
  loading: () => <span>Loading Form...</span>,
});

export default function Account() {
  const { data } = api.user.currentBySession.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const { mutate, isLoading, error } = api.user.create.useMutation();

  const [showPreview, setShowPreview] = useState(false);

  if (!data)
    return (
      <div className="space-y-4">
        {!showPreview && (
          <>
            <CreateUserForm
              onSubmit={(formValues) => {
                const imageUrl = formValues.profilePicture.map(
                  (image) => `https://picsum.photos/seed/${image.name}/200/300`,
                )[0];

                mutate({
                  ...formValues,
                  profilePicture: imageUrl,
                });
              }}
            />

            <div className="mt-8">
              {isLoading && <p>Submitting...</p>}

              {data && <p className="text-green-500">Submitted!</p>}

              {!!error?.data?.zodError && (
                <ServerZodError
                  errors={parseZodClientError(error?.data?.zodError)}
                />
              )}

              {error && !error?.data?.zodError && (
                <div className="text-destructive" role="alert">
                  <div className="font-bold">
                    An error occured on the server, please try again.
                  </div>
                  <p className="text-[0.8rem]">Message: {error.message}</p>
                </div>
              )}
            </div>
          </>
        )}
        <div className="space-y-4">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="success"
          >
            {showPreview
              ? "Hide Preview Of Account Details Page"
              : "Show Preview Account Details Page"}
          </Button>
          {showPreview && <AccountDetails />}
        </div>
      </div>
    );

  return <AccountDetails />;
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
