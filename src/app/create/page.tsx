"use client";

import CreateSpotForm from "@/components/create-spot-form";
import { api } from "@/trpc/react";
import { type typeToFlattenedError } from "zod";

export default function CreatePage() {
  const { mutate, data, isLoading, error } =
    api.studySpot.createSpot.useMutation({
      onSuccess: (res) => {
        console.log(res);
      },
    });

  return (
    <div className="p-4">
      <h1 className="mb-4 font-bold">Create Page 🤡</h1>
      <div className="max-w-md border p-4">
        <CreateSpotForm
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

        <div className="mt-8">
          {isLoading && <p>Submitting...</p>}

          {data && <p className="text-green-500">Submitted!</p>}

          {!!error?.data?.zodError && (
            <ServerZodError
              errors={parseZodClientError(error?.data?.zodError)}
            />
          )}

          {error && !error?.data?.zodError && (
            <p className="text-[0.8rem] font-medium text-destructive">
              An error occured on the server, please try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export const parseZodClientError = (
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
