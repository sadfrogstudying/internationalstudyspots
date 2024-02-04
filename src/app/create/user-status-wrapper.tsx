"use client";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { api } from "@/trpc/react";
import { useState } from "react";

export default function UserStatusWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Since we're dehydrating currentBySession in the page, userLoading will never be true
  // Leaving here as it could be used when not dehydrating & ssring
  const { data: user, isLoading: userLoading } =
    api.user.currentBySession.useQuery(undefined);

  const [isPreview, setIsPreview] = useState(false);

  if (!user?.username && !userLoading && !isPreview) {
    return (
      <>
        <p className="text-gray-500">
          You need to finish creating your account before you can add spots and
          view your profile.
        </p>
        <div className="flex max-w-sm flex-wrap gap-2">
          <Button asChild variant="success" className="flex-grow">
            <Link href={`/account/edit`}>Finish Account</Link>
          </Button>
          <Button
            variant="default"
            onClick={() => setIsPreview(true)}
            className="flex-grow"
          >
            I just want to have a look
          </Button>
        </div>
      </>
    );
  }

  if (userLoading) return <p>Checking User 🤦‍♂️...</p>;

  return <>{children}</>;
}
