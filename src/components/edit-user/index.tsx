"use client";

import { api } from "@/trpc/react";
import dynamic from "next/dynamic";
import { type typeToFlattenedError } from "zod";

const EditUserForm = dynamic(() => import("@/components/edit-user-form"), {
  ssr: false,
  loading: () => <span>Loading Form...</span>,
});

export default function EditUser() {
  const {
    mutate,
    isLoading,
    error,
    data: createSuccess,
  } = api.user.update.useMutation();

  return (
    <div className="space-y-4 border p-4">
      <EditUserForm
        onSubmit={(formValues) => {
          const imageUrl = formValues.profileImage.map(
            (image) => `https://picsum.photos/seed/${image.name}/200/300`,
          )[0];

          mutate({
            ...formValues,
            profileImage: imageUrl,
          });
        }}
      />
      {isLoading && <p>Submitting...</p>}
      {createSuccess && <p className="text-green-500">Submitted!</p>}
      {!!error?.data?.zodError && (
        <ServerZodError errors={parseZodClientError(error?.data?.zodError)} />
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
