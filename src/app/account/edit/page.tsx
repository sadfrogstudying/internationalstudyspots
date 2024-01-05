"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

import type { UpdateUserClient } from "@/schemas/user";
import { uploadFilesToS3UsingPresignedUrls } from "@/lib/helpers";

const ServerZodError = dynamic(() => import("@/components/server-zod-error"), {
  ssr: false,
});

const ServerErrorMessage = dynamic(
  () => import("@/components/server-error-message"),
  {
    ssr: false,
  },
);

const EditUserForm = dynamic(() => import("@/components/edit-user-form"), {
  ssr: false,
  loading: () => <span>Loading Form 📝...</span>,
});

export default function EditAccountPage() {
  // To capture the form data from the form component
  const [formData, setFormData] = useState<UpdateUserClient>();

  const apiUtils = api.useUtils();
  const router = useRouter();

  const {
    mutate: update,
    isLoading: updateLoading,
    error: updateError,
    isSuccess: updateSuccess,
  } = api.user.update.useMutation({
    onSuccess: () => {
      void apiUtils.user.currentBySession.invalidate();
      router.push(`/account/${formData?.username}`);
    },
  });

  const {
    mutate: getPresignedUrl,
    error: presignedUrlError,
    isLoading: presignedUrlLoading,
  } = api.user.getPresignedUrl.useMutation({
    onSuccess: async (presignedUrl) => {
      if (!formData) return;

      if (!presignedUrl) {
        update({ ...formData, profileImage: undefined });
        return;
      }

      const imageUrls = await uploadFilesToS3UsingPresignedUrls(
        [presignedUrl],
        formData.profileImage,
      );

      update({ ...formData, profileImage: imageUrls[0] });
    },
  });

  function handleSubmit(formValues: UpdateUserClient) {
    setFormData(formValues);

    const profileImage = formValues.profileImage.map((file) => ({
      contentLength: file.size,
      contentType: file.type,
    }))[0];

    getPresignedUrl({
      ...formValues,
      profileImage,
    });
  }

  function getButtonText() {
    if (updateSuccess) return "Redirecting you now...";
    if (updateLoading) return "Creating...";
    if (presignedUrlLoading) return "Uploading images...";
    return "Submit";
  }

  const submitDisabled = updateLoading || presignedUrlLoading || updateSuccess;

  return (
    <>
      <EditUserForm
        onSubmit={handleSubmit}
        buttonLabel={getButtonText()}
        submitDisabled={submitDisabled}
      />

      {!!updateError?.data?.zodError && (
        <ServerZodError zodError={updateError?.data?.zodError} />
      )}

      {!!presignedUrlError?.data?.zodError && (
        <ServerZodError zodError={presignedUrlError?.data?.zodError} />
      )}

      <ServerErrorMessage
        message={presignedUrlError?.message ?? updateError?.message}
        code={presignedUrlError?.data?.code ?? updateError?.data?.code}
      />
    </>
  );
}
