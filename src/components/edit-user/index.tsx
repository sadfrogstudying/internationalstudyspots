"use client";

import { api } from "@/trpc/react";
import dynamic from "next/dynamic";

import ServerZodError from "@/components/edit-user/server-zod-error";

const EditUserForm = dynamic(() => import("@/components/edit-user-form"), {
  ssr: false,
  loading: () => <span>Loading Form...</span>,
});

export default function EditUser() {
  const {
    mutate,
    isLoading,
    error: updateError,
    data: createSuccess,
  } = api.user.update.useMutation();

  const {
    mutate: validateUpdateInputs,
    error: validateError,
    isLoading: validateLoading,
  } = api.user.validateUpdateInputs.useMutation();

  return (
    <div className="space-y-4 border p-4">
      <EditUserForm
        onSubmit={(formValues) => {
          validateUpdateInputs({
            ...formValues,
            profileImage: undefined,
          });

          throw "Not implemented";

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

      {!!updateError?.data?.zodError && (
        <ServerZodError zodError={updateError?.data?.zodError} />
      )}
      {updateError && !updateError?.data?.zodError && (
        <ErrorMessage message={updateError.message} />
      )}
      {!!validateError?.data?.zodError && (
        <ServerZodError zodError={validateError?.data?.zodError} />
      )}
      {validateError && !validateError?.data?.zodError && (
        <ErrorMessage message={validateError.message} />
      )}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="text-destructive" role="alert">
      <div className="font-bold">
        An error occured on the server, please try again.
      </div>
      <p className="text-[0.8rem]">Message: {message}</p>
    </div>
  );
}
