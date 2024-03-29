"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

import type { UpdateUserClient } from "@/schemas/user";
import { uploadFilesToS3UsingPresignedUrls } from "@/lib/utils";

import ServerZodError from "@/components/server-zod-error";
import ServerErrorMessage from "@/components/server-error-message";
import EditUserForm from "@/components/edit-user-form";

export default function EditUserFormController() {
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
    const hasNewImages = !!formData?.profileImage.length;

    if (presignedUrlLoading && hasNewImages) return "Uploading images...";
    if (presignedUrlLoading) return "Creating...";
    if (updateLoading) return "Creating...";
    if (updateSuccess) return "Redirecting you now...";

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
